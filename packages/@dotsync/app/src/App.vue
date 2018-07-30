<template>
  <div id="app">
    <div class="box">
      <h1>Choose a storage method</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
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

.box {
  width: 500px;
  margin: auto;

  h1 {
    text-transform: capitalize;
    margin-bottom: 20px;
  }
}
</style>
