use std::collections::HashMap;

use dotsync_plugin::{Config, OperatingSystems, Plugin, register};

#[derive(Default, Config)]
struct CommandConfig {
    env: Option<HashMap<String, String>>,
    commands: Vec<String>,
}

#[derive(Default)]
struct Command;

impl Plugin for Command {
    const ID: &'static str = "command";
    const DESCRIPTION: &'static str = "Command runner plugin";

    type Config = CommandConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }

    fn run(&mut self, config: Self::Config) -> Result<(), String> {
        let env_map = config.env.unwrap_or_default();

        let env = env_map
            .iter()
            .map(|(k, v)| (k.as_str(), v.as_str()))
            .collect::<Vec<_>>();

        for command in config.commands {
            let output = dotsync_plugin::run_command(&command, &env)?;

            if !output.success() {
                return Err(format!(
                    "command `{}` failed with exit code {:?}\nstderr: {}",
                    command, output.exit_code, output.stderr
                ));
            }
        }

        Ok(())
    }
}

register!(Command);
