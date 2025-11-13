use clap::Parser;
use clap_verbosity_flag::{InfoLevel, Verbosity};
use colorchoice_clap::Color;

use crate::{commands::Subcommands, error::Result};

pub mod error;
mod styles;

pub mod commands;

#[path = "tech.dotsync.rs"]
mod client;

/// Command line utility to manage dotfiles
#[derive(Debug, Parser)]
#[clap(name = "dotsync", version)]
#[command(styles = styles::styles())]
pub struct App {
    #[command(subcommand)]
    pub cmd: Subcommands,

    #[command(flatten)]
    pub color: Color,

    #[command(flatten)]
    pub verbose: Verbosity<InfoLevel>,
}

impl App {
    pub async fn run(self) -> Result {
        self.cmd.run().await
    }

    pub fn new(cmd: Subcommands) -> Self {
        App {
            cmd,
            color: Color::default(),
            verbose: Verbosity::default(),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    use clap::CommandFactory;

    #[test]
    fn verify_app() {
        App::command().debug_assert();
    }

    #[test]
    fn sourcegen_plugin_server() {
        tonic_build::configure()
            .build_client(false)
            .build_server(true)
            .out_dir("plugin/src")
            .compile(&["proto/plugin_1_0.proto"], &["proto"])
            .unwrap();
    }

    #[test]
    fn sourcegen_plugin_client() {
        tonic_build::configure()
            .build_client(true)
            .build_server(false)
            .out_dir("src")
            .compile(&["proto/plugin_1_0.proto"], &["proto"])
            .unwrap();
    }
}
