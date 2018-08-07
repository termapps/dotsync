<template>
  <div class="main-box">
    <h1>Data Store Settings</h1>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Method</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-select v-model="method">
          <vs-select-item v-for="item in options" :key="item.value" :vs-value="item.value" :vs-text="item.text" />
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
        <vs-button id="confirm-store-settings" @click="confirm">Confirm Settings</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Settings } from '@dotsync/core';

export default {
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
    ]),
    method: {
      get() {
        return this.storeSettings.method || 'git';
      },
      set(value) {
        this.setStoreSettings({
          ...this.storeSettings,
          method: value,
        });
      },
    },
    location: {
      get() {
        return this.storeSettings.location || '';
      },
      set(value) {
        this.setStoreSettings({
          ...this.storeSettings,
          location: value,
        });
      },
    },
  },
  methods: {
    dataIsGood() {
      if (this.storeSettings.method === void 0 || this.storeSettings.location === void 0 || this.storeSettings.location === '') {
        return false;
      }

      return true;
    },
    confirm() {
      // new Settings(this.configdir, 'store').write(storeData);
    },
    ...mapMutations('Global', [
      'setStoreSettings',
    ]),
  },
  created() {
    if (this.dataIsGood()) {
      this.$router.push({ name: 'VersionSettings' });
    } else {
      this.setStoreSettings({
        method: 'git',
        location: '',
        ...this.storeSettings,
      });
    }
  },
  data() {
    return {
      options: [
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
