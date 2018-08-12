[
  'configdir',
  'restore',
  'Settings',
  'stores',
].forEach(mod => {
  module.exports[mod] = require(`./lib/${mod}`);
});
