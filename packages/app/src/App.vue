<template>
  <div id="app">
    <div class="top-bar">
      <vs-row>
        <vs-col vs-w="2" vs-offset="3" vs-type="flex" vs-justify="center" vs-align="center">
          <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <router-link :to="{ name: 'Config' }">Config</router-link>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <router-link :to="{ name: 'Plugins' }">Plugins</router-link>
        </vs-col>
      </vs-row>
    </div>
    <Progress></Progress>
    <div class="content-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Progress from './components/Progress.vue';

export default {
  components: {
    Progress,
  },
  methods: {
    ...mapMutations('Progress', [
      'clearMessages',
      'clear',
    ]),
  },
  beforeMount() {
    this.clearMessages();
    this.clear();
  },
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #5b5777;
  background: #fdfdfd;
}

.main-box {
  width: 500px;
  margin: auto;
  line-height: 29px;

  h1 {
    text-transform: capitalize;
    padding-bottom: 20px;
  }

  .vs-row {
    margin-top: 20px;
  }
}

.top-bar {
  .vs-row {
    height: 50px;
  }
}

.content-view {
  margin: 20px 50px 0;
}

.vs-inputx {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.vs-con-input {
  height: 30px;
}

pre {
  padding: 10px;
  color: #777398;
  background: #f5f7fb;
  overflow: scroll;
}

a {
  cursor: pointer;
  color: #5b3cc4;
}
</style>
