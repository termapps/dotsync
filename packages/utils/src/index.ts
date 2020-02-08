import * as async from 'async';
import Module from './module';
import {
  Plugin, PluginOptions, PluginPrompts, PluginPromptInput, PluginPromptAnswers,
} from './plugin';
import { ConfigPlugin, ConfigPluginData } from './config';

export const lineSplit = <T>(fn: (line: string) => T): ((out: string) => T[]) => {
  return (out: string) => out.split('\n').filter(x => x).map(fn);
};

export type Callback = async.ErrorCallback<Error>;

export {
  Module,
  Plugin,
  PluginOptions,
  PluginPrompts,
  PluginPromptInput,
  PluginPromptAnswers,
  ConfigPlugin,
  ConfigPluginData,
};
