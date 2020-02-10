import * as utils from '@dotsync/utils';
import * as path from 'path';
import * as fs from 'fs';

export default class Folder extends utils.Storage {
  dataFolder: string

  constructor(opts: utils.StorageOptions) {
    super('Folder', 'Use a folder (backed up by other ways) to store your dotfiles', 'Absolute path to the folder', opts);
  }

  datadir() {
    return this.settings.location;
  }

  validate(cb: (err?: Error, m?: string) => void) {
    const location = path.resolve(__dirname, this.settings.location);

    fs.access(location, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        return cb(err, 'Folder doesn\'t exist or is not writeable');
      }

      return cb();
    });
  }

  latestVersion(cb: (err: Error | null, version?: string) => void) {
    cb(new Error('Not implemented'));
  }

  beforeRestore(cb: utils.Callback) {
    cb(new Error('Not implemented'));
  }

  afterBackup(cb: utils.Callback) {
    cb(new Error('Not implemented'));
  }
};

module.exports = Folder;
