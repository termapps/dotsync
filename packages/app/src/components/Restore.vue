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
      'working',
      'errored',
      'finished',
      'log',
    ]),
  },
  mounted() {
    const stores = loadStores(this.configdir);

    this.working('Trying to restore your dotfiles to latest version');

    // TODO: Allow logs and display them
    stores[this.storeSettings.method].beforeRestore(this.storeSettings.location, (err, datadir) => {
      if (err) {
        return this.errored({
          message: 'Unable to restore your dotfiles to latest version',
          details: { err },
        });
      }

      restore(this.configdir, datadir, this.log, (error) => {
        if (error) {
          // TODO: Give suggestions to user about fix the error
          return this.errored({
            message: 'Unable to restore your dotfiles to latest version',
            details: { err: error },
          });
        }

        this.finished('Restored your dotfiles to latest version');
        this.working('Saving info about the last restored version');

        try {
          settings.write(this.configdir, 'version', this.versionSettings);
        } catch (e) {
          return this.errored({
            message: 'Unable to save info about the last restored version',
            details: { err: e },
          });
        }

        this.finished('Saved info about the last restored version')
        this.$router.push({ name: 'Dashboard' });
      });
    });
  },
};
</script>
