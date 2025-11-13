use std::io::{Write, stdout};

use clap::Parser;
use tracing::instrument;

use crate::{client::plugin_service_client::PluginServiceClient, error::Result};

/// Say hello to someone
#[derive(Debug, Parser)]
pub struct Hello {}

impl Hello {
    #[instrument(name = "hello", skip_all)]
    pub(crate) async fn run(&self) -> Result {
        PluginServiceClient::connect("http://[::1]:50051").await?;

        stdout().flush()?;

        Ok(())
    }
}
