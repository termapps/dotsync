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
        #[prost(string, tag = "2")]
        pub name: ::prost::alloc::string::String,
        #[prost(string, tag = "3")]
        pub version: ::prost::alloc::string::String,
        #[prost(enumeration = "super::OperatingSystem", repeated, tag = "4")]
        pub supported: ::prost::alloc::vec::Vec<i32>,
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum OperatingSystem {
    Unspecified = 0,
    Macos = 1,
    Windows = 2,
    ArchLinux = 3,
    Ubuntu = 4,
    Debian = 5,
    Fedora = 6,
}
impl OperatingSystem {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            OperatingSystem::Unspecified => "UNSPECIFIED",
            OperatingSystem::Macos => "MACOS",
            OperatingSystem::Windows => "WINDOWS",
            OperatingSystem::ArchLinux => "ARCH_LINUX",
            OperatingSystem::Ubuntu => "UBUNTU",
            OperatingSystem::Debian => "DEBIAN",
            OperatingSystem::Fedora => "FEDORA",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "UNSPECIFIED" => Some(Self::Unspecified),
            "MACOS" => Some(Self::Macos),
            "WINDOWS" => Some(Self::Windows),
            "ARCH_LINUX" => Some(Self::ArchLinux),
            "UBUNTU" => Some(Self::Ubuntu),
            "DEBIAN" => Some(Self::Debian),
            "FEDORA" => Some(Self::Fedora),
            _ => None,
        }
    }
}
/// Generated server implementations.
pub mod plugin_service_server {
    #![allow(unused_variables, dead_code, missing_docs, clippy::let_unit_value)]
    use tonic::codegen::*;
    /// Generated trait containing gRPC methods that should be implemented for use with PluginServiceServer.
    #[async_trait]
    pub trait PluginService: Send + Sync + 'static {
        async fn get_plugin_schema(
            &self,
            request: tonic::Request<super::get_plugin_schema::Request>,
        ) -> Result<tonic::Response<super::get_plugin_schema::Response>, tonic::Status>;
    }
    #[derive(Debug)]
    pub struct PluginServiceServer<T: PluginService> {
        inner: _Inner<T>,
        accept_compression_encodings: EnabledCompressionEncodings,
        send_compression_encodings: EnabledCompressionEncodings,
    }
    struct _Inner<T>(Arc<T>);
    impl<T: PluginService> PluginServiceServer<T> {
        pub fn new(inner: T) -> Self {
            Self::from_arc(Arc::new(inner))
        }
        pub fn from_arc(inner: Arc<T>) -> Self {
            let inner = _Inner(inner);
            Self {
                inner,
                accept_compression_encodings: Default::default(),
                send_compression_encodings: Default::default(),
            }
        }
        pub fn with_interceptor<F>(
            inner: T,
            interceptor: F,
        ) -> InterceptedService<Self, F>
        where
            F: tonic::service::Interceptor,
        {
            InterceptedService::new(Self::new(inner), interceptor)
        }
        /// Enable decompressing requests with the given encoding.
        #[must_use]
        pub fn accept_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.accept_compression_encodings.enable(encoding);
            self
        }
        /// Compress responses with the given encoding, if the client supports it.
        #[must_use]
        pub fn send_compressed(mut self, encoding: CompressionEncoding) -> Self {
            self.send_compression_encodings.enable(encoding);
            self
        }
    }
    impl<T, B> tonic::codegen::Service<http::Request<B>> for PluginServiceServer<T>
    where
        T: PluginService,
        B: Body + Send + 'static,
        B::Error: Into<StdError> + Send + 'static,
    {
        type Response = http::Response<tonic::body::BoxBody>;
        type Error = std::convert::Infallible;
        type Future = BoxFuture<Self::Response, Self::Error>;
        fn poll_ready(
            &mut self,
            _cx: &mut Context<'_>,
        ) -> Poll<Result<(), Self::Error>> {
            Poll::Ready(Ok(()))
        }
        fn call(&mut self, req: http::Request<B>) -> Self::Future {
            let inner = self.inner.clone();
            match req.uri().path() {
                "/tech.dotsync.PluginService/GetPluginSchema" => {
                    #[allow(non_camel_case_types)]
                    struct GetPluginSchemaSvc<T: PluginService>(pub Arc<T>);
                    impl<
                        T: PluginService,
                    > tonic::server::UnaryService<super::get_plugin_schema::Request>
                    for GetPluginSchemaSvc<T> {
                        type Response = super::get_plugin_schema::Response;
                        type Future = BoxFuture<
                            tonic::Response<Self::Response>,
                            tonic::Status,
                        >;
                        fn call(
                            &mut self,
                            request: tonic::Request<super::get_plugin_schema::Request>,
                        ) -> Self::Future {
                            let inner = self.0.clone();
                            let fut = async move {
                                (*inner).get_plugin_schema(request).await
                            };
                            Box::pin(fut)
                        }
                    }
                    let accept_compression_encodings = self.accept_compression_encodings;
                    let send_compression_encodings = self.send_compression_encodings;
                    let inner = self.inner.clone();
                    let fut = async move {
                        let inner = inner.0;
                        let method = GetPluginSchemaSvc(inner);
                        let codec = tonic::codec::ProstCodec::default();
                        let mut grpc = tonic::server::Grpc::new(codec)
                            .apply_compression_config(
                                accept_compression_encodings,
                                send_compression_encodings,
                            );
                        let res = grpc.unary(method, req).await;
                        Ok(res)
                    };
                    Box::pin(fut)
                }
                _ => {
                    Box::pin(async move {
                        Ok(
                            http::Response::builder()
                                .status(200)
                                .header("grpc-status", "12")
                                .header("content-type", "application/grpc")
                                .body(empty_body())
                                .unwrap(),
                        )
                    })
                }
            }
        }
    }
    impl<T: PluginService> Clone for PluginServiceServer<T> {
        fn clone(&self) -> Self {
            let inner = self.inner.clone();
            Self {
                inner,
                accept_compression_encodings: self.accept_compression_encodings,
                send_compression_encodings: self.send_compression_encodings,
            }
        }
    }
    impl<T: PluginService> Clone for _Inner<T> {
        fn clone(&self) -> Self {
            Self(self.0.clone())
        }
    }
    impl<T: std::fmt::Debug> std::fmt::Debug for _Inner<T> {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}", self.0)
        }
    }
    impl<T: PluginService> tonic::server::NamedService for PluginServiceServer<T> {
        const NAME: &'static str = "tech.dotsync.PluginService";
    }
}
