import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import { makeMockServer } from '@/mockserver';
import { store } from '@/stores/RootStore';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  makeMockServer();
}

new Vue({
  vuetify,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
