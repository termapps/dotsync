[
  'configdir',
  'isPlugin',
  'isStore',
  'restore',
  'settings',
].forEach(mod => {
  module.exports[mod] = require(`./lib/${mod}`);
});
