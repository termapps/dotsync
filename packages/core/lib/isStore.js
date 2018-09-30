module.exports = (plugin) => {
  return /^(@dotsync\/|dotsync-|@[\w-]+\/dotsync-)storage-/.test(plugin);
};
