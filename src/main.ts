import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import i18n from './i18n';
import { makeMockServer } from '@/mockserver';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  makeMockServer();
}

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
