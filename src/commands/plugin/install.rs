use std::{
    collections::HashSet,
    fs::{File, create_dir_all},
    io::Write as _,
    str::FromStr,
};

use clap::Parser;
use eyre::eyre;
use reqwest::Client;
use serde::Deserialize;
use tracing::{info, instrument};

use crate::{
    commands::plugin::{PluginId, plugin_path},
    error::Result,
    runtime::{Host, PluginRuntime},
};

struct NoopHost;

impl Host for NoopHost {
    fn subrun(&mut self, _plugin_id: String, _config_json: String) -> std::result::Result<(), String> {
        Err("subrun not available during install".to_string())
    }

    fn run_command(
        &mut self,
        _command: String,
        _env: Vec<(String, String)>,
    ) -> std::result::Result<crate::runtime::CommandOutput, String> {
        Err("run_command not available during install".to_string())
    }
}

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
    pub(crate) async fn run(&self) -> Result {
        let mut installed = HashSet::new();

        self.install_recursive(&self.plugin, &mut installed).await
    }

    async fn install_recursive(
        &self,
        plugin: &PluginId,
        installed: &mut HashSet<String>,
    ) -> Result {
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

        self.download_plugin(plugin).await?;
        installed.insert(plugin_str);

        let runtime = PluginRuntime::new()?;
        let mut loaded = runtime.load(&out_path, NoopHost)?;
        let dependencies = loaded.dependencies()?;

        for dep in dependencies {
            let dep_id = PluginId::from_str(&dep)?;

            Box::pin(self.install_recursive(&dep_id, installed)).await?;
        }

        Ok(())
    }

    async fn download_plugin(&self, plugin: &PluginId) -> Result {
        // TODO: If debug assertion (in dev), use the wasm file from `target/release`

        let client = Client::builder().user_agent("dotsync").build()?;

        let release_url = format!(
            "https://api.github.com/repos/{}/releases/latest",
            plugin.repo
        );

        let release: Release = client
            .get(release_url)
            .send()
            .await?
            .error_for_status()?
            .json()
            .await?;

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
            .send()
            .await?
            .error_for_status()?
            .bytes()
            .await?;

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
