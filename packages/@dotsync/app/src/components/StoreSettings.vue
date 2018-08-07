<template>
  <div class="box">
    <h1>Data Store Settings</h1>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Method</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-select v-model="storage">
          <vs-select-item v-for="item in storageOptions" :key="item.value" :vs-value="item.value" :vs-text="item.text" />
        </vs-select>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Location</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-input v-model="location" />
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-button id="confirm-store-settings">Confirm Settings</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      location: '',
      storage: 'git',
      storageOptions: [
        {
          text: 'Git',
          value: 'git',
        },
        {
          text: 'Folder',
          value: 'folder',
        },
      ],
    };
  },
};
</script>
