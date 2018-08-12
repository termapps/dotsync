<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex';
import { stores } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
      'versionSettings',
    ]),
  },
  created() {
    const methods = stores(this.configdir);
    // TODO: Make this async
    const upstreamVersion = methods[this.storeSettings.method].latestVersion();

    if (upstreamVersion !== this.versionSettings) {
      this.$router.push({ name: 'Restore' });
    } else {
      this.$router.push({ name: 'Dashboard' });
    }
  },
};
</script>
