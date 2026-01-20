use std::path::Path;

use eyre::eyre;
use wasmtime::{
    Config, Engine, Store,
    component::{Component, Linker},
};
use wasmtime_wasi::{ResourceTable, WasiCtx, WasiCtxBuilder, WasiView};

use crate::error::Result;

mod bindings {
    wasmtime::component::bindgen!({
        world: "plugin",
        path: "plugin/wit",
    });
}

pub use bindings::dotsync::plugin::host::Host;
use bindings::Plugin;

pub struct PluginState<H: Host> {
    ctx: WasiCtx,
    table: ResourceTable,
    host: H,
}

impl<H: Host + Send> WasiView for PluginState<H> {
    fn ctx(&mut self) -> &mut WasiCtx {
        &mut self.ctx
    }

    fn table(&mut self) -> &mut ResourceTable {
        &mut self.table
    }
}

impl<H: Host> Host for PluginState<H> {
    fn subrun(
        &mut self,
        plugin_id: String,
        config_json: String,
    ) -> std::result::Result<(), String> {
        self.host.subrun(plugin_id, config_json)
    }
}

pub struct PluginRuntime {
    engine: Engine,
}

impl PluginRuntime {
    pub fn new() -> Result<Self> {
        let mut config = Config::new();

        config.wasm_component_model(true);

        let engine =
            Engine::new(&config).map_err(|e| eyre!("failed to create wasm engine: {}", e))?;

        Ok(Self { engine })
    }

    pub fn load<H: Host + Send>(&self, path: &Path, host: H) -> Result<LoadedPlugin<H>> {
        let component = Component::from_file(&self.engine, path)
            .map_err(|e| eyre!("failed to load plugin from {}: {}", path.display(), e))?;

        let mut linker = Linker::<PluginState<H>>::new(&self.engine);

        wasmtime_wasi::add_to_linker_sync(&mut linker)
            .map_err(|e| eyre!("failed to link wasi: {}", e))?;

        bindings::dotsync::plugin::host::add_to_linker(&mut linker, |state| state)
            .map_err(|e| eyre!("failed to link host: {}", e))?;

        let state = PluginState {
            ctx: WasiCtxBuilder::new().build(),
            table: ResourceTable::new(),
            host,
        };

        let mut store = Store::new(&self.engine, state);
        let instance = Plugin::instantiate(&mut store, &component, &linker)
            .map_err(|e| eyre!("failed to instantiate plugin: {}", e))?;

        Ok(LoadedPlugin { store, instance })
    }
}

pub struct LoadedPlugin<H: Host> {
    store: Store<PluginState<H>>,
    instance: Plugin,
}

impl<H: Host> LoadedPlugin<H> {
    pub fn id(&mut self) -> Result<String> {
        self.instance
            .call_id(&mut self.store)
            .map_err(|e| eyre!("failed to call id: {}", e))
    }

    pub fn dependencies(&mut self) -> Result<Vec<String>> {
        self.instance
            .call_dependencies(&mut self.store)
            .map_err(|e| eyre!("failed to call dependencies: {}", e))
    }

    pub fn config_schema(&mut self) -> Result<String> {
        self.instance
            .call_config_schema(&mut self.store)
            .map_err(|e| eyre!("failed to call config_schema: {}", e))
    }

    pub fn run(&mut self, config_json: &str) -> Result<()> {
        self.instance
            .call_run(&mut self.store, config_json)
            .map_err(|e| eyre!("failed to call run: {}", e))?
            .map_err(|e| eyre!("plugin run failed: {}", e))
    }
}
