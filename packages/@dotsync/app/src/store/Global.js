export default {
  namespaced: true,
  state: {
    messages: [],
    configdir: '',
    storeSettings: {},
    versionSettings: {},
  },
  getters: {},
  mutations: {
    pushMessage(state, value) {
      state.messages.push(value);
    },
    clearMessages(state) {
      state.messages = [];
    },
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
