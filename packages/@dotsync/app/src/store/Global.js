export default {
  namespaced: true,
  state: {
    configdir: '',
    storeSettings: {},
    versionSettings: {},
  },
  getters: {},
  mutations: {
    setConfigdir(state, value) {
      state.configdir = value;
    },
    setStoreSettings(state, value) {
      state.storeSettings = value;
    },
    setVersionSettings(state, value) {
      state.versionSettings = value;
    },
  },
  actions: {},
};
