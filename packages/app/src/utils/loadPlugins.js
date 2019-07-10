// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import { list, load } from 'electron-plugin-manager';
import async from 'async';
import semver from 'semver';
import isPlugin from './isPlugin';

// Install missing plugins and load all plugins
export default (configdir, needed, cb) => {
  const installed = list(configdir, { version: true }).filter(isPlugin);

  const isInstalled = need => (item) => {
    let frags = item.split('@');

    if (frags.length === 3) {
      frags = [`@${frags[1]}`, frags[2]];
    }

    return frags[0] === need.name && semver.satisfies(frags[1], need.version);
  };

  const toInstall = needed.filter(need => !installed.some(isInstalled(need)));

  async.eachSeries(toInstall, (item, callback) => {
    ipcRenderer.on(`epm-installed-${item.name}`, (event, error, pluginPath) => {
      callback(error, pluginPath);
    });

    ipcRenderer.send('epm-install', configdir, item.name, item.version);
  }, (err) => {
    if (err) {
      return cb(err);
    }

    const result = needed.reduce((acc, item) => {
      acc[item.name] = load(configdir, item.name, remote.require);
      return acc;
    }, {});

    return cb(null, result);
  });
};
