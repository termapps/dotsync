use clap::Parser;

use crate::error::Result;

pub mod hello;

#[derive(Debug, Parser)]
pub enum Subcommands {
    Hello(hello::Hello),
}

impl Subcommands {
    pub(crate) fn run(&self) -> Result {
        match self {
            Self::Hello(x) => x.run(),
        }
    }
}
