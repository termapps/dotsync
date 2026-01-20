use dotsync_plugin::{Config, OperatingSystems, Plugin};

#[derive(Default, Config)]
struct HomebrewConfig {}

#[derive(Default)]
struct Homebrew;

impl Plugin for Homebrew {
    const ID: &'static str = "brew";
    const DESCRIPTION: &'static str = "Homebrew plugin";

    type Config = HomebrewConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::new().macos().linux_all()
    }

    fn run(&mut self, _config: Self::Config) -> Result<(), String> {
        Ok(())
    }
}

dotsync_plugin::export_plugin!(Homebrew);
