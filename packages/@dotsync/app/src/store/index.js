import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Global from './Global';

Vue.use(Vuex);

/* eslint-disable no-new */
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    Global,
  },
});

export default store;
