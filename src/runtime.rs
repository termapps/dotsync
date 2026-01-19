use std::path::Path;

use eyre::eyre;
use wasmtime::{
    Config, Engine, Store,
    component::{Component, Linker},
};
use wasmtime_wasi::{ResourceTable, WasiCtx, WasiCtxBuilder, WasiView};

use crate::error::Result;

wasmtime::component::bindgen!({
    world: "plugin",
    path: "plugin/wit",
});

struct PluginState {
    ctx: WasiCtx,
    table: ResourceTable,
}

impl WasiView for PluginState {
    fn ctx(&mut self) -> &mut WasiCtx {
        &mut self.ctx
    }

    fn table(&mut self) -> &mut ResourceTable {
        &mut self.table
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

    pub fn load(&self, path: &Path) -> Result<LoadedPlugin> {
        let component = Component::from_file(&self.engine, path)
            .map_err(|e| eyre!("failed to load plugin from {}: {}", path.display(), e))?;

        let mut linker = Linker::<PluginState>::new(&self.engine);

        wasmtime_wasi::add_to_linker_sync(&mut linker)
            .map_err(|e| eyre!("failed to link wasi: {}", e))?;

        let state = PluginState {
            ctx: WasiCtxBuilder::new().build(),
            table: ResourceTable::new(),
        };

        let mut store = Store::new(&self.engine, state);
        let instance = Plugin::instantiate(&mut store, &component, &linker)
            .map_err(|e| eyre!("failed to instantiate plugin: {}", e))?;

        Ok(LoadedPlugin { store, instance })
    }
}

pub struct LoadedPlugin {
    store: Store<PluginState>,
    instance: Plugin,
}

impl LoadedPlugin {
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
}
