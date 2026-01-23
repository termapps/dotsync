use std::marker::PhantomData;

use serde_json::{from_str, to_string};

use crate::{
    wasm::{map_linux_distro, map_operating_system},
    wit::{
        Guest,
        dotsync::plugin::operating_systems::{
            LinuxDistribution as WasmLinuxDistribution, OperatingSystem as WasmOperatingSystem,
        },
    },
};

pub use dotsync_macros::config;
pub use serde;

pub mod host;
mod plugin;
pub mod prelude;
pub mod types;
mod wasm;
#[doc(hidden)]
pub mod wit;

pub use host::PluginHost;
pub use plugin::Plugin;

#[doc(hidden)]
pub struct Component<T>(PhantomData<T>);

impl<T> Guest for Component<T>
where
    T: Plugin,
{
    fn id() -> String {
        T::ID.to_string()
    }

    fn description() -> String {
        T::DESCRIPTION.to_string()
    }

    fn dependencies() -> Vec<String> {
        T::DEPENDENCIES.iter().map(|s| s.to_string()).collect()
    }

    fn supported_operating_systems() -> Vec<WasmOperatingSystem> {
        T::get_supported_operating_systems()
            .supported_os()
            .into_iter()
            .map(map_operating_system)
            .collect()
    }

    fn supported_linux_distributions() -> Vec<WasmLinuxDistribution> {
        T::get_supported_operating_systems()
            .supported_linux_distro()
            .into_iter()
            .map(map_linux_distro)
            .collect()
    }

    fn import_config() -> Result<String, String> {
        let mut plugin = T::default();

        let config = plugin.import()?;

        to_string(&config).map_err(|e| format!("failed to serialize config: {e}"))
    }

    fn run(config_json: String) -> Result<(), String> {
        let cfg = from_str::<T::Config>(&config_json)
            .map_err(|e| format!("failed to deserialize config: {e}"))?;

        let mut plugin = T::default();

        plugin.run(cfg)
    }
}

#[macro_export]
macro_rules! register {
    ($plugin_type:ty) => {
        type __DotsyncPluginExport = $crate::Component<$plugin_type>;
        $crate::wit::export!(__DotsyncPluginExport with_types_in $crate::wit);
    };
}
