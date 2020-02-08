import * as os from 'os';
import * as path from 'path';
import * as utils from '@dotsync/utils';

type Package = string;

export default class Atom extends utils.Plugin {
  packages: utils.Module<Package>

  constructor(opts: utils.PluginOptions) {
    super('atom', 'Atom packages and configuration', opts);

    const cmd = this.cmd();

    this.packages = new utils.Module<Package>({
      key: 'packages',
      listCmd: `${cmd} list --installed --bare`,
      installCmd: (item) => `${cmd} install ${item}`,
      uninstallCmd: (item) => `${cmd} uninstall ${item}`,
      compare: (f) => (e) => e == f,
      modify: utils.lineSplit<Package>(line => line.split('@')[0]),
      runner: this.runner,
    });
  }

  cmd() {
    return this.data.binary || 'apm';
  }

  restore(cb: (err?: Error | null) => void) {
    this.packages.restore(this.data, cb);
  }

  list(cb: (err?: Error, list?: { packages: Package[] }) => void) {
    this.packages.list((err, packages) => {
      if (err) {
        return cb(err);
      }

      cb(null, { packages });
    });
  }

  expand(): utils.ConfigPlugin[] {
    const atomdir = path.join(os.homedir(), '.atom');

    return [
      {
        name: '@dotsync/plugin-link',
        data: {
          paths: [
            {
              source: this.data.keymap,
              destination: path.join(atomdir, 'keymap.cson'),
            },
            {
              source: this.data.snippets,
              destination: path.join(atomdir, 'snippets.cson'),
            },
            {
              source: this.data.styles,
              destination: path.join(atomdir, 'styles.less'),
            },
            {
              source: this.data.init,
              destination: path.join(atomdir, 'init.coffee'),
            },
            {
              source: this.data.config,
              destination: path.join(atomdir, 'config.cson'),
            },
          ],
        },
      },
      {
        name: '@dotsync/plugin-brew',
        data: {
          casks: [
            'atom',
          ],
        },
      },
    ];
  }
};
