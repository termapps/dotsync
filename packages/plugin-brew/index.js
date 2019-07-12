const { exec } = require('child_process');
const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'brew';
    this.description = 'Homebrew taps, kegs and casks';

    this.runner = runner;
  }

  restore(data, cb) {
    const cmd = data.binary || 'brew';

    list(cmd, (err, installed) => {
      if (err) {
        return cb(err);
      }

      const taps = data.taps.filter(x => installed.taps.indexOf(x.name) === -1);
      const kegs = data.kegs.filter(x => installed.kegs.indexOf(x.name) === -1);
      const casks = data.casks.filter(x => installed.casks.indexOf(x) === -1);

      async.eachSeries(taps, (item, callback) => {
        this.runner.run(`${cmd} tap ${item.name}`, callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        async.eachSeries(kegs, (item, callback) => {
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

          async.eachSeries(casks, (item, callback) => {
            this.runner.run(`${cmd} cask install ${item}`, callback);
          }, cb);
        });
      });
    });
  }

  list(cmd, cb) {
    listTaps(cmd, (err, taps) => {
      if (err) {
        return cb(err);
      }

      listKegs(cmd, (err, kegs) => {
        if (err) {
          return cb(err);
        }

        listCasks(cmd, (err, casks) => {
          if (err) {
            return cb(err);
          }

          cb(null, { taps, kegs, casks });
        });
      });
    });
  }

  listTaps(cmd, cb) {
    exec(`${cmd} tap`, {
      encoding: 'utf8',
    }, (err, stderr, stdout) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x));
    });
  }

  listKegs(cmd, cb) {
    exec(`${cmd} list -1`, {
      encoding: 'utf8',
    }, (err, stderr, stdout) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x));
    });
  }

  listCasks(cmd, cb) {
    exec(`${cmd} cask list -1`, {
      encoding: 'utf8',
    }, (err, stderr, stdout) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x));
    });
  }
};

module.exports = Brew;
