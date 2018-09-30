module.exports = (plugin) => {
  return /^(@dotsync\/|dotsync-|@[\w-]+\/dotsync-)plugin-/.test(plugin);
};
