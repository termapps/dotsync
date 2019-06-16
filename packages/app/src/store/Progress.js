export default {
  namespaced: true,
  state: {
    messages: [],
    done: [],
    current: null,
    error: null,
    errorDetails: {},
  },
  getters: {},
  mutations: {
    danger(state, value) {
      state.messages.push({
        message: value,
        icon: 'error',
        color: 'danger',
      });
    },
    clearMessages(state) {
      state.messages = [];
    },
    clear(state) {
      state.done = [];
      state.current = null;
      state.error = null;
      state.errorDetails = {};
    },
    working(state, value) {
      state.current = value;
      state.error = null;
      state.errorDetails = {};
    },
    finished(state, value) {
      state.current = null;
      state.error = null;
      state.errorDetails = {};
      state.done.push(value);
    },
    errored(state, { message, details }) {
      state.current = null;
      state.error = message;
      state.errorDetails = details;
    },
  },
  actions: {},
};
