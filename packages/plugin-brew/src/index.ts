import * as utils from '@dotsync/utils';

type Tap = {
  name: string
  remote?: string
};

type BrewTap = {
  name: string
  remote: string
  [key: string]: any
}

type Keg = {
  name: string
  pin?: boolean
};

type Cask = string;

export default class Brew extends utils.Plugin {
  taps: utils.Module<Tap>
  kegs: utils.Module<Keg>
  casks: utils.Module<Cask>

  constructor(opts: utils.PluginOptions) {
    super('brew', 'Homebrew taps, kegs and casks', opts);

    const cmd = this.cmd();

    this.taps = new utils.Module<Tap>({
      key: 'taps',
      listCmd: `${cmd} tap-info --installed --json`,
      installCmd: (item) => `${cmd} tap ${item.name} ${item.remote || ''}`,
      uninstallCmd: (item) => `${cmd} untap ${item.name}`,
      compare: (f) => (e) => e.name == f.name && (e.remote && f.remote ? e.remote == f.remote : true),
      modify: (out) => JSON.parse(out).map((e: BrewTap) => ({
        name: e.name,
        remote: e.remote,
      })),
      excluded: [
        {
          name: 'homebrew/core',
        },
      ],
      runner: this.runner,
    });

    this.kegs = new utils.Module<Keg>({
      key: 'kegs',
      listCmd: `${cmd} list -1`,
      installCmd: (item) => `${cmd} install ${item.name}`,
      uninstallCmd: (item) => `${cmd} uninstall ${item.name}`,
      compare: (f) => (e) => e.name == f.name,
      modify: utils.lineSplit<Tap>(line => ({ name: line })),
      runner: this.runner,
    });

    this.casks = new utils.Module<Cask>({
      key: 'casks',
      listCmd: `${cmd} cask list -1`,
      installCmd: (item) => `${cmd} cask install ${item}`,
      uninstallCmd: (item) => `${cmd} cask uninstall ${item}`,
      compare: (f) => (e) => e == f,
      modify: utils.lineSplit<Cask>(line => line),
      runner: this.runner,
    });
  }

  cmd() {
    return this.data.binary || 'brew';
  }

  restore(answers: utils.PluginPromptAnswers, cb: utils.Callback) {
    this.taps.restore(this.data, (err) => {
      if (err) {
        return cb(err);
      }

      this.kegs.restore(this.data, (err) => {
        if (err) {
          return cb(err);
        }

        this.casks.restore(this.data, cb);
      });
    });
  }

  list(cb: (err?: Error, list?: {
    taps: Tap[],
    kegs: Keg[],
    casks: Cask[],
  }) => void) {
    this.taps.list((err, taps) => {
      if (err) {
        return cb(err);
      }

      this.kegs.list((err, kegs) => {
        if (err) {
          return cb(err);
        }

        this.casks.list((err, casks) => {
          if (err) {
            return cb(err);
          }

          return cb(null, { taps, kegs, casks });
        });
      });
    });
  }
};
