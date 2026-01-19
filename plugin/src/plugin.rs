use crate::{
    OperatingSystems,
};

pub trait Plugin: Default + Send + Sync + 'static {
    const ID: &'static str;

    fn description() -> String;

    fn get_supported_operating_systems() -> OperatingSystems;
}
