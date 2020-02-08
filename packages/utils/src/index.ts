import Module from './module';
import { Plugin, PluginOptions, PluginPrompts, PluginPromptInput } from './plugin';
import { ConfigPlugin, ConfigPluginData } from './config';

const lineSplit = <T>(fn: (line: string) => T): ((out: string) => T[]) => {
  return (out: string) => out.split('\n').filter(x => x).map(fn);
};

export {
  Module,
  Plugin,
  PluginOptions,
  PluginPrompts,
  PluginPromptInput,
  ConfigPlugin,
  ConfigPluginData,
  lineSplit,
};
