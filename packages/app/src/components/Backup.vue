<template>
  <div class="plugin-sections" v-masonry transition-duration="0.3s">
    <template v-for="plugin in plugins">
      <div v-masonry-tile class="plugin-module-section" v-for="entry in Object.entries(plugin.details)" :key="plugin.name + '-' + entry[0]">
        <h2>{{plugin.name}} - {{entry[0]}}</h2>
        <h4>Installed</h4>
        <ul class="have">
          <li v-for="item in stringifyArr(entry[1].have)" :key="item">
            <vs-checkbox v-model="entry[1].added" :vs-value="item">{{item}}</vs-checkbox>
          </li>
        </ul>
      </div>
    </template>
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
      'clear',
      'log',
    ]),
    stringifyArr(items) {
      return items.map(this.stringify);
    },
    stringify(item) {
      if (typeof item === 'string') {
        return item;
      }

      return item.name;
    },
    section(item, data, plugin) {
      const details = {};

      Object.keys(data).forEach((key) => {
        const have = data[key];
        const needed = item.data[key];

        const uninstalled = needed.filter(x => !have.some(plugin.compare[key](x)));

        details[key] = {
          have,
          needed,
          uninstalled,
          added: this.stringifyArr(needed),
          deleted: [],
        };
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
                  details: { err: error2, data: item.data },
                });
              }

              this.section(item, installed, plugins[item.name]);
              return callback();
            });
          } else {
            return callback();
          }
        }, this.clear());
      });
    });
  },
};
</script>

<style lang="less" scoped>
.plugin-module-section {
  width: 335px;
  margin: 20px 0;

  h2 {
    margin-bottom: 10px;
  }

  h4 {
    margin-bottom: 10px;
  }

  li {
    list-style: none;
    margin-top: 5px;

    .con-vs-checkbox {
      justify-content: flex-start;
    }
  }
}
</style>
