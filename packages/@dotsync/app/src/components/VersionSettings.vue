<template>
  <div class="main-box">
    <h1>Version Settings</h1>
    <vs-row>
      <vs-col vs-w="12">
        <vs-button id="confirm-version-settings" @click="confirm">Confirm Version</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Settings, stores } from '@dotsync/core';

let methods;

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'versionSettings',
    ]),
  },
  methods: {
    confirm() {

    },
    ...mapMutations('Global', [
      'setVersionSettings',
    ]),
  },
  created() {
    methods = stores(this.configdir);
  },
  data() {
    return {
    };
  },
};
</script>
