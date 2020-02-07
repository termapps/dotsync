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

  datadir(settings) {
    return this.dataFolder;
  }

  init(value, cb) {
    const callback = (err) => {
      rimraf(this.dataFolder, (error) => {
        return cb(err, 'Unable to fetch git repository');
      });
    };

    mkdirp(this.dataFolder, (err) => {
      if (err) {
        return cb(err, 'Bad file system permissions');
      }

      this.run('git init', (err) => {
        if (err) {
          err.message = `Unable to init local git repository: ${err.message}`;
          return callback(err);
        }

        this.run(`git remote add dotsync ${value}`, (err) => {
          if (err) {
            err.message = `Unable to add git remote: ${err.message}`;
            return callback(err);
          }

          this.run('git fetch dotsync', (err) => {
            if (err) {
              err.message = `Unable to fetch git repository: ${err.message}`;
              return callback(err);
            }

            cb(null);
          });
        });
      });
    });
  }

  latestVersion(cb) {
    this.run(`git fetch dotsync`, (err, stdout, stderr) => {
      if (err) {
        err.message = `Unable to fetch git repository: ${err.message}`;
        return cb(err);
      }

      this.run(`git log --format='%H' -n 1 dotsync/master`, (err, stdout, stderr) => {
        if (err) {
          err.message = `Unable to run 'git log': ${err.message}`;
          return cb(err);
        }

        cb(null, stdout.trim());
      });
    });
  }

  beforeRestore(settings, cb) {
    this.run(`git status --porcelain`, (err, stdout, stderr) => {
      if (err) {
        err.message = `Unable to run 'git status': ${err.message}`;
        return cb(err);
      }

      if (stdout !== '') {
        return cb(new Error('Your local copy is dirty. Please save those changes somewhere else first.'));
      }

      this.run(`git reset --hard dotsync/master`, (err, stdout, stderr) => {
        if (err) {
          err.message = `Unable to run 'git reset': ${err.message}`;
          return cb(err);
        }

        if (stdout.match(/^HEAD is now at /) === null) {
          return cb(new Error(`Unable to download the data. Failed 'git reset --hard'.`));
        }

        this.run(`git submodule update --init --recursive`, (err, stdout, stderr) => {
          if (err) {
            err.message = `Unable to update git submodules: ${err.message}`;
            return cb(err);
          }

          return cb(null);
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
