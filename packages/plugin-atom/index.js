const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const { link } = require('@dotsync/plugin-link');
const async = require('async');

class Atom {
  constructor({ datadir, runner }) {
    this.name = 'atom';
    this.description = 'Atom packages and configuration';

    this.datadir = datadir;
    this.runner = runner;
  }

  getConfig(data) {
    const ret = [];
    const atomdir = path.join(os.homedir(), '.atom');

    if (data.keymap) {
      ret.push({ source: data.keymap, destination: path.join(atomdir, 'keymap.cson') });
    }

    if (data.snippets) {
      ret.push({ source: data.snippets, destination: path.join(atomdir, 'snippets.cson') });
    }

    if (data.styles) {
      ret.push({ source: data.styles, destination: path.join(atomdir, 'styles.less') });
    }

    if (data.init) {
      ret.push({ source: data.init, destination: path.join(atomdir, 'init.coffee') });
    }

    if (data.config) {
      ret.push({ source: data.config, destination: path.join(atomdir, 'config.cson') });
    }

    return ret;
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
        }, (err) => {
          if (err) {
            return cb(err);
          }

          async.eachSeries(this.getConfig(data), (item, callback) => {
            link(item, this.datadir, this.runner, callback);
          }, cb);
        });
      });
    });
  }

  list(cmd, cb) {
    exec(`${cmd} list --installed --bare`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      cb(null, stdout.split('\n').filter(x => x).map((line) => {
        return line.split('@')[0];
      }));
    });
  }
};

module.exports = Atom;
