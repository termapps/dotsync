const mkdirp = require('mkdirp');
const path = require('path');

module.exports = (dir, cb) => {
  const configdir = path.resolve(dir, 'Dotsync');

  mkdirp(configdir, err => cb(err, configdir));
};
