<template>
  <vs-popup :title="pluginName + ' Prompts'" :active.sync="askPrompts">
    <vs-row v-for="item in schema" :key="item.name">
      <vs-col vs-w="5" vs-type="flex" vs-justify="flex-end" vs-align="center">{{item.label}}</vs-col>
      <vs-col vs-w="6" vs-offset="1">
        <vs-input v-if="item.type === 'input'" v-model="model[item.name]" :type="item.inputType"></vs-input>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-button @click="answered" color="primary" type="filled">Submit</vs-button>
      </vs-col>
    </vs-row>
  </vs-popup>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { settings, restore, loadPlugins } from '../utils';

export default {
  data() {
    return {
      askPrompts: false,
      pluginName: '',
      schema: [],
      model: {},
    };
  },
  computed: {
    ...mapState('Global', [
      'configdir',
      'datadir',
      'store',
      'storeSettings',
      'versionSettings',
    ]),
  },
  methods: {
    ...mapMutations('Progress', [
      'working',
      'errored',
      'finished',
      'log',
    ]),
    prompt(name, schema, cb) {
      if (schema.length === 0) {
        return cb(null, {});
      }

      this.schema = schema;
      this.pluginName = name;
      this.askPrompts = true;

      this.$on('answered', (answers) => {
        this.askPrompts = false;

        return cb(null, answers);
      });
    },
    answered() {
      this.$emit('answered', { ...this.model });
    },
  },
  mounted() {
    this.working('Trying to restore your dotfiles to latest version');

    // TODO: Allow logs and display them
    this.store.beforeRestore(this.storeSettings, (err) => {
      if (err) {
        return this.errored({
          message: 'Unable to restore your dotfiles to latest version',
          details: { err },
        });
      }

      loadPlugins(this.configdir, this.datadir, true, this.log, (error1, plugins) => {
        if (error1) {
          return this.errored({
            message: 'Unable to make sure the needed plugins are installed',
            details: { error1 },
          });
        }

        restore(plugins, this.prompt, (error2) => {
          if (error2) {
            // TODO: Give suggestions to user about fixing the error
            return this.errored({
              message: 'Unable to restore your dotfiles to latest version',
              details: { err: error2 },
            });
          }

          this.finished('Restored your dotfiles to latest version');
          this.working('Saving info about the last restored version');

          try {
            settings.write(this.configdir, 'version', this.versionSettings);
          } catch (error) {
            return this.errored({
              message: 'Unable to save info about the last restored version',
              details: { err: error },
            });
          }

          this.finished('Saved info about the last restored version');
          this.$router.push({ name: 'Dashboard' });
        });
      });
    });
  },
};
</script>
