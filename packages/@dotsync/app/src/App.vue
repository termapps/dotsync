<template>
  <div id="app">
    <div class="box">
      <h1>Data Store Settings</h1>
      <vs-select v-model="storage">
        <vs-select-item v-for="item in storageOptions" :key="item.value" :vs-value="item.value" :vs-text="item.text" />
      </vs-select>
      <vs-input vs-label-placeholder="Location" v-model="location"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      location: '',
      storage: 'git',
      storageOptions: [
        {
          text: 'Git',
          value: 'git',
        },
        {
          text: 'Folder',
          value: 'folder',
        },
      ],
    };
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

  div {
    margin: auto;
  }
}
</style>
