use std::collections::HashMap;

use dotsync_plugin::prelude::*;

#[config]
struct LinkConfig {
    links: HashMap<String, String>,
}

#[derive(Default)]
struct Link;

impl Plugin for Link {
    const ID: &'static str = "link";
    const DESCRIPTION: &'static str = "Symlink plugin";

    type Config = LinkConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }

    fn run(&mut self, config: Self::Config) -> Result<(), String> {
        for (source, target) in config.links {
            let abs_source = self.resolve_path(&source)?;

            let mkdir = format!("mkdir -p \"$(dirname '{target}')\"");
            let output = self.run_command(&mkdir, &[])?;

            if !output.success() {
                return Err(format!(
                    "failed to create parent directory for {target}: {}",
                    output.stderr
                ));
            }

            let ln = format!("ln -sf '{abs_source}' '{target}'");
            let output = self.run_command(&ln, &[])?;

            if !output.success() {
                return Err(format!(
                    "failed to create symlink {source} -> {target}: {}",
                    output.stderr
                ));
            }
        }

        Ok(())
    }
}

register!(Link);
