use clap::Parser;

/// Command line utility to manage dotfiles
#[derive(Debug, Parser)]
#[clap(name = "dotsync")]
struct App {
    #[clap(subcommand)]
    cmd: Subcommands,
}

#[derive(Debug, Parser)]
enum Subcommands {}

fn main() {
    let program = App::parse();

    match program.cmd {
        // Subcommands::Pie(x) => x.run(),
    }
}
