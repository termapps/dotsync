use schemars::JsonSchema;
use serde::de::DeserializeOwned;

use crate::OperatingSystems;

pub trait Plugin: Default + Send + Sync + 'static {
    const ID: &'static str;
    const DESCRIPTION: &'static str;

    const DEPENDENCIES: &'static [&'static str] = &[];

    type Config: DeserializeOwned + JsonSchema + Default;

    fn get_supported_operating_systems() -> OperatingSystems;

    fn run(&mut self, config: Self::Config) -> Result<(), String>;

    fn config_schema() -> String {
        let schema = schemars::schema_for!(Self::Config);
        serde_json::to_string(&schema).expect("schema serialization must succeed")
    }
}
