use schemars::JsonSchema;
use serde::{Serialize, de::DeserializeOwned};

use crate::OperatingSystems;

pub trait Plugin: Default + Send + Sync + 'static {
    const ID: &'static str;
    const DESCRIPTION: &'static str;

    const DEPENDENCIES: &'static [&'static str] = &[];

    type Config: DeserializeOwned + Serialize + JsonSchema + Default;

    fn get_supported_operating_systems() -> OperatingSystems;

    fn run(&mut self, config: Self::Config) -> Result<(), String>;

    fn import(&mut self) -> Result<Self::Config, String> {
        Ok(Self::Config::default())
    }

    fn config_schema() -> String {
        let schema = schemars::schema_for!(Self::Config);
        serde_json::to_string(&schema).expect("schema serialization must succeed")
    }
}
