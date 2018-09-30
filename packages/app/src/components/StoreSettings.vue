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
import { settings, stores, isStore } from '@dotsync/core';
import { list } from 'electron-plugin-manager';

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
      return Object.keys(methods).map(key => ({ text: methods[key].name, value: key }));
    },
    dataIsGood() {
      if (this.storeSettings.method === undefined || this.storeSettings.location === undefined || this.storeSettings.location === '') {
        return false;
      }

      return true;
    },
    validate() {
      if (this.storeSettings.location === '') {
        return 'This is required';
      }

      return methods[this.storeSettings.method].valid(this.storeSettings.location);
    },
    confirm() {
      // TODO: Loading for the button which was pressed
      this.locationText = this.validate();

      if (!this.locationBad) {
        const log = this.$createLogger('store');
        log.info('Getting ready to write storage settings');

        methods[this.storeSettings.method].init(this.storeSettings.location, (err, text = '', patch = {}) => {
          this.locationText = text;
          this.storeSettings = Object.assign(patch, this.storeSettings);

          if (err) {
            return this.pushMessage({
              message: err.message,
              icon: 'error',
              color: 'danger',
            });
          }

          if (!this.locationBad) {
            try {
              settings.write(this.configdir, 'store', this.storeSettings);
            } catch (error) {
              if (error) {
                return this.pushMessage({
                  message: `Unable to write storage settings: ${error.message}`,
                  icon: 'error',
                  color: 'danger',
                });
              }

              log.info('Wrote storage settings');
              this.$router.push({ name: 'VersionSettings' });
            }
          }
        });
      }
    },
    ...mapMutations('Global', [
      'setStoreSettings',
    ]),
    ...mapMutations('Progres', [
      'pushMessage',
    ]),
  },
  created() {
    const a = list(this.configdir).filter(isStore);
    console.log(a);
    methods = stores(this.configdir);

    if (this.dataIsGood()) {
      this.locationText = this.validate();

      if (!this.locationBad) {
        return this.$router.push({ name: 'VersionSettings' });
      }

      this.pushMessage({
        message: 'The saved storage settings are not valid anymore',
        icon: 'error',
        color: 'danger',
      });
    }

    this.setStoreSettings({
      method: '@dotsync/storage-git',
      location: '',
      ...this.storeSettings,
    });
  },
  data() {
    return {
      locationText: '',
    };
  },
};
</script>
