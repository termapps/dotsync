const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const async = require('async');

class VSCode {
  constructor({ datadir, runner }) {
    this.name = 'vscode';
    this.description = 'Visual Studio Code packages and configuration';

    this.datadir = datadir;
    this.runner = runner;
  }

  cmd(data) {
    return data.binary || 'code';
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
        this.runner.run(`${cmd} --install-extension ${item}`, callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        async.eachSeries(toUninstall, (item, callback) => {
          this.runner.run(`${cmd} --uninstall-extension ${item}`, callback);
        }, cb);
      });
    });
  }

  list(data, cb) {
    const cmd = this.cmd(data);

    exec(`${cmd} --list-extensions --show-versions`, {
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

VSCode.expand = (options) => {
  const vscodedir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User')

  return [
    {
      name: '@dotsync/plugin-link',
      data: {
        paths: [
          {
            source: options.data.settings,
            destination: path.join(vscodedir, 'settings.json'),
          },
          {
            source: options.data.keybindings,
            destination: path.join(vscodedir, 'keybindings.json'),
          },
        ],
      },
    },
    {
      name: '@dotsync/plugin-brew',
      data: {
        casks: [
          "visual-studio-code",
        ],
      },
    },
  ];
};

module.exports = VSCode;
