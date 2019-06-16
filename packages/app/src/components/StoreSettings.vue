<template>
  <div class="main-box">
    <h1>Data Store Settings</h1>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Method</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-select v-model="method">
          <vs-select-item v-for="item in options()" :key="item.value" :value="item.value" :text="item.text" />
        </vs-select>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end">Location</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-input v-model="location" :danger="locationBad" :danger-text="locationText" :description-text="locationDescription" val-icon-danger="clear" />
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
import { settings, loadStores } from '../utils';

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
      return !this.locationBad ? this.stores[this.storeSettings.method].location : '';
    },
    locationBad() {
      return this.locationText !== '';
    },
  },
  methods: {
    options() {
      return Object.keys(this.stores).map(key => ({ text: this.stores[key].name, value: key }));
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

      return this.stores[this.storeSettings.method].valid(this.storeSettings.location);
    },
    confirm() {
      this.$vs.loading();
      this.locationText = this.validate();
      this.$vs.loading.close();

      if (!this.locationBad) {
        this.$vs.loading();

        this.stores[this.storeSettings.method].init(this.storeSettings.location, (err, text = '', patch = {}) => {
          this.locationText = text;
          this.setStoreSettings({ ...patch, ...this.storeSettings });
          this.$vs.loading.close();

          if (err) {
            return this.danger(err.message);
          }

          if (!this.locationBad) {
            try {
              settings.write(this.configdir, 'store', this.storeSettings);
            } catch (error) {
              if (error) {
                return this.danger(`Unable to write storage settings: ${error.message}`);
              }
            }

            this.finished('Saved the storage settings');
            this.$router.push({ name: 'VersionSettings' });
          }
        });
      }
    },
    ...mapMutations('Global', [
      'setStoreSettings',
    ]),
    ...mapMutations('Progress', [
      'danger',
      'clear',
      'working',
      'errored',
      'finished',
    ]),
  },
  created() {
    this.stores = loadStores(this.configdir);

    this.clear();

    if (this.dataIsGood()) {
      this.locationText = this.validate();

      if (!this.locationBad) {
        return this.$router.push({ name: 'VersionSettings' });
      }

      this.danger('The saved storage settings are not valid anymore');
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
      stores: {},
    };
  },
};
</script>
