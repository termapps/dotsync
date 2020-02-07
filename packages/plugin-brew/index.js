const { exec } = require('child_process');
const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'brew';
    this.description = 'Homebrew taps, kegs and casks';

    this.runner = runner;
  }

  cmd(data) {
    return data.binary || 'brew';
  }

  restore(data, cb) {
    const cmd = this.cmd(data);

    this.list(data, (err, installed) => {
      if (err) {
        return cb(err);
      }

      const taps = data.taps.filter(x => installed.taps.map(x => x.name).indexOf(x.name) === -1);
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

  list(data, cb) {
    const cmd = this.cmd(data);

    this.listTaps(cmd, (err, taps) => {
      if (err) {
        return cb(err);
      }

      this.listKegs(cmd, (err, kegs) => {
        if (err) {
          return cb(err);
        }

        this.listCasks(cmd, (err, casks) => {
          if (err) {
            return cb(err);
          }

          cb(null, { taps, kegs, casks });
        });
      });
    });
  }

  listTaps(cmd, cb) {
    exec(`${cmd} tap-info --installed --json`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      const out = JSON.parse(stdout)
        .filter(x => !x.private)
        .map(x => ({
          name: x.name,
          remote: x.remote,
        }));

      cb(null, out);
    });
  }

  listKegs(cmd, cb) {
    exec(`${cmd} list -1`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x));
    });
  }

  listCasks(cmd, cb) {
    exec(`${cmd} cask list -1`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x));
    });
  }
};

module.exports = Brew;
