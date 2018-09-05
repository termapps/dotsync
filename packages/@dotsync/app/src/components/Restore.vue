<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Settings, stores, restore } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
      'versionSettings',
    ]),
  },
  methods: {
    ...mapMutations('Progress', [
      'pushMessage',
    ]),
  },
  mounted() {
    const methods = stores(this.configdir);
    this.$createLogger('restore').info('Restoring');

    methods[this.storeSettings.method].beforeRestore(this.storeSettings.location, (err, datadir) => {
      if (err) {
        return this.pushMessage({
          message: err.message,
          icon: 'error',
          color: 'danger',
        });
      }

      restore(datadir, (error) => {
        if (error) {
          return this.pushMessage({
            message: error.message,
            icon: 'error',
            color: 'danger',
          });
        }

        try {
          new Settings(this.configdir, 'version').write(this.versionSettings);
        } catch (e) {
          return this.pushMessage({
            message: `Unable to write version settings: ${e.message}`,
            icon: 'error',
            color: 'danger',
          });
        }

        this.$createLogger('version').info('Wrote version settings');
        this.$router.push({ name: 'Dashboard' });
      });
    });
  },
};
</script>
