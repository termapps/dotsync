const fs = require('fs');
const path = require('path');

module.exports = (datadir, cb) => {
  const config = JSON.parse(fs.readFileSync(path.resolve(datadir, 'config.json'), 'utf8'));

  config.presets.default.plugins.forEach((item) => {
    const plugin = new (require(item.name))(datadir);

    plugin.execute(item.data, cb);
  });
};
