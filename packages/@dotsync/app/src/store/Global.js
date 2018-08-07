export default {
  namespaced: true,
  state: {
    configdir: '',
  },
  getters: {},
  mutations: {
    setConfigdir(state, value) {
      state.configdir = value;
    },
  },
  actions: {},
};
