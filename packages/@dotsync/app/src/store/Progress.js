export default {
  namespaced: true,
  state: {
    messages: [],
  },
  getters: {},
  mutations: {
    pushMessage(state, value) {
      state.messages.push(value);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  actions: {},
};
