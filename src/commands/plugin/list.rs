use std::fs::read_dir;

use clap::Parser;
use tracing::instrument;

use crate::{commands::plugin::plugins_dir, error::Result};

/// Lists all installed plugins
#[derive(Debug, Parser)]
pub struct List;

impl List {
    #[instrument(name = "list", skip_all)]
    pub(crate) fn run(&self) -> Result {
        let base = plugins_dir()?;

        if !base.exists() {
            return Ok(());
        }

        for owner_ent in read_dir(&base)? {
            let owner_ent = owner_ent?;
            let owner_path = owner_ent.path();

            if !owner_path.is_dir() {
                continue;
            }

            let owner = match owner_path.file_name().and_then(|x| x.to_str()) {
                Some(x) => x.to_string(),
                None => continue,
            };

            for wasm_ent in read_dir(&owner_path)? {
                let wasm_ent = wasm_ent?;
                let wasm_path = wasm_ent.path();

                if wasm_path.extension().and_then(|x| x.to_str()) != Some("wasm") {
                    continue;
                }

                let name = match wasm_path.file_stem().and_then(|x| x.to_str()) {
                    Some(x) => x.to_string(),
                    None => continue,
                };

                if owner == "dotsync" {
                    println!("{}", name);
                } else {
                    println!("{}/{}", owner, name);
                }
            }
        }

        Ok(())
    }
}
