<template>
  <v-app id="inspire">
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>Aliasmanager</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row align="stretch" justify="center">
          <v-col>
            <AliasManager />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasManager from '@/components/AliasManager.vue';
import { getModule } from 'vuex-module-decorators';
import { Account } from '@/stores/modules/Account';

const account = getModule(Account);

@Component({
  name: 'App',
  components: { AliasManager },
})
export default class App extends Vue {
  public logout() {
    account.resetToken();
  }
}
</script>
