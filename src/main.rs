use std::io::stdout;

use anstream::{AutoStream, ColorChoice};
use clap::Parser;
use dotsync::{App, error};
use tracing_subscriber::prelude::*;

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
                .with_filter(program.verbose.tracing_level_filter()),
        )
        .init();

    let result = program.run().await;

    error::finish(result);
}
