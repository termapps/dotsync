<template>
  <div>
    <vs-button @click="restore">Restore</vs-button>
    <vs-button @click="backup">Backup</vs-button>
  </div>
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
