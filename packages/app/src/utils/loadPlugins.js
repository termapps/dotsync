import { remote, ipcRenderer } from 'electron';
import { list, load } from 'electron-plugin-manager';
import async from 'async';
import isPlugin from './isPlugin';

// Install missing plugins and load all plugins
export default (configdir, needed, cb) => {
  const installed = list(configdir).filter(isPlugin);
  const toInstall = needed.filter(x => installed.indexOf(x.name) === -1);

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
