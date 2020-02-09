<template>
  <vs-row>
    <vs-col vs-w="2" vs-offset="4">
      <vs-button @click="restore">Restore</vs-button>
    </vs-col>
    <vs-col vs-w="2">
      <vs-button @click="backup">Backup</vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations('Progress', [
      'clear',
    ]),
    restore() {
      this.clear();
      this.$router.push({ name: 'Restore' });
    },
    backup() {
      this.clear();
      this.$router.push({ name: 'Backup' });
    },
  },
};
</script>
