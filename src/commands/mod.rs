use clap::Parser;

use crate::error::Result;

pub mod plugin;

#[derive(Debug, Parser)]
pub enum Subcommands {
    Plugin(plugin::Plugin),
}

impl Subcommands {
    pub(crate) async fn run(&self) -> Result {
        match self {
            Self::Plugin(x) => x.run().await,
        }
    }
}
