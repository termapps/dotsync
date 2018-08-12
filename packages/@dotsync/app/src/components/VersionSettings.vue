<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { stores } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
      'versionSettings',
    ]),
  },
  methods: {
    ...mapMutations('Global', [
      'setVersionSettings',
    ]),
  },
  mounted() {
    const methods = stores(this.configdir);

    methods[this.storeSettings.method].latestVersion((err, version) => {
      // TODO: Display error

      if (version !== this.versionSettings.version) {
        this.setVersionSettings({ version });
        this.$router.push({ name: 'Restore' });
      } else {
        this.$router.push({ name: 'Dashboard' });
      }
    });
  },
};
</script>
