const { exec } = require('child_process');
const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'atom';
    this.description = 'Atom packages and configuration';

    this.runner = runner;
  }

  restore(data, cb) {
    const cmd = data.binary || 'apm';

    this.list(cmd, (err, installed) => {
      if (err) {
        return cb(err);
      }

      const toInstall = data.packages.filter(x => installed.indexOf(x) === -1);
      const toUninstall = installed.filter(x => data.packages.indexOf(x) === -1);

      async.eachSeries(toInstall, (item, callback) => {
        this.runner.run(`${cmd} install ${item}`, callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        async.eachSeries(toUninstall, (item, callback) => {
          this.runner.run(`${cmd} uninstall ${item}`, callback);
        }, cb);
      });
    });
  }

  list(cmd, cb) {
    exec(`${cmd} list --installed --bare`, {
      encoding: 'utf8',
    }, (err, stderr, stdout) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x).map((line) => {
        return line.split('@')[0];
      }));
    });
  }
};

module.exports = Brew;
