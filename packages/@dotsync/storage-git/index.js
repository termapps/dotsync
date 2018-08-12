const exec = require('child_process').execSync;
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');

class Git {
  constructor(configdir) {
    this.name = 'Git';
    this.location = 'URL to git repository';
    this.description = 'Use git repository to store your dotfiles';

    this.configdir = configdir;
    this.dataFolder = path.join(this.configdir, 'data');
  }

  run(cmd) {
    return exec(cmd, { cwd: this.dataFolder, encoding: 'utf8' });
  }

  valid(value) {
    try {
      exec(`git ls-remote ${value}`);
    } catch (e) {
      return 'Repository not found';
    }

    return '';
  }

  init(value) {
    mkdirp.sync(this.dataFolder);

    try {
      this.run(`git init`);
      this.run(`git remote add dotsync ${value}`);
      this.run(`git fetch dotsync`);
    } catch (e) {
      rimraf.sync(this.dataFolder);
      // TODO: Pinpoint error
      return 'Unable to fetch git repository';
    }

    return '';
  }

  latestVersion() {
    try {
      this.run(`git fetch dotsync`);
      return this.run(`git log --format='%H' -n 1 dotsync/master`);
    } catch (e) {
      // TODO: Pinpoint error
      return 'Unable to get the latest version';
    }
  }

  beforeRestore() {
    try {
      this.run(`git reset --hard dotsync/master`);
    } catch (e) {
      return 'Unable to reset local repository to upstream';
    }
  }

  afterBackup() {
    try {
      this.run(`git push dotsync master`);
    } catch (e) {
      return 'Unable to push to git repository';
    }
  }
};

module.exports = Git;
