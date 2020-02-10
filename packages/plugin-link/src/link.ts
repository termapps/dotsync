import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as utils from '@dotsync/utils';
import Item from './item';

export default (item: Item, datadir: string, runner: any, cb: utils.Callback) => {
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
};
