import * as os from 'os';
import * as path from 'path';
import * as utils from '@dotsync/utils';

type Package = string;

export default class VSCode extends utils.Plugin {
  packages: utils.Module<Package>

  constructor(opts: utils.PluginOptions) {
    super('vscode', 'Visual Studio Code packages and configuration', opts);

    const cmd = this.cmd();

    this.packages = new utils.Module<Package>({
      key: 'packages',
      listCmd: `${cmd} --list-extensions --show-versions`,
      installCmd: (item) => `${cmd} --install-extension ${item}`,
      uninstallCmd: (item) => `${cmd} --uninstall-extension ${item}`,
      compare: (f) => (e) => e == f,
      modify: utils.lineSplit<Package>(line => line.split('@')[0]),
      runner: this.runner,
    });
  }

  cmd() {
    return this.data.binary || 'code';
  }

  restore(answers: utils.PluginPromptAnswers, cb: utils.Callback) {
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
    const vscodedir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User')

    return [
      {
        name: '@dotsync/plugin-link',
        data: {
          paths: [
            {
              source: this.data.settings,
              destination: path.join(vscodedir, 'settings.json'),
            },
            {
              source: this.data.keybindings,
              destination: path.join(vscodedir, 'keybindings.json'),
            },
          ],
        },
      },
      {
        name: '@dotsync/plugin-brew',
        data: {
          _modules: {
            casks: [
              "visual-studio-code",
            ],
          },
        },
      },
    ];
  }
};
