use dotsync_plugin::{start, OperatingSystems, Plugin};

#[derive(Default)]
struct VSCode;

impl Plugin for VSCode {
    const NAME: &'static str = "VSCode";

    fn description() -> String {
        "VSCode plugin".to_string()
    }

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }
}

fn main() {
    start::<VSCode>(5051)
}
