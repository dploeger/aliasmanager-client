<template>
  <div>
    <div>
      <NewAlias
        ref="newAlias"
        @new-alias-created="$refs['alias-list'].$emit('refresh')"
      />
    </div>
    <div>
      <AliasList ref="alias-list" :logged-in="loggedIn" />
    </div>
    <v-dialog v-model="dialog" persistent>
      <v-form @submit="login">
        <v-card>
          <v-card-title>{{ $t('login.title') }}</v-card-title>
          <v-card-text>
            <v-alert :type="alertType" :value="alertVisible">
              {{ alertMessage }}
            </v-alert>
            <v-text-field
              ref="usernameInput"
              v-model="username"
              :label="$t('login.username')"
              :hint="$t('login.username')"
            />
            <v-text-field
              v-model="password"
              :hint="$t('login.password')"
              :label="$t('login.password')"
              type="password"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
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
import { getModule } from 'vuex-module-decorators';
import { Account } from '@/stores/modules/Account';
import { Watch } from 'vue-property-decorator';

const account = getModule(Account);

@Component({
  name: 'AliasManager',
  components: { NewAlias, AliasList },
})
export default class AliasManager extends Vue {
  public username: string = '';
  public password: string = '';
  public alertType: string = 'error';
  public alertMessage: string = '';
  public alertVisible: boolean = false;
  public loggedIn: boolean = false;

  public get dialog(): boolean {
    return account.token === null;
  }

  @Watch('dialog', { immediate: true })
  public onDialogChange(newValue: boolean) {
    if (newValue) {
      this.$nextTick(() => {
        const focusInterval = window.setInterval(() => {
          if ((this.$refs.usernameInput as any).isBooted) {
            clearInterval(focusInterval);
            ((this.$refs.usernameInput as Vue).$refs
              .input as HTMLInputElement).focus();
          }
        }, 500);
      });
    }
  }

  async login(event: Event) {
    event.preventDefault();
    try {
      const response = await Axios.get(`/api/token`, {
        auth: {
          username: this.username,
          password: this.password,
        },
      });
      this.password = '';
      account.updateUsername(this.username);
      account.updateToken(response.data);
      this.loggedIn = true;
      this.$nextTick(() => {
        (((this.$refs.newAlias as Vue).$refs.input as Vue).$refs
          .input as HTMLInputElement).focus();
      });
    } catch (e) {
      this.alertMessage = e.response.data.message;
      this.alertType = 'error';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
