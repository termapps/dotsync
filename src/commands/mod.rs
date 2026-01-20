use clap::Parser;

use crate::error::Result;

pub mod import;
pub mod plugin;
pub mod run;

#[derive(Debug, Parser)]
pub enum Subcommands {
    Run(run::Run),
    Plugin(plugin::Plugin),
    Import(import::Import),
}

impl Subcommands {
    pub(crate) fn run(&self) -> Result {
        match self {
            Self::Run(x) => x.run(),
            Self::Import(x) => x.run(),
            Self::Plugin(x) => x.run(),
        }
    }
}
