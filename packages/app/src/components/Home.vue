<template>
  <div></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import { mapState, mapMutations } from 'vuex';
import { configdir, settings } from '@dotsync/core';
import { list } from 'electron-plugin-manager';
import async from 'async';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
    ]),
  },
  methods: {
    ...mapMutations('Global', [
      'setConfigdir',
      'setStoreSettings',
      'setVersionSettings',
    ]),
    ...mapMutations('Progress', [
      'pushMessage',
      'clearMessages',
    ]),
  },
  mounted() {
    this.clearMessages();

    configdir(remote.app.getPath('appData'), (err, dir) => {
      if (err) {
        return this.pushMessage({
          message: `Unable to create config directory ${dir}: ${err.message}`,
          icon: 'error',
          color: 'danger',
        });
      }

      this.setConfigdir(dir);

      const installed = list(this.configdir);
      const recommended = ['@dotsync/storage-git', '@dotsync/storage-folder'];

      async.eachSeries(recommended, (item, callback) => {
        if (installed.includes(item)) {
          return callback();
        }

        ipcRenderer.on(`epm-installed-${item}`, (event, err, pluginPath) => {
          callback(err, pluginPath);
        });

        ipcRenderer.send('epm-install', this.configdir, item, 'latest');
      }, (err) => {
        if (err) {
          return this.pushMessage({
            message: `Unable to install plugins: ${err.message}`,
            icon: 'error',
            color: 'danger',
          });
        }

        try {
          this.setStoreSettings(settings.read(this.configdir, 'store'));
          this.setVersionSettings(settings.read(this.configdir, 'version'));
        } catch (error) {
          if (error) {
            return this.pushMessage({
              message: `Unable to read settings: ${error.message}`,
              icon: 'error',
              color: 'danger',
            });
          }
        }

        this.$router.push({ name: 'StoreSettings' });
      });
    });
  },
};
</script>
