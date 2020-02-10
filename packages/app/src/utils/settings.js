import fs from 'fs';
import path from 'path';

export default {
  default(type) {
    if (type === 'store') {
      return '{ "location": "" }';
    }

    return '{}';
  },

  read(dir, type) {
    const file = path.resolve(dir, `${type}.json`);
    let data = this.default(type);

    if (fs.existsSync(file)) {
      data = fs.readFileSync(file, { encoding: 'utf8' });
    }

    return JSON.parse(data);
  },

  write(dir, type, data) {
    const file = path.resolve(dir, `${type}.json`);

    fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8' });
  },
};
