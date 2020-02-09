<template>
  <div class="plugin-sections" v-masonry transition-duration="0.3s">
    <template v-for="plugin in plugins">
      <div v-masonry-tile class="plugin-module-section" v-for="entry in Object.entries(plugin.details)" :key="plugin.name + '-' + entry[0]">
        <h2>{{plugin.name}} - {{entry[0]}}</h2>
        <h4>Installed</h4>
        <h6>(select to add to configuration)</h6>
        <ul>
          <li v-for="item in stringifyArr(entry[1].have)" :key="item">
            <vs-checkbox v-model="entry[1].added" :vs-value="item">{{item}}</vs-checkbox>
          </li>
        </ul>
        <template v-if="entry[1].uninstalled.length !== 0">
          <h4>Uninstalled</h4>
          <h6>(select to remove from configuration)</h6>
          <ul>
            <li v-for="item in stringifyArr(entry[1].uninstalled)" :key="item">
              <vs-checkbox v-model="entry[1].deleted" :vs-value="item">{{item}}</vs-checkbox>
            </li>
          </ul>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import async from 'async';
import { settings, loadPlugins } from '../utils';

export default {
  data() {
    return {
      plugins: [],
    };
  },
  computed: {
    ...mapState('Global', [
      'configdir',
      'datadir',
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
    section(plugin, installed, name) {
      const details = {};

      Object.keys(installed).forEach((key) => {
        // eslint-disable-next-line no-underscore-dangle
        const needed = plugin.data._modules[key];
        const have = installed[key];

        const uninstalled = needed.filter(x => !have.some(plugin[key].compare(x)));

        details[key] = {
          have,
          needed,
          uninstalled,
          added: this.stringifyArr(needed),
          deleted: [],
        };
      });

      this.plugins.push({
        name: name.slice(16),
        details,
      });
    },
  },
  mounted() {
    this.working('Reading the current state of your dotfiles');

    loadPlugins(this.configdir, this.datadir, false, this.log, (error, plugins) => {
      if (error) {
        return this.errored({
          message: 'Unable to make sure the needed plugins are installed',
          details: { error },
        });
      }

      async.eachSeries(Object.keys(plugins), (key, callback) => {
        const plugin = plugins[key];

        if (plugin.list) {
          plugin.list((error2, installed) => {
            if (error2) {
              return this.errored({
                message: `Unable to run ${key}.list() to read installed stuff`,
                details: { err: error2 },
              });
            }

            this.section(plugin, installed, key);
            return callback();
          });
        } else {
          return callback();
        }
      }, this.clear);
    });
  },
};
</script>

<style lang="less" scoped>
.plugin-module-section {
  width: 335px;
  margin: 10px 0;

  h2 {
    margin-bottom: 10px;
  }

  h4 {
    margin-bottom: 10px;
  }

  ul {
    margin: 10px 0;
  }

  li {
    list-style: none;
    margin-top: 5px;
    font-size: 14px;

    .con-vs-checkbox {
      justify-content: flex-start;
    }

    .con-slot-label {
      margin-left: 5px;
    }
  }
}
</style>
