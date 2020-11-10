<template>
  <div class="container">
    <div class="columns">
      <div class="column pr-0">
        <b-navbar type="is-primary">
          <template #brand>
            <b-navbar-item>
              <img
                src="./assets/logo.png"
                class="d-inline-block align-top"
                alt="Aliasmanager logo"
              />
            </b-navbar-item>
            <b-navbar-item>
              {{ $t('app.title') }}
            </b-navbar-item>
          </template>
          <template #end>
            <b-navbar-item @click="logout">
              {{ $t('ui.logout') }}
            </b-navbar-item>
          </template>
        </b-navbar>
      </div>
    </div>
    <div class="columns">
      <div class="column pr-0">
        <AliasManager />
      </div>
    </div>
  </div>
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
    await Axios.get('/api/auth/logout');
    getEmitter().emit('refresh');
  }
}
</script>
