import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as async from 'async';
import * as utils from '@dotsync/utils';

export default class Secret extends utils.Plugin {
  constructor(opts: utils.PluginOptions) {
    super('secret', 'Decrypt & Symlink files to different locations', opts);
  }

  key(password: string): Buffer {
    return crypto.createHash('sha256').update(password).digest();
  }

  encrypt(text: string, password: string): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key(password), iv);

    return Buffer.concat([iv, cipher.update(text), cipher.final()]);
  }

  decrypt(buffer: Buffer, password: string): Buffer {
    const iv = buffer.slice(0, 16);
    const contents = buffer.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key(password), iv);

    return Buffer.concat([decipher.update(contents), decipher.final()]);
  }

  restore(cb: async.ErrorCallback<Error>) {
    async.eachSeries(this.data.paths, (item: any, callback: async.ErrorCallback<Error>) => {
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

        const decrypted = this.decrypt(Buffer.from(encrypted.trim(), 'base64'), this.data._p.secret);

        fs.writeFile(dest, decrypted, 'utf8', callback);
      });
    }, cb);
  }

  prompts() {
    return {
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
  }
};
