use dotsync_plugin::{OperatingSystems, Plugin};

#[derive(Default)]
struct Homebrew;

impl Plugin for Homebrew {
    const ID: &'static str = "brew";
    const DESCRIPTION: &'static str = "Homebrew plugin";

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::new().macos().linux_all()
    }
}

dotsync_plugin::export_plugin!(Homebrew);
