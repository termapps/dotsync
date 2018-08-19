const mkdirp = require('mkdirp');
const path = require('path');

module.exports = (dir) => {
  const configdir = path.resolve(dir, 'Dotsync');
  mkdirp.sync(configdir);

  return configdir;
};
