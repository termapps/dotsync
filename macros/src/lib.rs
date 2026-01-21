use proc_macro::TokenStream;
use quote::quote;
use syn::{DeriveInput, parse_macro_input};

#[proc_macro_attribute]
pub fn config(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as DeriveInput);
    let vis = &input.vis;
    let name = &input.ident;
    let attrs = &input.attrs;
    let fields = match &input.data {
        syn::Data::Struct(data) => &data.fields,
        _ => panic!("config can only be applied to structs"),
    };

    let expanded = quote! {
        #(#attrs)*
        #[derive(
            ::core::default::Default,
            ::dotsync_plugin::serde::Serialize,
            ::dotsync_plugin::serde::Deserialize,
            ::dotsync_plugin::schemars::JsonSchema,
        )]
        #[serde(crate = "::dotsync_plugin::serde")]
        #[schemars(crate = "::dotsync_plugin::schemars")]
        #vis struct #name #fields
    };

    TokenStream::from(expanded)
}
