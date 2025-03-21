use std::io::stdout;

use anstream::{AutoStream, ColorChoice};
use clap::Parser;
use clap_verbosity_flag::{InfoLevel, Verbosity};
use colorchoice_clap::Color;
use tracing_log::AsTrace;
use tracing_subscriber::prelude::*;

#[path = "tech.dotsync.rs"]
mod client;

mod error;
mod styles;

mod hello;

/// Command line utility to manage dotfiles
#[derive(Debug, Parser)]
#[clap(name = "dotsync", version)]
#[command(styles = styles::styles())]
struct App {
    #[command(subcommand)]
    cmd: Subcommands,

    #[command(flatten)]
    color: Color,

    #[command(flatten)]
    verbose: Verbosity<InfoLevel>,
}

#[derive(Debug, Parser)]
enum Subcommands {
    Hello(hello::Hello),
}

#[tokio::main]
async fn main() {
    let program = App::parse();

    program.color.write_global();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .without_time()
                .with_target(false)
                .with_ansi(!matches!(AutoStream::choice(&stdout()), ColorChoice::Never))
                .with_filter(program.verbose.log_level_filter().as_trace()),
        )
        .init();

    let result = match program.cmd {
        Subcommands::Hello(x) => x.run().await,
    };

    error::finish(result);
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
