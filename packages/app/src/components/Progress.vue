<template>
  <div class="progress-list">
    <vs-alert active=true v-for="(item, index) in messages" :key="index" :icon="item.icon" :color="item.color">
      {{item.message}}
    </vs-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('Progress', [
      'messages',
    ]),
  },
};
</script>
