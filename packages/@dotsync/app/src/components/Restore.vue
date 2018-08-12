<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Settings, stores, restore, dummy } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
      'versionSettings',
    ]),
  },
  mounted() {
    const methods = stores(this.configdir);
    this.$createLogger('restore').info('Restoring');

    methods[this.storeSettings.method].beforeRestore(this.storeSettings.location, (err, datadir) => {
      if (err) {
        // TODO: Display error
        return console.log(err);
      }

      restore(datadir, (err) => {
        new Settings(this.configdir, 'version').write(this.versionSettings);

        this.$createLogger('version').info('Wrote version settings');
        this.$router.push({ name: 'Dashboard' });
      });
    });
  },
};
</script>
