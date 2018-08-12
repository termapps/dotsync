const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
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

  runSync(cmd) {
    return execSync(cmd, { cwd: this.dataFolder, encoding: 'utf8' });
  }

  run(cmd, cb) {
    return exec(cmd, { cwd: this.dataFolder, encoding: 'utf8' }, cb);
  }

  valid(value) {
    try {
      execSync(`git ls-remote ${value}`);
    } catch (e) {
      return 'Repository not found';
    }

    return '';
  }

  init(value) {
    mkdirp.sync(this.dataFolder);

    try {
      this.runSync(`git init`);
      this.runSync(`git remote add dotsync ${value}`);
      this.runSync(`git fetch dotsync`);
    } catch (e) {
      rimraf.sync(this.dataFolder);
      // TODO: Pinpoint error
      return 'Unable to fetch git repository';
    }

    return '';
  }

  latestVersion(cb) {
    this.run(`git fetch dotsync`, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      this.run(`git log --format='%H' -n 1 dotsync/master`, (err, stdout, stderr) => {
        cb(err, stdout.trim());
      });
    });
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
