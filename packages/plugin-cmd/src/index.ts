import * as async from 'async';
import * as utils from '@dotsync/utils';

export default class Cmd extends utils.Plugin {
  constructor(opts: utils.PluginOptions) {
    super('cmd', 'Execute commands', opts);
  }

  restore(answers: utils.PluginPromptAnswers, cb: utils.Callback) {
    async.eachSeries(this.data.commands, (cmd: any, callback: utils.Callback) => {
      this.runner.run(cmd.command, callback);
    }, cb);
  }
};
