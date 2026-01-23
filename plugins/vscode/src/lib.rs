use std::collections::HashMap;

use dotsync_plugin::prelude::*;
use serde::Serialize;

#[config]
struct VSCodeConfig {
    settings: Option<String>,
    keybindings: Option<String>,
    snippets: Option<String>,
    extensions: Option<Vec<String>>,
}

// TODO: Import from link plugin?
#[derive(Serialize)]
struct LinkConfig {
    links: HashMap<String, String>,
}

#[derive(Default)]
struct VSCode;

impl VSCode {
    fn get_extensions(&self) -> Result<Vec<String>, String> {
        let output = self.run_command("code --list-extensions --show-versions", &[])?;

        if !output.success() {
            return Err(format!("failed to list extensions: {}", output.stderr));
        }

        Ok(output
            .stdout
            .lines()
            .map(|s| s.to_string())
            .filter(|s| !s.is_empty())
            .collect())
    }

    fn install_extensions(&self, extensions: &[String]) -> Result<(), String> {
        for ext in extensions {
            let cmd = format!("code --install-extension {ext}");
            let output = self.run_command(&cmd, &[])?;

            if !output.success() {
                return Err(format!(
                    "failed to install extension {ext}: {}",
                    output.stderr
                ));
            }
        }

        Ok(())
    }
}

impl Plugin for VSCode {
    const ID: &'static str = "vscode";
    const DESCRIPTION: &'static str = "VSCode plugin";
    const DEPENDENCIES: &'static [&'static str] = &["link"];

    type Config = VSCodeConfig;

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }

    fn import(&mut self) -> Result<Self::Config, String> {
        // TODO: How to import symlink?
        let settings = if self.confirm("Import settings?", false)? {
            Some(String::new())
        } else {
            None
        };

        let keybindings = if self.confirm("Import keybindings?", false)? {
            Some(String::new())
        } else {
            None
        };

        let snippets = if self.confirm("Import snippets?", false)? {
            Some(String::new())
        } else {
            None
        };

        let extensions = if self.confirm("Import extensions?", true)? {
            let exts = self.get_extensions()?;
            if exts.is_empty() { None } else { Some(exts) }
        } else {
            None
        };

        Ok(VSCodeConfig {
            settings,
            keybindings,
            snippets,
            extensions,
        })
    }

    fn run(&mut self, config: Self::Config) -> Result<(), String> {
        // TODO: How to resolve $XDG_CONFIG_HOME?
        let base = "$XDG_CONFIG_HOME/Code/User";
        let mut links = HashMap::new();

        if let Some(settings) = config.settings {
            links.insert(settings.clone(), format!("{base}/settings.json"));
        }

        if let Some(keybindings) = config.keybindings {
            links.insert(keybindings.clone(), format!("{base}/keybindings.json"));
        }

        if let Some(snippets) = config.snippets {
            links.insert(snippets.clone(), format!("{base}/snippets"));
        }

        if !links.is_empty() {
            self.subrun("link", &LinkConfig { links })?;
        }

        if let Some(extensions) = &config.extensions {
            self.install_extensions(extensions)?;
        }

        Ok(())
    }
}

register!(VSCode);
