const exec = require('child_process').exec;

class Git {
  name: 'git',
  description: 'Use git repository to store your dotfiles',

  constructor() {

  },

  beforeRestore() {
    // Git pull
  },

  afterBackup() {
    // Git push
  },
};

module.exports = Git;
