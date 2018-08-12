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
    try {
      mkdirp.sync(this.dataFolder);

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

  beforeRestore(repo, cb) {
    this.run(`git status --porcelain`, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      if (stdout !== '') {
        return cb(new Error('Your local copy is dirty. Please save those changes somewhere else first.'));
      }

      this.run(`git reset --hard dotsync/master`, (err, stdout, stderr) => {
        if (err) {
          return cb(err);
        }

        if (stdout.match(/^HEAD is now at /) === null) {
          return cb(new Error(`Unable to download the data. Failed 'git reset --hard'.`));
        }

        this.run(`git submodule update --init --recursive`, (err, stdout, stderr) => {
          if (err) {
            return cb(err);
          }

          return cb(null, this.dataFolder);
        });
      });
    });
  }

  // TODO: What if a previous `afterBackup` failed from device "A", and a
  // backup from another device "B" succeeded, then restoring the succeeded
  // backup on "A" would erase the stuff that was added there.
  afterBackup(cb) {
    this.run(`git push dotsync master`, cb);
  }
};

module.exports = Git;
