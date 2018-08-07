import Vue from 'vue';
import VueRouter from 'vue-router';
import Loading from '../components/Loading.vue';
import StoreSettings from '../components/StoreSettings.vue';
import VersionSettings from '../components/VersionSettings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Loading',
    component: Loading,
  },
  {
    path: '/store',
    name: 'StoreSettings',
    component: StoreSettings,
  },
  {
    path: '/version',
    name: 'VersionSettings',
    component: VersionSettings,
  },
];

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
