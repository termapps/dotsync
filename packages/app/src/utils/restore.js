import fs from 'fs';
import path from 'path';
import async from 'async';
import loadPlugins from './loadPlugins';
import Runner from './runner';

export default (configdir, datadir, log, cb) => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));
  } catch (error) {
    return cb(error);
  }

  const needed = config.presets.default.plugins;

  loadPlugins(configdir, needed, log, (err, plugins) => {
    if (err) {
      return cb(err);
    }

    async.eachSeries(needed, (item, callback) => {
      const plugin = new (plugins[item.name])({
        datadir,
        runner: new Runner(datadir, log),
      });

      plugin.restore(item.data, callback);
    }, cb);
  });
};
