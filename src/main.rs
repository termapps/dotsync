mod error;

mod hello;

use clap::Parser;
use clap_verbosity_flag::{InfoLevel, Verbosity};
use concolor_clap::{color_choice, Color};

/// Command line utility to manage dotfiles
#[derive(Debug, Parser)]
#[clap(name = "dotsync", version)]
#[clap(color = color_choice())]
struct App {
    #[clap(subcommand)]
    cmd: Subcommands,

    #[clap(flatten)]
    color: Color,

    #[clap(flatten)]
    verbose: Verbosity<InfoLevel>,
}

#[derive(Debug, Parser)]
enum Subcommands {
    Hello(hello::Hello),
}

fn main() {
    let program = App::parse();

    program.color.apply();

    env_logger::Builder::from_default_env()
        .format_target(false)
        .format_timestamp(None)
        .filter_level(program.verbose.log_level_filter())
        .init();

    let result = match program.cmd {
        Subcommands::Hello(x) => x.run(),
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
