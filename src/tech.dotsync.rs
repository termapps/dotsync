#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetPluginSchema {}
/// Nested message and enum types in `GetPluginSchema`.
pub mod get_plugin_schema {
    #[allow(clippy::derive_partial_eq_without_eq)]
    #[derive(Clone, PartialEq, ::prost::Message)]
    pub struct Request {}
    #[allow(clippy::derive_partial_eq_without_eq)]
    #[derive(Clone, PartialEq, ::prost::Message)]
    pub struct Response {
        #[prost(string, tag = "1")]
        pub id: ::prost::alloc::string::String,
        #[prost(string, tag = "3")]
        pub version: ::prost::alloc::string::String,
        #[prost(string, tag = "4")]
        pub description: ::prost::alloc::string::String,
        #[prost(enumeration = "super::OperatingSystem", repeated, tag = "5")]
        pub supported_os: ::prost::alloc::vec::Vec<i32>,
        #[prost(enumeration = "super::LinuxDistribution", repeated, tag = "6")]
        pub supported_linux_distro: ::prost::alloc::vec::Vec<i32>,
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum OperatingSystem {
    UnspecifiedOS = 0,
    MacOS = 1,
    Windows = 2,
}
impl OperatingSystem {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            OperatingSystem::UnspecifiedOS => "UNSPECIFIED_O_S",
            OperatingSystem::MacOS => "MAC_O_S",
            OperatingSystem::Windows => "WINDOWS",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNSPECIFIED_O_S" => Some(Self::UnspecifiedOS),
            "MAC_O_S" => Some(Self::MacOS),
            "WINDOWS" => Some(Self::Windows),
            _ => None,
        }
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum LinuxDistribution {
    UnspecifiedDistro = 0,
    Debian = 1,
    Ubuntu = 2,
    Fedora = 3,
    CentOS = 4,
    RHEL = 5,
    Arch = 6,
    Manjaro = 7,
    OpenSUSE = 8,
    Gentoo = 9,
    Alpine = 10,
    Solus = 11,
    Mint = 12,
    PopOS = 13,
    NixOS = 14,
    Void = 15,
    Kali = 16,
}
impl LinuxDistribution {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            LinuxDistribution::UnspecifiedDistro => "UNSPECIFIED_DISTRO",
            LinuxDistribution::Debian => "DEBIAN",
            LinuxDistribution::Ubuntu => "UBUNTU",
            LinuxDistribution::Fedora => "FEDORA",
            LinuxDistribution::CentOS => "CENT_O_S",
            LinuxDistribution::RHEL => "R_H_E_L",
            LinuxDistribution::Arch => "ARCH",
            LinuxDistribution::Manjaro => "MANJARO",
            LinuxDistribution::OpenSUSE => "OPEN_S_U_S_E",
            LinuxDistribution::Gentoo => "GENTOO",
            LinuxDistribution::Alpine => "ALPINE",
            LinuxDistribution::Solus => "SOLUS",
            LinuxDistribution::Mint => "MINT",
            LinuxDistribution::PopOS => "POP_O_S",
            LinuxDistribution::NixOS => "NIX_O_S",
            LinuxDistribution::Void => "VOID",
            LinuxDistribution::Kali => "Kali",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNSPECIFIED_DISTRO" => Some(Self::UnspecifiedDistro),
            "DEBIAN" => Some(Self::Debian),
            "UBUNTU" => Some(Self::Ubuntu),
            "FEDORA" => Some(Self::Fedora),
            "CENT_O_S" => Some(Self::CentOS),
            "R_H_E_L" => Some(Self::RHEL),
            "ARCH" => Some(Self::Arch),
            "MANJARO" => Some(Self::Manjaro),
            "OPEN_S_U_S_E" => Some(Self::OpenSUSE),
            "GENTOO" => Some(Self::Gentoo),
            "ALPINE" => Some(Self::Alpine),
            "SOLUS" => Some(Self::Solus),
            "MINT" => Some(Self::Mint),
            "POP_O_S" => Some(Self::PopOS),
            "NIX_O_S" => Some(Self::NixOS),
            "VOID" => Some(Self::Void),
            "Kali" => Some(Self::Kali),
            _ => None,
        }
    }
}
/// Generated client implementations.
pub mod plugin_service_client {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    use tonic::codegen::http::Uri;
    #[derive(Debug, Clone)]
    pub struct PluginServiceClient<T> {
        inner: tonic::client::Grpc<T>,
    }
    impl PluginServiceClient<tonic::transport::Channel> {
        /// Attempt to create a new client by connecting to a given endpoint.
        pub async fn connect<D>(dst: D) -> Result<Self, tonic::transport::Error>
        where
            D: std::convert::TryInto<tonic::transport::Endpoint>,
            D::Error: Into<StdError>,
        {
            let conn = tonic::transport::Endpoint::new(dst)?.connect().await?;
            Ok(Self::new(conn))
        }
    }
    impl<T> PluginServiceClient<T>
    where
        T: tonic::client::GrpcService<tonic::body::BoxBody>,
        T::Error: Into<StdError>,
        T::ResponseBody: Body<Data = Bytes> + Send + 'static,
        <T::ResponseBody as Body>::Error: Into<StdError> + Send,
    {
        pub fn new(inner: T) -> Self {
            let inner = tonic::client::Grpc::new(inner);
            Self { inner }
        }
        pub fn with_origin(inner: T, origin: Uri) -> Self {
            let inner = tonic::client::Grpc::with_origin(inner, origin);
            Self { inner }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> PluginServiceClient<InterceptedService<T, F>>
        where
            F: tonic::service::Interceptor,
            T::ResponseBody: Default,
            T: tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
                Response = http::Response<
                    <T as tonic::client::GrpcService<tonic::body::BoxBody>>::ResponseBody,
                >,
            >,
            <T as tonic::codegen::Service<
                http::Request<tonic::body::BoxBody>,
            >>::Error: Into<StdError> + Send + Sync,
        {
            PluginServiceClient::new(InterceptedService::new(inner, interceptor))
        }
        /// Compress requests with the given encoding.
        ///
        /// This requires the server to support it otherwise it might respond with an
        /// error.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.send_compressed(encoding);
            self
        }
        /// Enable decompressing responses.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.inner = self.inner.accept_compressed(encoding);
            self
        }
        pub async fn get_plugin_schema(
            &mut self,
            request: impl tonic::IntoRequest<super::get_plugin_schema::Request>,
        ) -> Result<tonic::Response<super::get_plugin_schema::Response>, tonic::Status> {
            self.inner
                .ready()
                .await
                .map_err(|e| {
                    tonic::Status::new(
                        tonic::Code::Unknown,
                        format!("Service was not ready: {}", e.into()),
                    )
                })?;
            let codec = tonic::codec::ProstCodec::default();
            let path = http::uri::PathAndQuery::from_static(
                "/tech.dotsync.PluginService/GetPluginSchema",
            );
            self.inner.unary(request.into_request(), path, codec).await
        }
    }
}
