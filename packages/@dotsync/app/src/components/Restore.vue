<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Settings, restore } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'versionSettings',
    ]),
  },
  mounted() {
    this.$createLogger('restore').info('Restoring');

    restore(this.configdir, (err) => {
      this.$createLogger('version').info('Writing version settings');
      new Settings(this.configdir, 'version').write(this.versionSettings);
      this.$router.push({ name: 'Dashboard' });
    });
  },
};
</script>
