const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const async = require('async');

class Atom {
  constructor({ datadir, runner }) {
    this.name = 'atom';
    this.description = 'Atom packages and configuration';

    this.datadir = datadir;
    this.runner = runner;
  }

  cmd(data) {
    return data.binary || 'apm';
  }

  restore(data, cb) {
    const cmd = this.cmd(data);

    this.list(data, (err, installed) => {
      if (err) {
        return cb(err);
      }

      const toInstall = data.packages.filter(x => installed.packages.indexOf(x) === -1);
      const toUninstall = installed.packages.filter(x => data.packages.indexOf(x) === -1);

      async.eachSeries(toInstall, (item, callback) => {
        this.runner.run(`${cmd} install ${item}`, callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        if (!(data.uninstall && data.uninstall.packages)) {
          return cb();
        }

        async.eachSeries(toUninstall, (item, callback) => {
          this.runner.run(`${cmd} uninstall ${item}`, callback);
        }, cb);
      });
    });
  }

  list(data, cb) {
    const cmd = this.cmd(data);

    exec(`${cmd} list --installed --bare`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      cb(null, {
        packages: stdout.split('\n').filter(x => x).map((line) => {
          return line.split('@')[0];
        }),
      });
    });
  }
};

Atom.expand = (options) => {
  const atomdir = path.join(os.homedir(), '.atom');

  return [
    {
      name: '@dotsync/plugin-link',
      data: {
        paths: [
          {
            source: options.data.keymap,
            destination: path.join(atomdir, 'keymap.cson'),
          },
          {
            source: options.data.snippets,
            destination: path.join(atomdir, 'snippets.cson'),
          },
          {
            source: options.data.styles,
            destination: path.join(atomdir, 'styles.less'),
          },
          {
            source: options.data.init,
            destination: path.join(atomdir, 'init.coffee'),
          },
          {
            source: options.data.config,
            destination: path.join(atomdir, 'config.cson'),
          },
        ],
      },
    },
    {
      name: '@dotsync/plugin-brew',
      data: {
        casks: [
          'atom',
        ],
      },
    },
  ];
};

module.exports = Atom;
