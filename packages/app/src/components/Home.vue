<template>
  <div></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import { mapState, mapMutations } from 'vuex';
import { list } from 'electron-plugin-manager';
import async from 'async';
import { configdir, settings } from '../utils';

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
      'working',
      'errored',
      'finished',
    ]),
  },
  mounted() {
    this.working('Making sure Dotsync configuration directory exists');

    configdir(remote.app.getPath('appData'), (err, dir) => {
      if (err) {
        return this.errored({
          message: 'Unable to create Dotsync configuration directory',
          details: { dir, err },
        });
      }

      this.finished('Dotsync configuration directory exists');
      this.setConfigdir(dir);

      const installed = list(this.configdir);
      const recommended = ['@dotsync/storage-git', '@dotsync/storage-folder'];
      const notInstalled = recommended.filter(x => installed.indexOf(x) === -1);

      this.working('Making sure storage plugins are installed');

      async.eachSeries(notInstalled, (item, callback) => {
        ipcRenderer.on(`epm-installed-${item}`, (event, error, pluginPath) => {
          callback(error, pluginPath);
        });

        ipcRenderer.send('epm-install', this.configdir, item, 'latest');
      }, (e) => {
        if (e) {
          return this.errored({
            message: 'Unable to install storage plugin',
            details: { err: e },
          });
        }

        this.finished('Storage plugins are installed');
        this.working('Trying to read storage settings and last restored version');

        try {
          this.setStoreSettings(settings.read(this.configdir, 'store'));
          this.setVersionSettings(settings.read(this.configdir, 'version'));
        } catch (error) {
          if (error) {
            return this.errored({
              message: 'Unable to read storage settings and last restored version',
              details: { err: error },
            });
          }
        }

        this.finished('Read storage settings and last restored version');
        this.$router.push({ name: 'StoreSettings' });
      });
    });
  },
};
</script>
