use eyre::eyre;
use wasmtime::Store;

use crate::{
    error::Result,
    runtime::{State, bindings::Plugin},
};

pub struct PluginInstance {
    pub store: Store<State>,
    pub instance: Plugin,
}

#[allow(dead_code)]
impl PluginInstance {
    pub fn id(&mut self) -> Result<String> {
        self.instance
            .call_id(&mut self.store)
            .map_err(|e| eyre!("failed to call plugin's id: {}", e))
    }

    pub fn description(&mut self) -> Result<String> {
        self.instance
            .call_description(&mut self.store)
            .map_err(|e| eyre!("failed to call plugin's description: {}", e))
    }

    pub fn dependencies(&mut self) -> Result<Vec<String>> {
        self.instance
            .call_dependencies(&mut self.store)
            .map_err(|e| eyre!("failed to call plugin's dependencies: {}", e))
    }

    pub fn config_schema(&mut self) -> Result<String> {
        self.instance
            .call_config_schema(&mut self.store)
            .map_err(|e| eyre!("failed to call plugin's config_schema: {}", e))
    }

    pub fn run(&mut self, config_json: &str) -> Result {
        self.instance
            .call_run(&mut self.store, config_json)
            .map_err(|e| eyre!("failed to call plugin's run: {}", e))?
            .map_err(|e| eyre!("plugin run failed: {}", e))
    }
}
