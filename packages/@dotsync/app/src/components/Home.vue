<template>
  <Loading></Loading>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { configdir, Settings } from '@dotsync/core';

import Loading from './Loading.vue';

// TODO: Catch the thrown errors from everywhere
export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState('Global', [
      'configdir',
    ]),
  },
  methods: {
    ...mapMutations('Global', [
      'setConfigdir',
      'setStoreSettings',
      'setVersionSettings',
    ]),
  },
  mounted() {
    this.setConfigdir(configdir('Dotsync'));

    this.setStoreSettings(new Settings(this.configdir, 'store').read());
    this.setVersionSettings(new Settings(this.configdir, 'version').read());

    this.$router.push({ name: 'StoreSettings' });
  },
};
</script>
