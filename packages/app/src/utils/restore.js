const fs = require('fs');
const path = require('path');
const async = require('async');

const Link = require('@dotsync/plugin-link');

// TODO: More modular plugin system
const plugins = {
  '@dotsync/plugin-link': Link,
};

module.exports = (datadir, cb) => {
  const config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));

  async.eachSeries(config.presets.default.plugins, (item, callback) => {
    const plugin = new (plugins[item.name])(datadir);
    plugin.restore(item.data, callback);
  }, cb);
};
