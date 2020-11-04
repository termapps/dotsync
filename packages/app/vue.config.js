module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      outputDir: 'electron',
      nodeModulesPath: ['../../node_modules', 'node_modules'],
      customFileProtocol: 'dotsync://./',
      builderOptions: {
        appId: 'com.pksunkara.dotsync',
        productName: 'Dotsync',
        copyright: 'Copyright © 2018 Pavan Kumar Sunkara',
        snap: {
          publish: {
            provider: 'generic',
            url: 'http://dummy.com',
          },
        },
        publish: {
          provider: 'github',
          owner: 'osapps',
          repo: 'dotsync',
          releaseType: 'release',
        },
      },
    },
  },
};
