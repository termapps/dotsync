<template>
  <div></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'versionSettings',
      'store',
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
    this.working('Trying to read the latest version of your dotfiles');

    this.store.latestVersion((err, version) => {
      if (err) {
        return this.errored({
          message: 'Unable to read the latest version of your dotfiles',
          details: { err },
        });
      }

      this.finished('Read the latest version of your dotfiles');
      this.$createLogger('version').info(`Latest version is ${version}`);

      // const plugins = loadPlugins(this.configdir,)

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
