<template>
  <div>
    <div>
      <NewAlias />
    </div>
    <div>
      <AliasList :logged-in="loggedIn" />
    </div>
    <v-dialog v-model="dialog">
      <v-form onSubmit="return false;">
        <v-card>
          <v-card-title>{{ $t('login.title') }}</v-card-title>
          <v-card-text>
            <v-alert :type="alertType" :value="alertVisible"
              >{{ alertMessage }}
            </v-alert>
            <v-text-field
              v-model="username"
              hint="username"
              label="username"
              autocomplete="username"
            />
            <v-text-field
              v-model="password"
              hint="password"
              label="password"
              type="password"
              autocomplete="current-password"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" text @click="login">
              {{ $t('dialog.login') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasList from '@/components/AliasList.vue';
import NewAlias from '@/components/NewAlias.vue';
import Axios from 'axios';

@Component({
  name: 'AliasManager',
  components: { NewAlias, AliasList },
})
export default class AliasManager extends Vue {
  public dialog: boolean;
  public username: string = '';
  public password: string = '';
  public alertType: string = 'error';
  public alertMessage: string = '';
  public alertVisible: boolean = false;
  public loggedIn: boolean = false;

  constructor() {
    super();
    if (this.$store.state.token === null) {
      this.dialog = true;
    } else {
      this.dialog = false;
    }
  }

  async login() {
    try {
      const response = await Axios.get(`/api/token`, {
        auth: {
          username: this.username,
          password: this.password,
        },
      });
      this.$store.state.username = this.username;
      this.$store.state.token = response.data;
      this.dialog = false;
      this.loggedIn = true;
    } catch (e) {
      this.alertMessage = e.response.data.message;
      this.alertType = 'error';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
