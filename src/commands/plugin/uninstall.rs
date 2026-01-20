use std::{
    fs::{read_dir, remove_dir, remove_file},
    io::ErrorKind,
    path::Path,
};

use clap::Parser;
use eyre::eyre;
use tracing::instrument;

use crate::{
    commands::plugin::{PluginId, plugins_dir},
    error::Result,
};

/// Uninstalls a plugin
#[derive(Debug, Parser)]
pub struct Uninstall {
    pub plugin: PluginId,
}

impl Uninstall {
    #[instrument(name = "uninstall", skip_all)]
    pub(crate) fn run(&self) -> Result {
        let base = plugins_dir()?;
        let owner_dir = base.join(&self.plugin.owner);
        let wasm_path = owner_dir.join(format!("{}.wasm", self.plugin.name));

        match remove_file(&wasm_path) {
            Ok(()) => {}
            Err(e) if e.kind() == ErrorKind::NotFound => {
                return Err(eyre!("plugin {} is not installed", self.plugin));
            }
            Err(e) => return Err(e.into()),
        }

        if owner_dir.is_dir() && is_dir_empty(&owner_dir)? {
            remove_dir(&owner_dir)?;
        }

        Ok(())
    }
}

fn is_dir_empty(path: &Path) -> Result<bool> {
    Ok(read_dir(path)?.next().is_none())
}
