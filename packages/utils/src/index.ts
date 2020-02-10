import Module from './module';
import {
  Storage, StorageSettings, StorageOptions, StoragePromptAnswers,
} from './storage';
import {
  Plugin, PluginOptions, PluginPrompts, PluginPromptInput, PluginPromptAnswers,
} from './plugin';
import { ConfigPlugin, ConfigPluginData } from './config';
import { Callback } from './error';

export const lineSplit = <T>(fn: (line: string) => T): ((out: string) => T[]) => {
  return (out: string) => out.split('\n').filter(x => x).map(fn);
};

export {
  Callback,
  Module,
  Storage,
  StorageSettings,
  StorageOptions,
  StoragePromptAnswers,
  Plugin,
  PluginOptions,
  PluginPrompts,
  PluginPromptInput,
  PluginPromptAnswers,
  ConfigPlugin,
  ConfigPluginData,
};
