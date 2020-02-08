export default {
  namespaced: true,
  state: {
    configdir: '',
    datadir: '',
    storeSettings: {},
    versionSettings: {},
    store: null,
  },
  getters: {},
  mutations: {
    setConfigdir(state, value) {
      state.configdir = value;
    },
    setDatadir(state, value) {
      state.datadir = value;
    },
    setStoreSettings(state, value) {
      state.storeSettings = value;
    },
    setVersionSettings(state, value) {
      state.versionSettings = value;
    },
    setStore(state, value) {
      state.store = value;
    },
  },
  actions: {},
};
