use dotsync_plugin::{start, OperatingSystems, Plugin};

#[derive(Default)]
struct Homebrew;

impl Plugin for Homebrew {
    const NAME: &'static str = "Homebrew";

    fn description() -> String {
        "Homebrew plugin".to_string()
    }

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::new().macos().linux_all()
    }
}

fn main() {
    start::<Homebrew>(5051)
}
