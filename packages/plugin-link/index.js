const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const async = require('async');

class Link {
  constructor(datadir) {
    this.name = 'link';
    this.description = 'Symlink files to different locations';

    this.datadir = datadir;
  }

  restore(data, cb) {
    async.each(data.paths, (item, callback) => {
      const d = item.destination;

      if (path.isAbsolute(d)) {
        const source = path.resolve(this.datadir, item.source);

        if (fs.existsSync(d)) {
          if (fs.lstatSync(d).isSymbolicLink() && fs.readlinkSync(d) === source) {
            return callback();
          } else {
            return callback(new Error(`Destination for '${item.source}' already exists`));
          }
        }

        exec(`ln -sn '${source}' '${d}'`, {
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
