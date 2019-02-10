<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { settings, loadStores, restore } from '../utils';

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
    const stores = loadStores(this.configdir);
    this.$createLogger('restore').info('Restoring');

    stores[this.storeSettings.method].beforeRestore(this.storeSettings.location, (err, datadir) => {
      if (err) {
        return this.pushMessage({
          message: err.message,
          icon: 'error',
          color: 'danger',
        });
      }

      restore(this.configdir, datadir, (error) => {
        if (error) {
          // TODO: Suggestions to fix it
          return this.pushMessage({
            message: error.message,
            icon: 'error',
            color: 'danger',
          });
        }

        try {
          settings.write(this.configdir, 'version', this.versionSettings);
        } catch (error2) {
          return this.pushMessage({
            message: `Unable to write version settings: ${error2.message}`,
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
