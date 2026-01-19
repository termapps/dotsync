use std::{
    fmt::{Display, Formatter, Result as FmtResult},
    fs::create_dir_all,
    path::PathBuf,
    str::FromStr,
};

use clap::{Parser, Subcommand};
use eyre::{Report, eyre};
use tracing::instrument;

use crate::error::Result;

pub mod install;
pub mod list;
pub mod uninstall;

/// Manage plugins
#[derive(Debug, Parser)]
pub struct Plugin {
    #[command(subcommand)]
    pub cmd: Subcommands,
}

#[derive(Debug, Subcommand)]
pub enum Subcommands {
    Install(install::Install),
    Uninstall(uninstall::Uninstall),
    List(list::List),
}

impl Plugin {
    #[instrument(name = "plugin", skip_all)]
    pub(crate) async fn run(&self) -> Result {
        match &self.cmd {
            Subcommands::Install(x) => x.run().await,
            Subcommands::Uninstall(x) => x.run().await,
            Subcommands::List(x) => x.run().await,
        }
    }
}

#[derive(Clone, Debug)]
pub struct PluginId {
    pub owner: String,
    pub name: String,
    pub repo: String,
}

impl FromStr for PluginId {
    type Err = Report;

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        if s.is_empty() {
            return Err(eyre!("invalid plugin id"));
        }

        if let Some((owner, name)) = s.split_once('/') {
            if owner.is_empty() || name.is_empty() {
                return Err(eyre!("invalid plugin id; expected owner/name or name"));
            }

            return Ok(Self {
                owner: owner.to_string(),
                name: name.to_string(),
                repo: s.to_string(),
            });
        }

        Ok(Self {
            owner: "dotsync".to_string(),
            name: s.to_string(),
            repo: "termapps/dotsync".to_string(),
        })
    }
}

impl Display for PluginId {
    fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
        write!(f, "{}/{}", self.owner, self.name)
    }
}

fn plugins_dir() -> Result<PathBuf> {
    let mut base = dirs::data_dir().ok_or_else(|| eyre!("failed to determine data dir"))?;

    base.push("dotsync");
    base.push("plugins");

    Ok(base)
}

fn plugin_path(id: &PluginId) -> Result<PathBuf> {
    let mut base = plugins_dir()?;

    base.push(&id.owner);

    create_dir_all(&base)?;

    base.push(format!("{}.wasm", id.name));

    Ok(base)
}
