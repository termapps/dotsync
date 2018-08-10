<template>
  <div class="main-box">
    <h1>Data Store Settings</h1>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Method</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-select v-model="method">
          <vs-select-item v-for="item in options()" :key="item.value" :vs-value="item.value" :vs-text="item.text" />
        </vs-select>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Location</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-input v-model="location" :vs-danger="locationBad" :vs-danger-text="locationText" :vs-description-text="locationDescription" />
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
import { Settings, stores } from '@dotsync/core';

// TODO: Find better way for this
let methods;

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
    locationDescription() {
      return !this.locationBad ? methods[this.storeSettings.method].location : '';
    },
    locationBad() {
      return this.locationText !== '';
    },
  },
  methods: {
    options() {
      return Object.keys(methods).map(key => {
        return { text: methods[key].name, value: key };
      });
    },
    dataIsGood() {
      if (this.storeSettings.method === void 0 || this.storeSettings.location === void 0 || this.storeSettings.location === '') {
        return false;
      }

      return true;
    },
    locationIsGood() {
      return methods[this.storeSettings.method].valid(this.storeSettings.location);
    },
    validate() {
      if (this.storeSettings.location.length <= 0) {
        return 'This is required';
      }

      return this.locationIsGood();
    },
    confirm() {
      // TODO: Loading for the button which was pressed
      // TODO: Maybe show what exactly we are doing instead of the form
      this.locationText = this.validate();

      if (!this.locationBad) {
        console.log('instantiating store');
        this.locationText = methods[this.storeSettings.method].init(this.storeSettings.location);

        if (!this.locationBad) {
          console.log('storing the given settings');
          new Settings(this.configdir, 'store').write(this.storeSettings);
          this.$router.push({ name: 'VersionSettings' });
        }
      }
    },
    ...mapMutations('Global', [
      'setStoreSettings',
    ]),
  },
  created() {
    methods = stores(this.configdir);

    if (this.dataIsGood() && this.locationIsGood() === '') {
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
      locationText: '',
    };
  },
};
</script>
