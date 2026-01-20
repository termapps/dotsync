use std::{
    collections::HashSet,
    fs::{File, create_dir_all},
    io::Write as _,
    str::FromStr,
    sync::Arc,
};

use clap::Parser;
use eyre::eyre;
use reqwest::blocking::Client;
use serde::Deserialize;
use tracing::{info, instrument};

use crate::{
    commands::plugin::{PluginId, plugin_path},
    error::Result,
    runtime::Runtime,
};

#[derive(Debug, Deserialize)]
struct Release {
    assets: Vec<Asset>,
}

#[derive(Debug, Deserialize)]
struct Asset {
    name: String,
    browser_download_url: String,
}

/// Installs a plugin
#[derive(Debug, Parser)]
pub struct Install {
    pub plugin: PluginId,
}

impl Install {
    #[instrument(name = "install", skip_all)]
    pub(crate) fn run(&self) -> Result {
        let mut installed = HashSet::new();

        self.install_recursive(&self.plugin, &mut installed)
    }

    fn install_recursive(&self, plugin: &PluginId, installed: &mut HashSet<String>) -> Result {
        let plugin_str = plugin.to_string();

        if installed.contains(&plugin_str) {
            return Ok(());
        }

        let out_path = plugin_path(plugin)?;

        if out_path.exists() {
            info!("plugin {} already installed", plugin);
            installed.insert(plugin_str);
            return Ok(());
        }

        info!("installing plugin {}", plugin);

        self.download_plugin(plugin)?;
        installed.insert(plugin_str);

        let runtime = Arc::new(Runtime::default());

        let mut plugin = runtime.load_plugin(plugin)?;

        let dependencies = plugin.dependencies()?;

        for dep in dependencies {
            let dep_id = PluginId::from_str(&dep)?;

            self.install_recursive(&dep_id, installed)?;
        }

        Ok(())
    }

    fn download_plugin(&self, plugin: &PluginId) -> Result {
        // TODO: If debug assertion (in dev), use the wasm file from `target/release`

        let client = Client::builder().user_agent("dotsync").build()?;

        let release_url = format!(
            "https://api.github.com/repos/{}/releases/latest",
            plugin.repo
        );

        let release: Release = client.get(release_url).send()?.error_for_status()?.json()?;

        let asset = release
            .assets
            .into_iter()
            .find(|a| a.name.starts_with(&plugin.name) && a.name.ends_with(".wasm"))
            .ok_or_else(|| {
                eyre!(
                    "no release asset found matching {}*.wasm in repo {} for plugin {}",
                    plugin.name,
                    plugin.repo,
                    plugin,
                )
            })?;

        let bytes = client
            .get(asset.browser_download_url)
            .send()?
            .error_for_status()?
            .bytes()?;

        let out_path = plugin_path(plugin)?;

        if let Some(parent) = out_path.parent() {
            create_dir_all(parent)?;
        }

        let mut file = File::create(&out_path)?;

        file.write_all(&bytes)?;
        file.flush()?;

        Ok(())
    }
}
