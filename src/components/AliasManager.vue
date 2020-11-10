<template>
  <div class="container">
    <div class="container px-2">
      <div class="columns">
        <div class="column">
          <NewAlias ref="newAlias" />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <AliasFilter />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <AliasList />
        </div>
      </div>
    </div>
    <b-modal
      v-model="dialog"
      has-modal-card
      aria-role="dialog"
      aria-modal
      :title="$t('login.title')"
      data-test="loginDialog"
      :can-cancel="false"
      @after-enter="$refs.usernameInput.focus()"
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ $t('login.title') }}
          </p>
        </header>

        <section class="modal-card-body">
          <b-message
            v-model="alertVisible"
            data-test="loginAlert"
            :type="alertType"
          >
            {{ alertMessage }}
          </b-message>
          <form data-test="loginForm" @submit="login">
            <b-field :label="$t('login.username')" label-for="username">
              <b-input
                ref="usernameInput"
                v-model="username"
                name="username"
                title="$t('login.username')"
                data-test="username"
                autocomplete="username"
              />
            </b-field>
            <b-field :label="$t('login.password')" label-for="password">
              <b-input
                v-model="password"
                name="password"
                :title="$t('login.password')"
                data-test="password"
                autocomplete="current-password"
                type="password"
                password-reveal
              />
            </b-field>
            <footer class="modal-card-foot is-justify-content-flex-end">
              <b-button native-type="submit" type="is-primary">
                {{ $t('dialog.login') }}
              </b-button>
            </footer>
          </form>
        </section>
      </div>
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
import AliasFilter from '@/components/AliasFilter.vue';

@Component({
  name: 'AliasManager',
  components: { NewAlias, AliasList, AliasFilter },
})
export default class AliasManager extends Vue {
  public username: string = '';
  public password: string = '';
  public alertType: string = 'is-danger';
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
      ((this.$refs.newAlias as Vue).$refs.input as HTMLElement).focus();
      getEmitter().emit('refresh');
    } catch (e) {
      this.alertMessage = e.response.data.message;
      this.alertType = 'is-danger';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
