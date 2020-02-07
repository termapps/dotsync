import fs from 'fs';
import path from 'path';

export default (datadir, cb) => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));
  } catch (error) {
    return cb(error);
  }

  return cb(null, config);
};
