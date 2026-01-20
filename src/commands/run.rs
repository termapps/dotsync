use std::{fs::read_to_string, str::FromStr};

use clap::Parser;
use serde::Deserialize;
use serde_json::Value;
use tracing::{info, instrument};

use crate::commands::plugin::{PluginId, install::Install, plugin_path};
use crate::error::Result;
use crate::runtime::{Host, PluginRuntime};

#[derive(Debug, Deserialize)]
struct Config {
    plugins: Vec<PluginEntry>,
}

#[derive(Debug, Deserialize)]
struct PluginEntry {
    id: String,
    #[serde(default)]
    config: Value,
}

/// Sync your dotfiles
#[derive(Debug, Parser)]
pub struct Run;

struct Executor {
    runtime: PluginRuntime,
}

impl Executor {
    fn run_plugin(&self, plugin_id: &PluginId, config_json: &str) -> Result<()> {
        tokio::task::block_in_place(|| {
            tokio::runtime::Handle::current().block_on(async {
                let install = Install {
                    plugin: plugin_id.clone(),
                };
                install.run().await
            })
        })?;

        let out_path = plugin_path(plugin_id)?;
        let host = SubrunHost {
            executor: self,
        };

        let mut loaded = self.runtime.load(&out_path, host)?;

        info!("running plugin {}", plugin_id);
        loaded.run(config_json)
    }
}

struct SubrunHost<'a> {
    executor: &'a Executor,
}

impl Host for SubrunHost<'_> {
    fn subrun(&mut self, plugin_id: String, config_json: String) -> std::result::Result<(), String> {
        let id = PluginId::from_str(&plugin_id).map_err(|e| e.to_string())?;

        self.executor
            .run_plugin(&id, &config_json)
            .map_err(|e| e.to_string())
    }
}

impl Run {
    #[instrument(name = "run", skip_all)]
    pub(crate) async fn run(&self) -> Result {
        let content = read_to_string("config.json")?;
        let config = serde_json::from_str::<Config>(&content)?;

        info!("found {} plugins in config", config.plugins.len());

        let runtime = PluginRuntime::new()?;
        let executor = Executor { runtime };

        for entry in &config.plugins {
            let plugin_id = PluginId::from_str(&entry.id)?;
            let config_json = serde_json::to_string(&entry.config)?;

            executor.run_plugin(&plugin_id, &config_json)?;
        }

        Ok(())
    }
}
