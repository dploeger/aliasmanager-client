import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import i18n from './i18n';
import { makeMockServer } from '@/mockserver';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  makeMockServer();
}

Vue.use(Buefy);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
