import { ConfigPlugin, ConfigPluginData } from './config';

export interface PluginPromptInput {
  name: string
  label: string
  type: string
  inputType: string
}

export interface PluginPrompts {
  backup: PluginPromptInput[]
  restore: PluginPromptInput[]
}

export interface PluginOptions {
  data: ConfigPluginData
  datadir: string
  runner: any
}

export abstract class Plugin {
  name: string
  description: string
  data: ConfigPluginData
  datadir: string
  runner: any

  constructor(name: string, description: string, opts: PluginOptions) {
    this.name = name;
    this.description = description;

    this.data = opts.data;
    this.datadir = opts.datadir;
    this.runner = opts.runner;
  }

  expand(): ConfigPlugin[] {
    return [];
  }

  prompts() {
    return {
      backup: [],
      restore: [],
    };
  }
}
