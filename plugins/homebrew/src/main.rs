use dotsync_plugin::{OperatingSystems, Plugin};

#[derive(Default)]
struct Homebrew;

impl Plugin for Homebrew {
    const ID: &'static str = "brew";

    fn description() -> String {
        "Homebrew plugin".to_string()
    }

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::new().macos().linux_all()
    }
}
