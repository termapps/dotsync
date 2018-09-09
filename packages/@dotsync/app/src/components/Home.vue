<template>
  <Loading></Loading>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import { mapState, mapMutations } from 'vuex';
import { configdir, settings } from '@dotsync/core';

import Loading from './Loading.vue';

export default {
  components: {
    Loading,
  },
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
  },
};
</script>
