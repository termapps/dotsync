// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import { list, load } from 'electron-plugin-manager';
import async from 'async';
import deepmerge from 'deepmerge';
import isInstalled from './isInstalled';
import isPlugin from './isPlugin';
import { loadConfig } from './config';
import Runner from './runner';

const installPkgs = (configdir, datadir, config, expand, log, cb) => {
  const installed = list(configdir, { version: true }).filter(isPlugin);
  const toInstall = config.filter(need => !installed.some(isInstalled(need)));

  async.eachSeries(toInstall, (item, callback) => {
    ipcRenderer.on(`epm-installed-${item.name}`, (event, error, pluginPath) => {
      if (error) {
        return callback(error);
      }

      log(`Installed ${item.name} at ${pluginPath}\n`);
      callback(null, pluginPath);
    });

    ipcRenderer.send('epm-install', configdir, item.name, item.version);
  }, (err) => {
    if (err) {
      return cb(err);
    }

    const loaders = config.reduce((acc, item) => {
      acc[item.name] = load(configdir, item.name, remote.require).default;
      return acc;
    }, {});

    const result = config.reduce((acc, item) => {
      acc[item.name] = new (loaders[item.name])({
        data: item.data,
        datadir,
        runner: new Runner(datadir, log),
      });

      return acc;
    }, {});

    if (!expand) {
      return cb(null, result);
    }

    const configString = JSON.stringify(config);

    Object.keys(result).forEach((key) => {
      if (!result[key].expand) {
        return;
      }

      const pluginOptions = config.find(i => i.name === key);

      if (pluginOptions.expanded) {
        return;
      }

      const expanded = result[key].expand(pluginOptions) || [];
      pluginOptions.expanded = true;

      // TODO: Expand to just before the current plugin
      expanded.forEach((item) => {
        const ifExistsIndex = config.findIndex(i => i.name === item.name);

        if (ifExistsIndex !== -1) {
          // eslint-disable-next-line no-param-reassign
          config[ifExistsIndex] = deepmerge(config[ifExistsIndex], item);
          result[key].data = config[ifExistsIndex];
        } else {
          if (!item.version) {
            // eslint-disable-next-line no-param-reassign
            item.version = '*';
          }

          config.push(item);
        }
      });
    });

    if (JSON.stringify(config) === configString) {
      return cb(null, result);
    }

    installPkgs(configdir, datadir, config, expand, log, cb);
  });
};

// Install missing plugins and load all plugins
export default (configdir, datadir, expand, log, cb) => {
  loadConfig(datadir, (error, config) => {
    if (error) {
      return cb(error);
    }

    const needed = config.presets.default.plugins;

    installPkgs(configdir, datadir, needed, expand, log, (err, plugins) => {
      if (err) {
        return cb(err);
      }

      return cb(null, plugins);
    });
  });
};
