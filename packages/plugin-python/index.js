const { exec } = require('child_process');
const async = require('async');

class Python {
  constructor({ datadir, runner }) {
    this.name = 'python';
    this.description = 'Python packages and configuration';

    this.datadir = datadir;
    this.runner = runner;
  }

  cmd(data) {
    return data.binary || 'pip3';
  }

  restore(data, cb) {
    const cmd = this.cmd(data);

    this.list(data, (err, installed) => {
      if (err) {
        return cb(err);
      }

      const toInstall = data.packages.filter(x => installed.packages.indexOf(x.name) === -1);

      async.eachSeries(toInstall, (item, callback) => {
        this.runner.run(`${cmd} install ${item.name}`, callback);
      }, cb);
    });
  }

  list(data, cb) {
    const cmd = this.cmd(data);

    exec(`${cmd} freeze`, {
      encoding: 'utf8',
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      cb(null, {
        packages: stdout.split('\n').filter(x => x).map((line) => {
          return line.split('==')[0];
        }),
      });
    });
  }
};

Python.expand = (options) => {
  return [
    {
      name: '@dotsync/plugin-brew',
      data: {
        kegs: [
          {
            name: 'python',
            pin: true,
          },
        ],
      },
    },
  ];
};

module.exports = Python;
