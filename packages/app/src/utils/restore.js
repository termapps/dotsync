import async from 'async';
import loadPlugins from './loadPlugins';
import loadConfig from './loadConfig';
import Runner from './runner';

export default (configdir, datadir, log, prompt, cb) => {
  loadConfig(datadir, (e, config) => {
    if (e) {
      return cb(e);
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

        const questions = ((plugins[item.name].prompts || {}).restore || []);

        prompt(item.name, questions, (error, answers) => {
          if (error) {
            return callback(error);
          }

          plugin.restore({ ...item.data, _p: answers }, callback);
        });
      }, cb);
    });
  });
};
