<template>
  <Loading></Loading>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { remote } from 'electron';
import { configdir, Settings } from '@dotsync/core';

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
      'pushMessage',
      'clearMessages',
      'setConfigdir',
      'setStoreSettings',
      'setVersionSettings',
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
        this.setStoreSettings(new Settings(this.configdir, 'store').read());
        this.setVersionSettings(new Settings(this.configdir, 'version').read());
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
