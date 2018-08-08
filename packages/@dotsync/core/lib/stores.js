const Folder = require('@dotsync/storage-folder');
const Git = require('@dotsync/storage-git');

module.exports = (configdir) => {
  return {
    git: new Git(configdir),
    folder: new Folder(configdir),
  };
};
