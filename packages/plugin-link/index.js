const path = require('path');
const fs = require('fs');
const async = require('async');

class Link {
  constructor({ datadir, runner }) {
    this.name = 'link';
    this.description = 'Symlink files to different locations';

    this.datadir = datadir;
    this.runner = runner;
  }

  restore(data, cb) {
    async.eachSeries(data.paths, (item, callback) => {
      const dest = item.destination;

      if (path.isAbsolute(dest)) {
        const source = path.resolve(this.datadir, item.source);

        if (fs.existsSync(dest)) {
          if (fs.lstatSync(dest).isSymbolicLink() && fs.readlinkSync(dest) === source) {
            return callback();
          } else {
            return callback(new Error(`Destination for '${item.source}' already exists`));
          }
        }

        this.runner.run(`ln -sn '${source}' '${dest}'`, callback);
      }
    }, cb);
  }
};

module.exports = Link;
