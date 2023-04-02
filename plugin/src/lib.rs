use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use tonic::transport::Server;

#[path = "tech.dotsync.rs"]
mod service;

mod operating_systems;
mod plugin;

pub use operating_systems::OperatingSystems;
pub use plugin::Plugin;
use service::plugin_service_server::PluginServiceServer;
pub use service::LinuxDistribution;

#[tokio::main]
pub async fn start<P>(port: u16)
where
    P: Plugin,
{
    let socket = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), port);

    let plugin = P::default();

    Server::builder()
        .add_service(PluginServiceServer::new(plugin))
        .serve(socket)
        .await
        .unwrap();
}
