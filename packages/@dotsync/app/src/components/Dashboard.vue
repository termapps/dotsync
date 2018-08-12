<template>
  <div>
    <vs-button @click="confirm">Restore</vs-button>
  </div>
</template>

<script>
export default {
  methods: {
    confirm() {
      this.$router.push({ name: 'Restore' });
    },
  },
};
</script>
