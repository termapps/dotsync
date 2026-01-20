use std::{fs::read_to_string, str::FromStr, sync::Arc};

use clap::Parser;
use serde::Deserialize;
use serde_json::Value;
use tracing::{info, instrument};

use crate::{commands::plugin::PluginId, error::Result, runtime::Runtime};

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

impl Run {
    #[instrument(name = "run", skip_all)]
    pub(crate) fn run(&self) -> Result {
        let content = read_to_string("config.json")?;
        let config = serde_json::from_str::<Config>(&content)?;

        info!("found {} plugins in config", config.plugins.len());

        let runtime = Arc::new(Runtime::default());

        for entry in &config.plugins {
            let plugin_id = PluginId::from_str(&entry.id)?;
            let config_json = serde_json::to_string(&entry.config)?;

            runtime.run_plugin(&plugin_id, &config_json)?;
        }

        Ok(())
    }
}
