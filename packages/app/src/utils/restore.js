import fs from 'fs';
import path from 'path';
import async from 'async';
import loadPlugins from './loadPlugins';

export default (configdir, datadir, cb) => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));
  } catch (error) {
    cb(error);
  }

  const needed = config.presets.default.plugins;

  loadPlugins(configdir, needed, (err, plugins) => {
    if (err) {
      return cb(err);
    }

    async.eachSeries(needed, (item, callback) => {
      const plugin = new (plugins[item.name])(datadir);
      plugin.restore(item.data, callback);
    }, cb);
  });
};
