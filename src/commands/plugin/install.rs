use std::{
    fs::{File, create_dir_all},
    io::Write as _,
};

use clap::Parser;
use eyre::eyre;
use reqwest::Client;
use serde::Deserialize;
use tracing::instrument;

use crate::{
    commands::plugin::{PluginId, plugin_path},
    error::Result,
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
    pub(crate) async fn run(&self) -> Result {
        // TODO: If debug assertion (in dev), use the wasm file from `target/release`

        let client = Client::builder().user_agent("dotsync").build()?;

        let release_url = format!(
            "https://api.github.com/repos/{}/releases/latest",
            self.plugin.repo
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
            .find(|a| a.name.starts_with(&self.plugin.name) && a.name.ends_with(".wasm"))
            .ok_or_else(|| {
                eyre!(
                    "no release asset found matching {}*.wasm in repo {} for plugin {}",
                    self.plugin.name,
                    self.plugin.repo,
                    self.plugin,
                )
            })?;

        let bytes = client
            .get(asset.browser_download_url)
            .send()
            .await?
            .error_for_status()?
            .bytes()
            .await?;

        let out_path = plugin_path(&self.plugin)?;

        if let Some(parent) = out_path.parent() {
            create_dir_all(parent)?;
        }

        let mut file = File::create(&out_path)?;

        file.write_all(&bytes)?;
        file.flush()?;

        Ok(())
    }
}
