<template>
  <div>
    <b-row>
      <b-col>
        <NewAlias ref="newAlias" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <AliasList ref="alias-list" />
      </b-col>
    </b-row>
    <b-modal
      v-model="dialog"
      :title="$t('login.title')"
      data-test="loginDialog"
      no-close-on-backdrop
      ok-only
      :ok-title="$t('dialog.login')"
      centered
      no-close-on-esc
      hide-header-close
      @ok="login"
    >
      <b-alert
        v-model="alertVisible"
        data-test="loginAlert"
        :variant="alertType"
      >
        {{ alertMessage }}
      </b-alert>
      <b-form data-test="loginForm" @submit="login">
        <b-form-group :label="$t('login.username')" label-for="username">
          <b-form-input
            ref="usernameInput"
            v-model="username"
            autofocus
            name="username"
            title="username"
            data-test="username"
            autocomplete="username"
            :placeholder="$t('login.username')"
          />
        </b-form-group>
        <b-form-group :label="$t('login.password')" label-for="password">
          <b-form-input
            v-model="password"
            name="password"
            title="password"
            data-test="password"
            autocomplete="current-password"
            :placeholder="$t('login.password')"
            type="password"
          />
        </b-form-group>
        <b-btn hidden type="submit" />
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasList from '@/components/AliasList.vue';
import NewAlias from '@/components/NewAlias.vue';
import Axios from 'axios';
import { getEmitter } from '@/emitter';

@Component({
  name: 'AliasManager',
  components: { NewAlias, AliasList },
})
export default class AliasManager extends Vue {
  public username: string = '';
  public password: string = '';
  public alertType: string = 'danger';
  public alertMessage: string = '';
  public alertVisible: boolean = false;

  public dialog: boolean = false;

  created() {
    getEmitter().on('needs-login', () => {
      this.dialog = true;
    });
  }

  async login(event: Event) {
    if (event) {
      event.preventDefault();
    }
    try {
      await Axios.get(`/api/auth/login`, {
        auth: {
          username: this.username,
          password: this.password,
        },
      });
      this.password = '';
      this.dialog = false;
      getEmitter().emit('refresh');
    } catch (e) {
      this.alertMessage = e.response.data.message;
      this.alertType = 'danger';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
