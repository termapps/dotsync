use dotsync_plugin::{Config, OperatingSystems, Plugin};

#[derive(Default, Config)]
struct VSCodeConfig {}

#[derive(Default)]
struct VSCode;

impl Plugin for VSCode {
    const ID: &'static str = "vscode";
    const DESCRIPTION: &'static str = "VSCode plugin";

    type Config = VSCodeConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }

    fn run(&mut self, _config: Self::Config) -> Result<(), String> {
        Ok(())
    }
}

dotsync_plugin::export_plugin!(VSCode);
