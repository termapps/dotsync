const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'brew';
    this.description = 'Homebrew taps, kegs and casks';

    this.runner = runner;
  }

  restore(data, cb) {
    const cmd = data.binary || 'brew';

    async.each(data.taps, (item, callback) => {
      this.runner.run(`${cmd} tap ${item.name}`, callback);
    }, (err) => {
      if (err) {
        return cb(err);
      }

      async.each(data.kegs, (item, callback) => {
        this.runner.run(`${cmd} install ${item.name}`, (err) => {
          if (err || !item.pin) {
            return callback(err);
          }

          this.runner.run(`${cmd} pin ${item.name}`, callback);
        });
      }, (err) => {
        if (err) {
          return cb(err);
        }

        async.each(data.casks, (item, callback) => {
          this.runner.run(`${cmd} cask install ${item}`, callback);
        }, cb);
      });
    });
  }
};

module.exports = Brew;
