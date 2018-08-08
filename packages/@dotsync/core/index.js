[
  'configdir',
  'Settings',
  'stores',
].forEach(mod => {
  module.exports[mod] = require(`./lib/${mod}`);
});
