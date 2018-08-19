module.exports = {
  devServer: {
    port: 8000,
  },
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      outputDir: 'electron',
      builderOptions: {
        appId: 'com.pksunkara.dotsync',
        productName: 'Dotsync',
        copyright: 'Copyright © 2018 Pavan Kumar Sunkara',
        publish: 'github',
      },
    },
  },
};
