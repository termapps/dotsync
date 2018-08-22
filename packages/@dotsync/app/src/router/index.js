import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import StoreSettings from '../components/StoreSettings.vue';
import VersionSettings from '../components/VersionSettings.vue';
import Restore from '../components/Restore.vue';
import Dashboard from '../components/Dashboard.vue';
import Plugins from '../components/Plugins.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
  {
    path: '/restore',
    name: 'Restore',
    component: Restore,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: Plugins,
  },
];

// eslint-disable-next-line no-new
const router = new VueRouter({
  base: '/',
  routes,
});

export default router;
