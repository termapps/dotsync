const Folder = require('@dotsync/storage-folder');
const Git = require('@dotsync/storage-git');

module.exports = (configdir) => {
  return {
    '@dotsync/storage-git': new Git(configdir),
    '@dotsync/storage-folder': new Folder(configdir),
  };
};
