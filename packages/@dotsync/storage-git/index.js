const exec = require('child_process').exec;

class Git {
  constructor() {
    this.name = 'git';
    this.description = 'Use git repository to store your dotfiles';
  }

  beforeRestore() {
    // Git pull
  }

  afterBackup() {
    // Git push
  }
};

module.exports = Git;
