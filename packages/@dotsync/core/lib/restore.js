const fs = require('fs');
const path = require('path');

const Link = require('@dotsync/plugin-link');

const plugins = {
  '@dotsync/plugin-link': Link,
};

module.exports = (datadir, cb) => {
  console.log(require('child_process').execSync(`npm root`));
  const config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));

  config.presets.default.plugins.forEach((item) => {
    const plugin = new (plugins[item.name])(datadir);

    plugin.restore(item.data, cb);
  });
};
