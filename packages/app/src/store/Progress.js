export default {
  namespaced: true,
  state: {
    messages: [],
    done: [],
    current: null,
    logs: '',
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
      state.logs = '';
      state.error = null;
      state.errorDetails = {};
    },
    working(state, value) {
      state.current = value;
      state.logs = '';
      state.error = null;
      state.errorDetails = {};
    },
    log(state, value) {
      state.logs = `${state.logs}${value}`;
    },
    finished(state, value) {
      state.current = null;
      state.error = null;
      state.errorDetails = {};

      state.done.push({
        message: value,
        logs: state.logs,
      });
    },
    errored(state, { message, details }) {
      state.current = null;
      state.error = message;
      state.errorDetails = details.err.stack || JSON.stringify(details.err, null, 2);
    },
  },
  actions: {},
};
