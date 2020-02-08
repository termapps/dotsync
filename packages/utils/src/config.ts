export interface ConfigPluginData {
  _modules?: {
    _uninstall?: {
      [key: string]: boolean
    }
    [key: string]: any
  }
  binary?: string
  [key: string]: any
}

export interface ConfigPlugin {
  name: string
  version?: string
  data: ConfigPluginData
}
