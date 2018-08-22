const Folder = require('@dotsync/storage-folder');
const Git = require('@dotsync/storage-git');

module.exports = (dir) => {
  return {
    '@dotsync/storage-git': new Git(dir),
    '@dotsync/storage-folder': new Folder(dir),
  };
};
