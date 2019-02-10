import mkdirp from 'mkdirp';
import path from 'path';

export default (dir, cb) => {
  const configdir = path.resolve(dir, 'Dotsync');

  mkdirp(configdir, err => cb(err, configdir));
};
