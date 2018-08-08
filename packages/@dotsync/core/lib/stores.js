const Folder = require('@dotsync/storage-folder');
const Git = require('@dotsync/storage-git');

module.exports = {
  git: new Git(),
  folder: new Folder(),
};
