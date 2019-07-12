const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'brew';
    this.description = 'Homebrew taps, kegs and casks';

    this.runner = runner;
  }

  restore(data, cb) {
    const cmd = data.binary || 'brew';

    async.each(data.taps, (item, callback) => {
      this.runner.run(`${cmd} tap ${item.name}`, callback);
    }, cb);
  }
};

module.exports = Brew;
