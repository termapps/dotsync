use std::{
    fs::canonicalize,
    path::{Path, PathBuf},
    process::Command,
    str::FromStr as _,
    sync::Arc,
};

use wasmtime::component::ResourceTable;
use wasmtime_wasi::{WasiCtx, WasiCtxBuilder, WasiCtxView, WasiView};

use crate::{
    commands::plugin::PluginId,
    runtime::{CommandOutput, Host, Runtime},
};

pub(crate) struct State {
    executor: Arc<Runtime>,
    ctx: WasiCtx,
    table: ResourceTable,
}

impl State {
    pub(crate) fn new(executor: Arc<Runtime>) -> Self {
        Self {
            executor,
            ctx: WasiCtxBuilder::new().build(),
            table: ResourceTable::new(),
        }
    }
}

impl WasiView for State {
    fn ctx(&mut self) -> WasiCtxView<'_> {
        WasiCtxView {
            ctx: &mut self.ctx,
            table: &mut self.table,
        }
    }
}

impl Host for State {
    fn subrun(&mut self, plugin_id: String, config_json: String) -> Result<(), String> {
        let id = PluginId::from_str(&plugin_id).map_err(|e| e.to_string())?;

        self.executor
            .run_plugin(&id, &config_json)
            .map_err(|e| e.to_string())
    }

    fn run_command(
        &mut self,
        command: String,
        env: Vec<(String, String)>,
    ) -> Result<CommandOutput, String> {
        let output = Command::new("sh")
            .arg("-c")
            .arg(&command)
            .envs(env)
            .output()
            .map_err(|e| format!("failed to execute command: {e}"))?;

        Ok(CommandOutput {
            stdout: String::from_utf8_lossy(&output.stdout).into_owned(),
            stderr: String::from_utf8_lossy(&output.stderr).into_owned(),
            exit_code: output.status.code(),
        })
    }

    fn resolve_path(&mut self, path: String) -> Result<String, String> {
        let p = PathBuf::from(&path);

        let parent = p.parent().unwrap_or(Path::new("."));
        let base = p.file_name();

        let parent_real =
            canonicalize(parent).map_err(|e| format!("failed to resolve path '{path}': {e}"))?;

        let abs = match base {
            Some(name) => parent_real.join(name),
            None => parent_real,
        };

        abs.to_str()
            .map(|s| s.to_string())
            .ok_or_else(|| format!("path '{path}' contains non-UTF8 characters"))
    }
    }
}
