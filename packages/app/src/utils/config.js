import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';

const loadConfig = (datadir, cb) => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));
  } catch (error) {
    return cb(error);
  }

  return cb(null, config);
};

const saveConfigPlugins = (datadir, preset, config, cb) => {
  loadConfig(datadir, (err, current) => {
    if (err) {
      return err;
    }

    // eslint-disable-next-line no-param-reassign
    current.presets[preset].plugins = deepmerge(current.presets[preset].plugins, config, {
      arrayMerge: (target, source) => source.map((item, index) => ({ ...target[index], data: item.data })),
    });

    const content = JSON.stringify(current, null, 2);
    fs.writeFile(path.resolve(datadir, 'config.json'), `${content}\n`, 'utf8', cb);
  });
};

export {
  loadConfig,
  saveConfigPlugins,
};
