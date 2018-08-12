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

    try {
      return JSON.parse(fs.readFileSync(this.file, { encoding: 'utf8' }));
    } catch (e) {
      return {};
    }
  }

  exists() {
    return fs.existsSync(this.file);
  }

  write(data) {
    return fs.writeFileSync(this.file, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8' })
  }
};

module.exports = Settings;
