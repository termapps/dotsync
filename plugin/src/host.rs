use serde::Serialize;
use serde_json::to_string;

use crate::{Plugin, wit::dotsync::plugin::host};

pub struct CommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
}

impl CommandOutput {
    pub fn success(&self) -> bool {
        self.exit_code == Some(0)
    }
}

pub trait PluginHost {
    fn subrun<C: Serialize>(&self, plugin_id: &str, config: &C) -> Result<(), String>;

    fn run_command(&self, command: &str, env: &[(&str, &str)]) -> Result<CommandOutput, String>;

    fn resolve_path(&self, path: &str) -> Result<String, String>;

}

impl<T: Plugin> PluginHost for T {
    fn subrun<C: Serialize>(&self, plugin_id: &str, config: &C) -> Result<(), String> {
        let config_json =
            to_string(config).map_err(|e| format!("failed to serialize config: {e}"))?;

        host::subrun(plugin_id, &config_json)
    }

    fn run_command(&self, command: &str, env: &[(&str, &str)]) -> Result<CommandOutput, String> {
        let env = env
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect::<Vec<_>>();

        host::run_command(command, &env).map(|o| CommandOutput {
            stdout: o.stdout,
            stderr: o.stderr,
            exit_code: o.exit_code,
        })
    }

    fn resolve_path(&self, path: &str) -> Result<String, String> {
        host::resolve_path(path)
    }

    }
}
