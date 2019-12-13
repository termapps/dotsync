const async = require('async');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

class Secret {
  constructor({ datadir, runner }) {
    this.name = 'secret';
    this.description = 'Decrypt & Symlink files to different locations';

    this.datadir = datadir;
    this.runner = runner;
  }

  key(password) {
    return crypto.createHash('sha256').update(password).digest();
  }

  encrypt(buffer, password) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key(password), iv);

    return Buffer.concat([iv, cipher.update(text), cipher.final()]);
  }

  decrypt(buffer, password) {
    const iv = buffer.slice(0, 16);
    const contents = buffer.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key(password), iv);

    return Buffer.concat([decipher.update(contents), decipher.final()]);
  }

  restore(data, cb) {
    async.eachSeries(data.paths, (item, callback) => {
      const dest = item.destination;

      if (!path.isAbsolute(dest)) {
        return callback(new Error(`Destination ${dest} is not an absolute path`));
      }

      const source = path.resolve(this.datadir, item.source);

      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }

      fs.readFile(source, 'utf8', (err, encrypted) => {
        if (err) {
          return callback(err);
        }

        const decrypted = this.decrypt(Buffer.from(encrypted.trim(), 'base64'), data._p.secret);

        fs.writeFile(dest, decrypted, 'utf8', callback);
      });
    }, cb);
  }
};

Secret.prompts = {
  backup: [
    {
      name: 'secret',
      label: 'Secret to encrypt files with',
      type: 'input',
      inputType: 'password',
    },
  ],
  restore: [
    {
      name: 'secret',
      label: 'Secret to decrypt files with',
      type: 'input',
      inputType: 'password',
    },
  ],
};

module.exports = Secret;
