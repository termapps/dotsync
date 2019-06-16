<template>
  <div>
    <vs-button @click="confirm">Restore</vs-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations('Progress', [
      'clear',
    ]),
    confirm() {
      this.clear();
      this.$router.push({ name: 'Restore' });
    },
  },
};
</script>
