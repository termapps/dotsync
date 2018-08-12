const path = require('path');
const fs = require('fs');

class Folder {
  constructor(configdir) {
    this.name = 'Folder';
    this.location = 'Absolute path to the folder';
    this.description = 'Use a folder (backed up by other ways) to store your dotfiles';
  }

  valid(value) {
    try {
      fs.accessSync(path.resolve(__dirname, value), fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
      // TODO: Pinpoint the error more
      return 'Folder doesn\'t exist or is not writeable';
    }

    return '';
  }

  init(value) {
    return '';
  }

  latestVersion(cb) {
    // TODO: Last modified time
    cb(new Error('Not implemented'));
  }

  beforeRestore(datadir, cb) {
    cb(null, datadir);
  }

  afterBackup(cb) {
    cb(null);
  }
};

module.exports = Folder;
