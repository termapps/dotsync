mod operating_systems;
mod plugin;

pub use operating_systems::{LinuxDistribution, OperatingSystem, OperatingSystems};
pub use plugin::Plugin;

pub use dotsync_macros::Config;
pub use schemars;
pub use serde;

#[cfg(target_arch = "wasm32")]
pub mod bindings {
    wit_bindgen::generate!({
        world: "plugin",
        path: "wit",
    });
}

#[cfg(target_arch = "wasm32")]
#[doc(hidden)]
pub use bindings as __internal_bindings;

#[cfg(target_arch = "wasm32")]
#[doc(hidden)]
pub use serde_json as __internal_serde_json;

#[cfg(target_arch = "wasm32")]
pub fn subrun<C: serde::Serialize>(plugin_id: &str, config: &C) -> Result<(), String> {
    let config_json = serde_json::to_string(config).map_err(|e| e.to_string())?;
    bindings::dotsync::plugin::host::subrun(plugin_id, &config_json)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn subrun<C: serde::Serialize>(_plugin_id: &str, _config: &C) -> Result<(), String> {
    Err("subrun is only available in wasm plugins".to_string())
}

#[cfg(target_arch = "wasm32")]
#[doc(hidden)]
pub fn map_operating_system(
    i: i32,
) -> __internal_bindings::dotsync::plugin::operating_systems::OperatingSystem {
    use __internal_bindings::dotsync::plugin::operating_systems::OperatingSystem as WOS;
    match i {
        1 => WOS::MacOS,
        2 => WOS::Windows,
        _ => WOS::UnspecifiedOS,
    }
}

#[cfg(target_arch = "wasm32")]
#[doc(hidden)]
pub fn map_linux_distro(
    i: i32,
) -> __internal_bindings::dotsync::plugin::operating_systems::LinuxDistribution {
    use __internal_bindings::dotsync::plugin::operating_systems::LinuxDistribution as WLD;
    match i {
        1 => WLD::Debian,
        2 => WLD::Ubuntu,
        3 => WLD::Fedora,
        4 => WLD::CentOS,
        5 => WLD::RHEL,
        6 => WLD::Arch,
        7 => WLD::Manjaro,
        8 => WLD::OpenSUSE,
        9 => WLD::Gentoo,
        10 => WLD::Alpine,
        11 => WLD::Solus,
        12 => WLD::Mint,
        13 => WLD::PopOS,
        14 => WLD::NixOS,
        15 => WLD::Void,
        16 => WLD::Kali,
        _ => WLD::UnspecifiedDistro,
    }
}

#[macro_export]
#[cfg(target_arch = "wasm32")]
macro_rules! export_plugin {
    ($plugin_type:ty) => {
        fn main() {}

        struct WasmPlugin;

        use $crate::__internal_bindings::dotsync::plugin::operating_systems::{
            LinuxDistribution as WasmLinuxDistribution, OperatingSystem as WasmOperatingSystem,
        };

        impl $crate::__internal_bindings::Guest for WasmPlugin {
            fn id() -> String {
                <$plugin_type as $crate::Plugin>::ID.to_string()
            }

            fn description() -> String {
                <$plugin_type as $crate::Plugin>::DESCRIPTION.to_string()
            }

            fn dependencies() -> Vec<String> {
                <$plugin_type as $crate::Plugin>::DEPENDENCIES
                    .iter()
                    .map(|s| (*s).to_string())
                    .collect()
            }

            fn supported_operating_systems() -> Vec<WasmOperatingSystem> {
                let os = <$plugin_type as $crate::Plugin>::get_supported_operating_systems();
                let supported = os.supported_os();

                supported
                    .into_iter()
                    .map(|s| $crate::map_operating_system(s))
                    .collect()
            }

            fn supported_linux_distributions() -> Vec<WasmLinuxDistribution> {
                let os = <$plugin_type as $crate::Plugin>::get_supported_operating_systems();
                let supported = os.supported_linux_distro();

                supported
                    .into_iter()
                    .map(|s| $crate::map_linux_distro(s))
                    .collect()
            }

            fn config_schema() -> String {
                <$plugin_type as $crate::Plugin>::config_schema()
            }

            fn run(config_json: String) -> Result<(), String> {
                let cfg = $crate::__internal_serde_json::from_str::<
                    <$plugin_type as $crate::Plugin>::Config,
                >(&config_json)
                .map_err(|e| format!("invalid config JSON: {e}"))?;

                let mut plugin = <$plugin_type as Default>::default();
                plugin.run(cfg)
            }
        }
    };
}

#[macro_export]
#[cfg(not(target_arch = "wasm32"))]
macro_rules! export_plugin {
    ($plugin_type:ty) => {
        fn main() {}
    };
}
