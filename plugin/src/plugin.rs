use tonic::{async_trait, Request, Response, Status};

use crate::{
    service::{get_plugin_schema, plugin_service_server::PluginService},
    OperatingSystems,
};

pub trait Plugin: Default + Send + Sync + 'static {
    const NAME: &'static str;

    fn description() -> String;

    fn get_supported_operating_systems() -> OperatingSystems;
}

#[async_trait]
impl<P> PluginService for P
where
    P: Plugin,
{
    async fn get_plugin_schema(
        &self,
        _request: Request<get_plugin_schema::Request>,
    ) -> Result<Response<get_plugin_schema::Response>, Status> {
        let os = P::get_supported_operating_systems();

        let response = get_plugin_schema::Response {
            // TODO: Fix the name to id
            id: P::NAME.to_string(),
            name: P::NAME.to_string(),
            version: env!("CARGO_PKG_VERSION").to_string(),
            description: P::description(),
            supported_os: os.supported_os(),
            supported_linux_distro: os.supported_linux_distro(),
        };

        Ok(Response::new(response))
    }
}
