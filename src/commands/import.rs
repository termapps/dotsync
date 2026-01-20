use std::sync::Arc;

use clap::Parser;
use tracing::{info, instrument};

use crate::{commands::plugin::PluginId, error::Result, runtime::Runtime};

/// Import plugin configuration from your system
#[derive(Debug, Parser)]
pub struct Import {
    /// Identifier of the plugin
    pub plugin: PluginId,
}

impl Import {
    #[instrument(name = "import", skip_all)]
    pub(crate) fn run(&self) -> Result {
        let runtime = Arc::new(Runtime::default());
        let mut plugin = runtime.load_plugin(&self.plugin)?;

        info!("importing configuration for plugin {}", self.plugin);

        let config_json = plugin.import_config()?;

        println!("{}", config_json);

        Ok(())
    }
}
