import { exec } from 'child_process';
import * as utils from '@dotsync/utils';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';

export default class Git extends utils.Storage {
  dataFolder: string

  constructor(opts: utils.StorageOptions) {
    super('Git', 'Use git repository to store your dotfiles', 'URL to git repository', opts);

    this.dataFolder = path.join(this.configdir, 'data');
  }

  run(cmd: string, cb: (err: Error, stdout?: string, stderr?: string) => void) {
    return exec(cmd, { cwd: this.dataFolder, encoding: 'utf8' }, cb);
  }

  datadir() {
    return this.dataFolder;
  }

  validate(cb: (err?: Error, m?: string) => void) {
    this.run(`git ls-remote ${this.settings.location}`, (err) => {
      if (err) {
        return cb(err, 'Repository not found');
      }

      return cb();
    });
  }

  init(cb: (err?: Error, m?: string) => void) {
    const callback = (err?: Error) => {
      rimraf(this.dataFolder, (_) => {
        return cb(err, 'Unable to fetch git repository');
      });
    };

    mkdirp(this.dataFolder, (err: Error) => {
      if (err) {
        return cb(err, 'Bad file system permissions');
      }

      this.run('git init', (err) => {
        if (err) {
          err.message = `Unable to init local git repository: ${err.message}`;
          return callback(err);
        }

        this.run(`git remote add dotsync ${this.settings.location}`, (err) => {
          if (err) {
            err.message = `Unable to add git remote: ${err.message}`;
            return callback(err);
          }

          this.run('git fetch dotsync', (err) => {
            if (err) {
              err.message = `Unable to fetch git repository: ${err.message}`;
              return callback(err);
            }

            return cb();
          });
        });
      });
    });
  }

  latestVersion(cb: (err: Error | null, version?: string) => void) {
    this.run(`git fetch dotsync`, (err) => {
      if (err) {
        err.message = `Unable to fetch git repository: ${err.message}`;
        return cb(err);
      }

      this.run(`git log --format='%H' -n 1 dotsync/master`, (err, stdout) => {
        if (err) {
          err.message = `Unable to run 'git log': ${err.message}`;
          return cb(err);
        }

        cb(null, stdout.trim());
      });
    });
  }

  beforeRestore(cb: utils.Callback) {
    this.run(`git status --porcelain`, (err, stdout) => {
      if (err) {
        err.message = `Unable to run 'git status': ${err.message}`;
        return cb(err);
      }

      if (stdout !== '') {
        return cb(new Error('Your local copy is dirty. Please save those changes somewhere else first.'));
      }

      this.run(`git reset --hard dotsync/master`, (err, stdout) => {
        if (err) {
          err.message = `Unable to run 'git reset': ${err.message}`;
          return cb(err);
        }

        if (stdout.match(/^HEAD is now at /) === null) {
          return cb(new Error(`Unable to download the data. Failed 'git reset --hard'.`));
        }

        this.run(`git submodule update --init --recursive`, (err) => {
          if (err) {
            err.message = `Unable to update git submodules: ${err.message}`;
            return cb(err);
          }

          return cb();
        });
      });
    });
  }

  // TODO: What if a previous `afterBackup` failed from device "A", and a
  // backup from another device "B" succeeded, then restoring the succeeded
  // backup on "A" would erase the stuff that was added there.
  afterBackup(cb: utils.Callback) {
    this.run(`git push dotsync master`, (err) => {
      if (err) {
        err.message = `Unable to push to git remote: ${err.message}`;
        return cb(err);
      }

      return cb();
    });
  }
}

module.exports = Git;
