<template>
  <div class="alerts">
    <!-- TODO: Alerts that are in progress and then hide when new alert comes in -->
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
