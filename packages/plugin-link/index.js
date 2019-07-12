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

        this.runner.run(`ln -sn '${source}' '${d}'`, callback);
      }
    }, cb);
  }
};

module.exports = Link;
