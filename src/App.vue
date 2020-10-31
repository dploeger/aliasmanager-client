<template>
  <b-container fluid="md">
    <b-row>
      <b-col>
        <b-navbar type="dark" variant="dark">
          <b-navbar-brand>
            {{ $t('app.title') }}
          </b-navbar-brand>
          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="logout">
              {{ $t('ui.logout') }}
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <AliasManager />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasManager from '@/components/AliasManager.vue';
import Axios from 'axios';
import { getEmitter } from '@/emitter';

@Component({
  name: 'App',
  components: { AliasManager },
})
export default class App extends Vue {
  public async logout() {
    await Axios.get('/api/logout');
    getEmitter().emit('refresh');
  }
}
</script>

<style lang="scss">
// Import custom SASS variable overrides, or alternatively
// define your variable overrides here instead
@import 'styles/custom.scss';

// Import Bootstrap and BootstrapVue source SCSS files
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
</style>
