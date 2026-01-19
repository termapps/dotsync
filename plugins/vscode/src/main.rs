use dotsync_plugin::{OperatingSystems, Plugin};

#[derive(Default)]
struct VSCode;

impl Plugin for VSCode {
    const ID: &'static str = "vscode";
    const DESCRIPTION: &'static str = "VSCode plugin";

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }
}

dotsync_plugin::export_plugin!(VSCode);
