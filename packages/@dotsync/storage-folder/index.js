class Folder {
  constructor() {
    this.name = 'Folder';
    this.location = 'Path to the folder';
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
