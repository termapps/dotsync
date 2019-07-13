const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = (item, datadir, runner, cb) => {
  const dest = item.destination;

  if (!path.isAbsolute(dest)) {
    return cb(new Error(`Destination ${dest} is not an absolute path`));
  }

  const source = path.resolve(datadir, item.source);

  if (fs.existsSync(dest)) {
    if (fs.lstatSync(dest).isSymbolicLink() && fs.readlinkSync(dest) === source) {
      return cb();
    }

    return cb(new Error(`Destination for '${item.source}' already exists`));
  }

  if (!fs.existsSync(path.dirname(dest))) {
    mkdirp.sync(path.dirname(dest));
  }

  runner.run(`ln -sn '${source}' '${dest}'`, cb);
}
