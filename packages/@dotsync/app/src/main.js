import Vue from 'vue';
import Vuesax from 'vuesax';
import VueLogdown from 'vue-logdown';

import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';

import App from './App.vue';
import store from './store';
import router from './router';

Vue.use(Vuesax);
Vue.use(VueLogdown);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
