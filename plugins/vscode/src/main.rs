use dotsync_plugin::{OperatingSystems, Plugin};

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
    println!("Hello, world!");
}
