use dotsync_plugin::{OperatingSystems, Plugin, config, register, run_command};

#[config]
struct HomebrewConfig {
    taps: Vec<String>,
    formulas: Vec<String>,
    casks: Vec<String>,
}

#[derive(Default)]
struct Homebrew;

impl Homebrew {
    fn get_list(&self, command: &str) -> Result<Vec<String>, String> {
        let output = run_command(command, &[])?;

        if !output.success() {
            return Err(format!(
                "command `{}` failed with exit code {:?}\nstderr: {}",
                command, output.exit_code, output.stderr
            ));
        }

        Ok(output
            .stdout
            .lines()
            .map(|s| s.to_string())
            .filter(|s| !s.is_empty())
            .collect())
    }

    fn install_items(&self, command: &str, items: &[String]) -> Result<(), String> {
        for item in items {
            let cmd = format!("{} {}", command, item);
            let output = run_command(&cmd, &[])?;

            if !output.success() {
                return Err(format!(
                    "command `{}` failed with exit code {:?}\nstderr: {}",
                    cmd, output.exit_code, output.stderr
                ));
            }
        }

        Ok(())
    }
}

impl Plugin for Homebrew {
    const ID: &'static str = "brew";
    const DESCRIPTION: &'static str = "Homebrew plugin";

    type Config = HomebrewConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::new().macos().linux_all()
    }

    fn import(&mut self) -> Result<Self::Config, String> {
        let taps = self.get_list("brew tap")?;
        let formulas = self.get_list("brew list --formula -1")?;
        let casks = self.get_list("brew list --cask -1")?;

        Ok(HomebrewConfig {
            taps,
            formulas,
            casks,
        })
    }

    fn run(&mut self, config: Self::Config) -> Result<(), String> {
        self.install_items("brew tap", &config.taps)?;
        self.install_items("brew install", &config.formulas)?;
        self.install_items("brew install --cask", &config.casks)?;
        Ok(())
    }
}

register!(Homebrew);
