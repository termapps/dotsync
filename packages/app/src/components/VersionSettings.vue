<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { loadStores } from '../utils';

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
    ...mapMutations('Progress', [
      'working',
      'errored',
      'finished',
    ]),
  },
  mounted() {
    const methods = loadStores(this.configdir);

    this.working('Trying to read the latest version of your dotfiles');

    methods[this.storeSettings.method].latestVersion((err, version) => {
      if (err) {
        return this.errored({
          message: 'Unable to read the latest version of your dotfiles',
          details: { err },
        });
      }

      this.finished('Read the latest version of your dotfiles');
      this.$createLogger('version').info(`Latest version is ${version}`);

      if (version !== this.versionSettings.version) {
        this.setVersionSettings({ version });
        this.$router.push({ name: 'Restore' });
      } else {
        this.finished('Already synced to the latest version of your dotfiles');
        this.$router.push({ name: 'Dashboard' });
      }
    });
  },
};
</script>
