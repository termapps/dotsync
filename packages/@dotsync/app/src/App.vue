<template>
  <div id="app">
    <div class="top-bar">
      <vs-row>
        <vs-col vs-w="2" vs-offset="4" vs-type="flex" vs-justify="center" vs-align="center">
          <router-link :to="{ name: 'Home' }">Dashboard</router-link>
        </vs-col>
        <vs-col vs-w="2" vs-type="flex" vs-justify="center" vs-align="center">
          <router-link :to="{ name: 'Plugins' }">Plugins</router-link>
        </vs-col>
      </vs-row>
    </div>
    <div class="content-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

.vs-select-options ul .vs-select-item-btn {
  display: inline;
}

.vs-inputx {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.vs-con-input {
  height: 29px;
}
</style>
