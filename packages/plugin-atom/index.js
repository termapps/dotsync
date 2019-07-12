const exec = require('child_process').exec;
const async = require('async');

class Brew {
  constructor(datadir) {
    this.name = 'atom';
    this.description = 'Atom ...';

    this.datadir = datadir;
  }

  // apm list --installed --bare

  restore(data, cb) {
    const cmd = data.binary || 'apm';

    async.each(data.packages, (item, callback) => {
      exec(`${cmd} install ${item.name}`, {
        cwd: this.datadir,
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        return callback(err);
      });
    }, cb);
  }
};

module.exports = Brew;
