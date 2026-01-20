use clap::Parser;

use crate::error::Result;

pub mod plugin;
pub mod run;

#[derive(Debug, Parser)]
pub enum Subcommands {
    Plugin(plugin::Plugin),
    Run(run::Run),
}

impl Subcommands {
    pub(crate) fn run(&self) -> Result {
        match self {
            Self::Plugin(x) => x.run(),
            Self::Run(x) => x.run(),
        }
    }
}
