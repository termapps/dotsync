<template>
  <div id="app">
    <router-view></router-view>
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
  margin: 60px 50px 0;
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
