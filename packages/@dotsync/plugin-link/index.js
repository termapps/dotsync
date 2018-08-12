const exec = require('child_process').execSync;

class Link {
  constructor(datadir) {
    this.name = 'link';
    this.description = 'Symlink files to different locations';
  }

  execute(data) {
  }
};

module.exports = Link;
