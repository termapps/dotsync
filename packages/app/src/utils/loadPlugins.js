// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import { list, load } from 'electron-plugin-manager';
import async from 'async';
import semver from 'semver';
import deepmerge from 'deepmerge';
import isPlugin from './isPlugin';
import loadConfig from './loadConfig';
import Runner from './runner';

const isInstalled = need => (item) => {
  let frags = item.split('@');

  if (frags.length === 3) {
    frags = [`@${frags[1]}`, frags[2]];
  }

  return frags[0] === need.name && semver.satisfies(frags[1], need.version);
};

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

    const configString = JSON.stringify(config);

    const result = config.reduce((acc, item) => {
      const Plugin = load(configdir, item.name, remote.require);

      acc[item.name] = new Plugin({
        data: item.data,
        datadir,
        runner: new Runner(datadir, log),
      });

      return acc;
    }, {});

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

      expanded.forEach((item) => {
        const ifExistsIndex = config.findIndex(i => i.name === item.name);

        if (ifExistsIndex !== -1) {
          // eslint-disable-next-line no-param-reassign
          config[ifExistsIndex] = deepmerge(config[ifExistsIndex], item);
        } else {
          if (!item.version) {
            // eslint-disable-next-line no-param-reassign
            item.version = 'latest';
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
