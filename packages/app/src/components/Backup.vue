<template>
  <div>
    <div class="plugin-section" v-for="plugin in plugins" :key="plugin.name">
      <h3>{{plugin.name}}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import async from 'async';
import {
  settings, loadConfig, loadPlugins, loadStores, Runner,
} from '../utils';

export default {
  data() {
    return {
      plugins: [],
    };
  },
  computed: {
    ...mapState('Global', [
      'configdir',
      'storeSettings',
    ]),
  },
  methods: {
    ...mapMutations('Progress', [
      'working',
      'errored',
      'finished',
      'log',
    ]),
    section(item, data) {
      const details = {};

      Object.keys(data).forEach((key) => {
        const installed = data[key];
        const needed = item.data[key];

        details[key] = { installed, needed };
      });

      this.plugins.push({
        name: item.name.slice(16),
        details,
      });
    },
  },
  mounted() {
    const stores = loadStores(this.configdir);
    const store = stores[this.storeSettings.method];
    const datadir = store.datadir(this.storeSettings);

    this.working('Reading the current state of your dotfiles');

    loadConfig(datadir, (err, config) => {
      if (err) {
        return this.errored({
          message: 'Unable to load your dotfiles configuration file',
          details: { err },
        });
      }

      const needed = config.presets.default.plugins;

      loadPlugins(this.configdir, needed, this.log, (error, plugins) => {
        if (error) {
          return this.errored({
            message: 'Unable to make sure the needed plugins are installed',
            details: { error },
          });
        }

        async.eachSeries(needed, (item, callback) => {
          const plugin = new (plugins[item.name])({
            datadir,
            runner: new Runner(datadir, this.log),
          });

          if (plugin.list) {
            plugin.list(item.data, (error2, installed) => {
              if (error2) {
                return this.errored({
                  message: `Unable to run ${item.name}.list() to read installed stuff`,
                  details: { err, data: item.data },
                });
              }

              this.section(item, installed);
              return callback();
            });
          }
        });
      });
    });
  },
};
</script>
