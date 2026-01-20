use proc_macro::TokenStream;
use quote::{format_ident, quote};
use syn::{Data, DeriveInput, Fields, parse_macro_input};

#[proc_macro_derive(Config)]
pub fn derive_config(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    let inner_name = format_ident!("__DotsyncInner{}", name);

    let fields = match &input.data {
        Data::Struct(data) => &data.fields,
        _ => panic!("Config can only be derived for structs"),
    };

    let field_names: Vec<_> = match fields {
        Fields::Named(f) => f.named.iter().map(|f| &f.ident).collect(),
        Fields::Unnamed(_) => panic!("Config does not support tuple structs"),
        Fields::Unit => vec![],
    };

    let field_types: Vec<_> = match fields {
        Fields::Named(f) => f.named.iter().map(|f| &f.ty).collect(),
        Fields::Unnamed(_) => panic!("Config does not support tuple structs"),
        Fields::Unit => vec![],
    };

    let from_inner = if field_names.is_empty() {
        quote! { #name {} }
    } else {
        quote! { #name { #( #field_names: inner.#field_names ),* } }
    };

    let expanded = quote! {
        impl<'de> ::dotsync_plugin::serde::Deserialize<'de> for #name {
            fn deserialize<D>(deserializer: D) -> ::core::result::Result<Self, D::Error>
            where
                D: ::dotsync_plugin::serde::Deserializer<'de>,
            {
                #[derive(::dotsync_plugin::serde::Deserialize)]
                #[serde(crate = "::dotsync_plugin::serde")]
                struct #inner_name {
                    #( #field_names: #field_types ),*
                }

                let inner = <#inner_name as ::dotsync_plugin::serde::Deserialize>::deserialize(deserializer)?;
                Ok(#from_inner)
            }
        }

        impl ::dotsync_plugin::schemars::JsonSchema for #name {
            fn schema_name() -> ::std::string::String {
                ::std::string::String::from(stringify!(#name))
            }

            fn json_schema(
                generator: &mut ::dotsync_plugin::schemars::r#gen::SchemaGenerator,
            ) -> ::dotsync_plugin::schemars::schema::Schema {
                #[derive(::dotsync_plugin::schemars::JsonSchema)]
                #[schemars(crate = "::dotsync_plugin::schemars")]
                struct #inner_name {
                    #( #field_names: #field_types ),*
                }

                <#inner_name as ::dotsync_plugin::schemars::JsonSchema>::json_schema(generator)
            }
        }
    };

    TokenStream::from(expanded)
}
