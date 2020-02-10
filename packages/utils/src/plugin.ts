import { ConfigPlugin, ConfigPluginData } from './config';
import { Callback } from './error';

export interface PluginPromptInput {
  name: string
  label: string
  type: string
  inputType: string
}

export interface PluginPromptAnswers {
  [key: string]: string
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

  restore(answers: PluginPromptAnswers, cb: Callback) {
    return cb(null);
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
