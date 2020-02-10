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
        <vs-input v-model="location" :danger="!!locationDanger" :danger-text="locationDanger || ''" :description-text="locationDescription" val-icon-danger="clear" />
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
  data() {
    return {
      locationDanger: null,
      stores: {},
    };
  },
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
      return !this.locationDanger ? this.stores[this.storeSettings.method].location : '';
    },
  },
  methods: {
    ...mapMutations('Global', [
      'setStoreSettings',
      'setDatadir',
      'setStore',
    ]),
    ...mapMutations('Progress', [
      'danger',
      'clear',
      'working',
      'errored',
      'finished',
    ]),
    options() {
      return Object.keys(this.stores).map(key => ({ text: this.stores[key].name, value: key }));
    },
    goodSettings() {
      const { method, location } = this.storeSettings;

      if (method && this.stores[method] && location && location !== '') {
        return true;
      }

      return false;
    },
    defaultSettings() {
      return this.setStoreSettings({
        method: '@dotsync/storage-git',
        location: '',
        ...this.storeSettings,
      });
    },
    validate(cb) {
      if (this.storeSettings.location === '') {
        return cb(new Error('Invalid input'), 'This is required');
      }

      const store = this.stores[this.storeSettings.method];
      store.settings = this.storeSettings;

      return store.validate(cb);
    },
    save() {
      const store = this.stores[this.storeSettings.method];
      store.settings = this.storeSettings;

      this.setStore(store);
      this.setDatadir(store.datadir());
    },
    confirm() {
      this.$vs.loading();
      this.locationDanger = this.validate();

      this.validate((e, danger = null) => {
        this.$vs.loading.close();
        this.locationDanger = danger;

        if (e) {
          return;
        }

        this.$vs.loading();

        const store = this.stores[this.storeSettings.method];
        store.settings = this.storeSettings;

        store.init((err, text = null) => {
          this.locationDanger = text;
          this.$vs.loading.close();

          if (err) {
            return this.danger(err.message);
          }

          try {
            settings.write(this.configdir, 'store', this.storeSettings);
          } catch (error) {
            if (error) {
              return this.danger(`Unable to write storage settings: ${error.message}`);
            }
          }

          this.finished('Saved the storage settings');
          this.save();
          this.$router.push({ name: 'VersionSettings' });
        });
      });
    },
  },
  created() {
    this.stores = loadStores(this.configdir, this.storeSettings);

    if (!this.goodSettings()) {
      return this.defaultSettings();
    }

    this.validate((err, danger = null) => {
      this.locationDanger = danger;

      if (err) {
        this.danger('The saved storage settings are not valid anymore');
        return this.defaultSettings();
      }

      this.save();
      this.$router.push({ name: 'VersionSettings' });
    });
  },
};
</script>
