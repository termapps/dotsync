use dotsync_plugin::{Plugin, config, register, types::OperatingSystems};

#[config]
struct VSCodeConfig {}

#[derive(Default)]
struct VSCode;

impl Plugin for VSCode {
    const ID: &'static str = "vscode";
    const DESCRIPTION: &'static str = "VSCode plugin";
    const DEPENDENCIES: &'static [&'static str] = &["link"];

    type Config = VSCodeConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }

    fn run(&mut self, _config: Self::Config) -> Result<(), String> {
        Ok(())
    }
}

register!(VSCode);
