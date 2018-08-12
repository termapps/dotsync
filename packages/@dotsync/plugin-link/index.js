const exec = require('child_process').exec;
const path = require('path');
const async = require('async');

class Link {
  constructor(datadir) {
    this.name = 'link';
    this.description = 'Symlink files to different locations';

    this.datadir = datadir;
  }

  execute(data, cb) {
    async.each(data.paths, (item, callback) => {
      if (path.isAbsolute(item.destination)) {
        const source = path.resolve(this.datadir, item.source);

        exec(`ln -sfn ${source} ${item.destination}`, {
          cwd: this.datadir,
          encoding: 'utf8',
        }, (err, stdout, stderr) => {
          return callback(err);
        });
      }
    }, cb);
  }
};

module.exports = Link;
