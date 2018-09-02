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
      'pushMessage',
      'setVersionSettings',
    ]),
  },
  mounted() {
    const methods = stores(this.configdir);

    methods[this.storeSettings.method].latestVersion((err, version) => {
      if (err) {
        // TODO: Display error
        return console.log(err);
      }

      this.$createLogger('version').info(`Latest version ${version}`);

      if (version !== this.versionSettings.version) {
        this.setVersionSettings({ version });
        this.$router.push({ name: 'Restore' });
      } else {
        this.pushMessage({
          message: 'Already synced to the latest version of your dotfiles',
          icon: 'sync',
          color: 'success',
        });
        this.$router.push({ name: 'Dashboard' });
      }
    });
  },
};
</script>
