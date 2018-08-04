[
  'configdir',
].forEach(mod => {
  module.exports[mod] = require(`./lib/${mod}`);
});
