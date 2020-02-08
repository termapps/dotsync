import * as async from 'async';
import * as utils from '@dotsync/utils';
import link from './link';
import Item from './item';

export default class Link extends utils.Plugin {
  static link = link;

  constructor(opts: utils.PluginOptions) {
    super('link', 'Symlink files to different locations', opts);
  }

  restore(answers: utils.PluginPromptAnswers, cb: utils.Callback) {
    async.eachSeries(this.data.paths, (item: Item, callback: async.ErrorCallback<Error>) => {
      link(item, this.datadir, this.runner, callback);
    }, cb);
  }
};
