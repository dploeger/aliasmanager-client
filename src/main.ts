import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import i18n from './i18n';
import { makeMockServer } from '@/mockserver';
import VueLogger from 'vue-logger-plugin';

const isProduction = process.env.NODE_ENV === 'production';

Vue.config.productionTip = false;

if (!isProduction) {
  makeMockServer();
}

Vue.use(Buefy);

Vue.use(VueLogger, {
  enabled: true,
  level: isProduction ? 'error' : 'debug',
});

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
