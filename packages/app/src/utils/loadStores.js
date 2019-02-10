// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import { list, load } from 'electron-plugin-manager';
import isStore from './isStore';

export default configdir => list(configdir)
  .filter(isStore)
  .reduce((acc, store) => {
    acc[store] = new (load(configdir, store, remote.require))(configdir);
    return acc;
  }, {});
