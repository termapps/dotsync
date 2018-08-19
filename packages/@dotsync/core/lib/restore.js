const fs = require('fs');
const path = require('path');

const Link = require('@dotsync/plugin-link');

const plugins = {
  '@dotsync/plugin-link': Link,
};

module.exports = (datadir, cb) => {
  const config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));

  config.presets.default.plugins.forEach((item) => {
    const plugin = new (plugins[item.name])(datadir);

    // TODO: Many plugins
    plugin.restore(item.data, cb);
  });
};
