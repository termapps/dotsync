module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      outputDir: 'electron',
      nodeModulesPath: ['../../node_modules', 'node_modules'],
      builderOptions: {
        appId: 'com.pksunkara.dotsync',
        productName: 'Dotsync',
        copyright: 'Copyright © 2018 Pavan Kumar Sunkara',
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
