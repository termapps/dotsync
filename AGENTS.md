# AGENTS.md


`dotsync` is a command-line utility designed to manage dotfiles.

## Core Architecture

- **dotsync (CLI)**: The main crate (`src/`) handles the command-line interface, configuration, and plugin execution environment using `wasmtime`.
- **dotsync-plugin (SDK)**: The `plugin/` crate defines the interface and provides the SDK for building plugins.
- **Plugins**: Individual plugins reside in the `plugins/` directory (e.g., `plugins/homebrew`, `plugins/vscode`).

## Directory Structure

- `src/`: Core CLI source code.
    - `commands/`: Subcommand implementations.
    - `error.rs`: Error handling using `eyre`.
- `plugin/`: Plugin SDK.
    - `wit/`: WASI Interface Type (WIT) definitions (`plugin.wit`).
    - `src/lib.rs`: Exports the `Plugin` trait and `export_plugin!` macro.
- `plugins/`: Directory for Wasm plugins.

## Plugin System

Plugins are built as Wasm modules using the `wasm32-wasip2` target. Every plugin must implement the `Plugin` trait defined in `plugin/src/plugin.rs`

### Exporting a Plugin

Use the `export_plugin!` macro to generate the necessary Wasm bindings:

```rust
use dotsync_plugin::{Plugin, OperatingSystems, export_plugin};

#[derive(Default)]
struct MyPlugin;

impl Plugin for MyPlugin {
    const ID: &'static str = "my-plugin";
    const DESCRIPTION: &'static str = "Manages my tool configuration";

    fn get_supported_operating_systems() -> OperatingSystems {
        OperatingSystems::all()
    }
}

export_plugin!(MyPlugin);
```

## Development Workflow

* Build the CLI: `cargo build`
* Build a plugin: `cargo build -p dotsync-plugin-<name> --target wasm32-wasip2`
* Testing: `cargo test`
