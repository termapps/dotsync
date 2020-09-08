// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import { list, load } from 'electron-plugin-manager';
import isStore from './isStore';

export default (configdir, settings) => list(configdir)
  .filter(isStore)
  .reduce((acc, store) => {
    const Store = load(configdir, store, remote.require).default;
    acc[store] = new (Store)({ configdir, settings });
    return acc;
  }, {});
