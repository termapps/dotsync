[
  'configdir',
  'isPlugin',
  'isStore',
  'loadStores',
  'restore',
  'settings',
].forEach((mod) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  module.exports[mod] = require(`./${mod}`);
});
