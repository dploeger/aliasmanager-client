import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import Vuex from 'vuex';
import { AccountStore } from '@/stores/AccountStore';

Vue.config.productionTip = false;

Vue.use(Vuex);

const store: AccountStore = new AccountStore({
  state: {
    token: null,
    username: null,
  },
});

new Vue({
  vuetify,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
