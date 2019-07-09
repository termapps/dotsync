const async = require('async');

class Brew {
  constructor(datadir) {
    this.name = 'brew';
    this.description = 'Homebrew ...';

    this.datadir = datadir;
  }

  restore(data, cb) {
    async.each(data.taps, (item, callback) => {
      exec(`brew tap ${item.name}`, {
        cwd: this.datadir,
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        return callback(err);
      });
    }, cb);
  }
};

module.exports = Brew;
