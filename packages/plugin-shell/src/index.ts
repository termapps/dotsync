import * as utils from '@dotsync/utils';

export default class Shell extends utils.Plugin {
  constructor(opts: utils.PluginOptions) {
    super('shell', 'Configure your shell', opts);
  }

  restore(answers: utils.PluginPromptAnswers, cb: utils.Callback) {
    // TODO: make sure binary is in /etc/shells
    // this.runner.run(`chsh -s ${this.data.binary}`, cb);
    cb();
  }

  expand(): utils.ConfigPlugin[] {
    if (this.data.type !== 'fish') {
      return;
    }

    return [
      {
        name: '@dotsync/plugin-brew',
        data: {
          _modules: {
            kegs: [
              {
                name: 'fish',
              },
            ],
          },
        },
      },
    ];
  }
};
