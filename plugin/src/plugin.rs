use crate::OperatingSystems;

pub trait Plugin: Default + Send + Sync + 'static {
    const ID: &'static str;
    const DESCRIPTION: &'static str;

    const DEPENDENCIES: &'static [&'static str] = &[];

    fn get_supported_operating_systems() -> OperatingSystems;
}
