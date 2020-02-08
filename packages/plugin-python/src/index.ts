import * as utils from '@dotsync/utils';

type Package = {
  name: string,
};

export default class Python extends utils.Plugin {
  packages: utils.Module<Package>

  constructor(opts: utils.PluginOptions) {
    super('python', 'Python packages and configuration', opts);

    const cmd = this.cmd();

    // TODO: pipdeptree, pip-autoremove
    this.packages = new utils.Module<Package>({
      key: 'packages',
      listCmd: `${cmd} freeze`,
      installCmd: (item) => `${cmd} install ${item}`,
      uninstallCmd: (item) => `${cmd} -V`,
      compare: (f) => (e) => e.name == f.name,
      modify: utils.lineSplit<Package>(line => ({ name: line.split('==')[0] })),
      runner: this.runner,
    });
  }

  cmd() {
    return this.data.binary || 'pip3';
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
    return [
      {
        name: '@dotsync/plugin-brew',
        data: {
          kegs: [
            {
              name: 'python',
              pin: true,
            },
          ],
        },
      },
    ];
  }
};
