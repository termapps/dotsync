import * as os from 'os';
import * as path from 'path';
import * as utils from '@dotsync/utils';

type Package = {
  name: string,
  version?: string,
};

type NodeDependency = {
  from: string,
  version: string,
  [key: string]: string,
};

export default class Node extends utils.Plugin {
  packages: utils.Module<Package>

  constructor(opts: utils.PluginOptions) {
    super('node', 'Node.js packages and configuration', opts);

    const cmd = this.cmd();

    this.packages = new utils.Module<Package>({
      key: 'packages',
      listCmd: `${cmd} list --global --depth=0 --json`,
      installCmd: (item) => `${cmd} install --global ${item}`,
      uninstallCmd: (item) => `${cmd} uninstall --global ${item}`,
      compare: (f) => (e) => e.name == f.name && (e.version && f.version ? e.version == f.version : true),
      modify: (out) => Object.values(JSON.parse(out).dependencies).map((e: NodeDependency) => ({
        name: e.from,
        version: e.version,
      })),
      runner: this.runner,
    });
  }

  cmd() {
    return `${this.data.binary || 'node'} ${this.data.npmBinary || 'npm'}`;
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
        name: '@dotsync/plugin-secret',
        data: {
          paths: [
            {
              source: this.data.npmrc,
              destination: path.join(os.homedir(), '.npmrc'),
            },
          ],
        },
      },
      {
        name: '@dotsync/plugin-brew',
        data: {
          kegs: [
            {
              name: 'node',
            },
          ],
        },
      },
    ];
  }
};
