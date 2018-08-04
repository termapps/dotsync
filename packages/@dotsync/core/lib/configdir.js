const mkdirp = require('mkdirp');
const path = require('path');

module.exports = (appname) => {
  let dir;
  const platform = process.platform;
  const home = window.process.env.HOME;

  if (platform == 'win32') {
    dir = window.process.env.APPDATA;
  } else if (platform == 'darwin') {
    dir = path.join(home, 'Library', 'Application Support');
  } else {
    dir = window.process.env.XDG_CONFIG_HOME || path.join(home, '.config');
  }

  const configdir = path.join(dir, appname);
  mkdirp.sync(configdir);

  return configdir;
};
