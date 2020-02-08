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

      const tapsToInstall = data.taps.filter(x => !installed.taps.some(Brew.compare.taps(x)));
      const kegsToInstall = data.kegs.filter(x => !installed.kegs.some(Brew.compare.kegs(x)));
      const casksToInstall = data.casks.filter(x => !installed.casks.some(Brew.compare.casks(x)));

      async.eachSeries(tapsToInstall, (item, callback) => {
        this.runner.run(`${cmd} tap ${item.name}`, callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        async.eachSeries(kegsToInstall, (item, callback) => {
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

          async.eachSeries(casksToInstall, (item, callback) => {
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
      maxBuffer: 1024 * 1024,
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      const out = JSON.parse(stdout)
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

      cb(null, stdout.split('\n').filter(x => x).map(x => ({
        name: x
      })));
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

Brew.compare = {
  taps: (f) => {
    return (e) => e.name == f.name && e.remote == f.remote;
  },
  kegs: (f) => {
    return (e) => e.name == f.name;
  },
  casks: (f) => {
    return (e) => e == f;
  },
};

module.exports = Brew;
