const async = require('async');
const link = require('./link');

class Link {
  constructor({ datadir, runner }) {
    this.name = 'link';
    this.description = 'Symlink files to different locations';

    this.datadir = datadir;
    this.runner = runner;
  }

  restore(data, cb) {
    async.eachSeries(data.paths, (item, callback) => {
      link(item, this.datadir, this.runner, callback)
    }, cb);
  }
};

Link.link = link;

module.exports = Link;
