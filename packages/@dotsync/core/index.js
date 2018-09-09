[
  'configdir',
  'restore',
  'settings',
  'stores',
].forEach(mod => {
  module.exports[mod] = require(`./lib/${mod}`);
});
