use std::io::{stdout, Write};

use crate::{client::plugin_service_client::PluginServiceClient, error::Result};

use clap::Parser;

/// Say hello to someone
#[derive(Debug, Parser)]
pub struct Hello {}

impl Hello {
    pub async fn run(self) -> Result {
        PluginServiceClient::connect("http://[::1]:50051").await?;

        stdout().flush()?;

        Ok(())
    }
}
