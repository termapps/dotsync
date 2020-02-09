import { exec } from 'child_process';
import * as async from 'async';
import { ConfigPluginData } from './config';

export default class Module<T> {
  key: string
  listCmd: string

  installCmd: (item: T) => string
  uninstallCmd: (item: T) => string

  compare: (x: T) => (e: T) => boolean
  modify: (stdout: string) => T[]

  excluded: T[]

  runner: any

  constructor({ key, listCmd, installCmd, uninstallCmd, compare, modify, excluded, runner }: {
    key: string;
    listCmd: string;
    installCmd: (item: T) => string;
    uninstallCmd: (item: T) => string;
    compare: (f: T) => (e: T) => boolean;
    modify: (out: string) => T[];
    excluded?: T[];
    runner: any;
  }) {
    this.key = key;
    this.listCmd = listCmd;

    this.installCmd = installCmd;
    this.uninstallCmd = uninstallCmd;

    this.compare = compare;
    this.modify = modify;

    this.excluded = excluded || [];

    this.runner = runner;
  }

  restore(data: ConfigPluginData, cb: async.ErrorCallback<Error>) {
    this.list((err, installed) => {
      if (err) {
        return cb(err);
      }

      const needed: T[] = data._modules[this.key];

      const toInstall = needed.filter(x => !installed.some(this.compare(x)));
      const toUninstall = installed.filter(x => !needed.some(this.compare(x)));

      async.eachSeries(toInstall, (item, callback) => {
        this.runner.run(this.installCmd(item), callback);
      }, (err) => {
        if (err) {
          return cb(err);
        }

        if (!(data.config && data.config.uninstall && data.config.uninstall[this.key])) {
          return cb();
        }

        async.eachSeries(toUninstall, (item, callback) => {
          this.runner.run(this.uninstallCmd(item), callback);
        }, cb);
      });
    });
  }

  list(cb: (err?: Error, installed?: T[]) => void) {
    exec(this.listCmd, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    }, (err, stdout, stderr) => {
      if (err) {
        return cb(err);
      }

      const installed = this.modify(stdout);
      const installedAfterExcluded = installed.filter(x => !this.excluded.some(this.compare(x)));

      cb(null, installedAfterExcluded);
    });
  }
};
