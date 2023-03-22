#[path = "tech.dotsync.rs"]
mod service;

mod operating_systems;

pub use operating_systems::OperatingSystems;
pub use service::LinuxDistribution;

pub trait Plugin {
    const NAME: &'static str;

    fn description() -> String;

    fn get_supported_operating_systems() -> OperatingSystems;
}
