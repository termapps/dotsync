use std::io::{Write, stdout};

use clap::Parser;
use tracing::instrument;

use crate::{error::Result};

/// Say hello to someone
#[derive(Debug, Parser)]
pub struct Hello {}

impl Hello {
    #[instrument(name = "hello", skip_all)]
    pub(crate) async fn run(&self) -> Result {
        stdout().flush()?;

        Ok(())
    }
}
