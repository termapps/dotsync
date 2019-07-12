const async = require('async');

class Brew {
  constructor({ runner }) {
    this.name = 'atom';
    this.description = 'Atom packages and configuration';

    this.runner = runner;
  }

  // apm list --installed --bare

  restore(data, cb) {
    const cmd = data.binary || 'apm';

    async.each(data.packages, (item, callback) => {
      this.runner.run(`${cmd} install ${item}`, callback);
    }, cb);
  }
};

module.exports = Brew;
