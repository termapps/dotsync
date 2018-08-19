class Brew {
  constructor(datadir) {
    this.name = 'brew';
    this.description = 'Homebrew ...';

    this.datadir = datadir;
  }

  restore(data, cb) {
    cb();
  }
};

module.exports = Brew;
