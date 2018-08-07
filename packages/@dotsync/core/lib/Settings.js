const path = require('path');
const fs = require('fs');

class Settings {
  // TODO: Catch fs error
  constructor(folder, type) {
    this.file = path.join(folder, `${type}.json`);
  }

  read() {
    if (!exists()) {
      return {};
    }

    const data = fs.readFileSync(this.file, { encoding: 'utf8' });

    // TODO: Catch JSON.parse error
    return JSON.parse(data);
  }

  exists() {
    return fs.existsSync(this.file);
  }

  write(data) {
    return fs.writeFileSync(this.file, JSON.stringify(data, null, 2), { en})
  }
};

module.exports = Settings;
