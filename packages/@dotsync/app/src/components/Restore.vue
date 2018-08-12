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
    restore(this.configdir, (err) => {
      new Settings(this.configdir, 'version').write(this.versionSettings);
      this.$router.push({ name: 'Dashboard' });
    });
  },
};
</script>
