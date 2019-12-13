const async = require('async');
const link = require('./link');

class Secret {
  constructor({ datadir, runner }) {
    this.name = 'secret';
    this.description = 'Decrypt & Symlink files to different locations';

    this.datadir = datadir;
    this.runner = runner;
  }

  restore(data, cb) {
    async.eachSeries(data.paths, (item, callback) => {
      link(item, this.datadir, this.runner, callback)
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
