use std::sync::Arc;

use eyre::eyre;
use tracing::info;
use wasmtime::{
    Engine, Store,
    component::{Component, HasSelf, Linker},
};

use crate::{
    commands::plugin::{PluginId, install::Install, plugin_path},
    error::Result,
    runtime::{
        bindings::{
            Plugin,
            dotsync::plugin::host::{CommandOutput, Host, add_to_linker},
        },
        instance::PluginInstance,
        state::State,
    },
};

mod bindings;
mod instance;
mod state;

#[derive(Default)]
pub(crate) struct Runtime {
    engine: Engine,
}

impl Runtime {
    fn install_plugin(self: &Arc<Self>, plugin_id: &PluginId) -> Result {
        let install = Install {
            plugin: plugin_id.clone(),
            force: false,
        };

        install.run()
    }

    pub(crate) fn load_plugin_with_install(
        self: &Arc<Self>,
        plugin_id: &PluginId,
    ) -> Result<PluginInstance> {
        self.install_plugin(plugin_id)?;
        self.load_plugin(plugin_id)
    }

    pub(crate) fn load_plugin(self: &Arc<Self>, plugin_id: &PluginId) -> Result<PluginInstance> {
        let path = plugin_path(plugin_id)?;

        let component = Component::from_file(&self.engine, path.clone())
            .map_err(|e| eyre!("failed to load plugin from {}: {}", path.display(), e))?;

        let mut linker = Linker::new(&self.engine);

        wasmtime_wasi::p2::add_to_linker_sync(&mut linker)
            .map_err(|e| eyre!("failed to link wasi: {}", e))?;

        add_to_linker::<_, HasSelf<_>>(&mut linker, |state| state)
            .map_err(|e| eyre!("failed to link state: {}", e))?;

        let state = State::new(self.clone());
        let mut store = Store::new(&self.engine, state);

        let instance = Plugin::instantiate(&mut store, &component, &linker)
            .map_err(|e| eyre!("failed to instantiate plugin: {}", e))?;

        Ok(PluginInstance { store, instance })
    }

    pub(crate) fn run_plugin(
        self: &Arc<Self>,
        plugin_id: &PluginId,
        config_json: &str,
    ) -> Result<()> {
        let mut plugin = self.load_plugin_with_install(plugin_id)?;

        info!("running plugin {}", plugin_id);
        plugin.run(config_json)
    }
}
