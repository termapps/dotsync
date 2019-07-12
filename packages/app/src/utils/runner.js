import { exec } from 'child_process';

export default class Runner {
  constructor(datadir, log) {
    this.datadir = datadir;
    this.log = log;
  }

  run(cmd, cb) {
    this.log(`${cmd}\n`);

    let gotError = false;
    const process = exec(cmd, {
      cwd: this.datadir,
      encoding: 'utf8',
    });

    process.on('error', (err) => {
      gotError = true;
      cb(err);
    });

    process.on('exit', () => {
      if (!gotError) {
        cb();
      }
    });

    process.stdout.on('data', this.log);
    process.stderr.on('data', this.log);
  }
}
