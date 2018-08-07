class Folder {
  constructor() {
    this.name = 'folder';
    this.description = 'Use a folder (backed up by other ways) to store your dotfiles';
  }

  beforeRestore() {
    // Do nothing
  }

  afterBackup() {
    // Do nothing
  }
};

module.exports = Folder;
