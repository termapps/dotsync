class Folder {
  name: 'git',
  description: 'Use a folder (backed up by other ways) to store your dotfiles',

  constructor() {

  },

  beforeRestore() {
    // Do nothing
  },

  afterBackup() {
    // Do nothing
  },
};

module.exports = Folder;
