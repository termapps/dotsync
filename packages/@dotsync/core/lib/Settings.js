const path = require('path');
const fs = require('fs');

class Settings {
  constructor(folder, type) {
    this.file = path.resolve(folder, `${type}.json`);
  }

  read() {
    if (!this.exists()) {
      return {};
    }

    return JSON.parse(fs.readFileSync(this.file, { encoding: 'utf8' }));
  }

  exists() {
    return fs.existsSync(this.file);
  }

  write(data) {
    return fs.writeFileSync(this.file, JSON.stringify(data, null, 2), { encoding: 'utf8' })
  }
};

module.exports = Settings;
