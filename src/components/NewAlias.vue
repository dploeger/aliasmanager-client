<template>
  <div>
    <v-alert :type="alertType" :value="alertVisible">
      {{ alertMessage }}
    </v-alert>
    <v-form @submit="addAlias">
      <v-text-field
        ref="input"
        v-model="alias"
        :placeholder="$t('newalias.alias.placeholder')"
        :error="!aliasValid"
        :error-count="aliasValid ? 0 : 1"
        :error-messages="aliasValid ? '' : 'Invalid E-Mailaddress'"
      >
        <template #append>
          <v-btn
            color="primary"
            type="submit"
            icon
            :disabled="!aliasValid"
            tabindex="-1"
            @click="addAlias"
          >
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import { Account } from '@/stores/modules/Account';
import Axios from 'axios';

const account = getModule(Account);

@Component({
  name: 'NewAlias',
})
export default class NewAlias extends Vue {
  public alias: string = '';
  public alertVisible: boolean = false;
  public alertType: string = 'error';
  public alertMessage: string = '';
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  public get aliasValid(): boolean {
    return this.alias === '' || this.eMailRegex.test(this.alias);
  }

  public async addAlias(e: Event) {
    e.preventDefault();
    try {
      await Axios.post(
        `/api/account/alias`,
        {
          address: this.alias,
        },
        {
          headers: {
            Authorization: `Bearer ${account.token}`,
          },
        },
      );
      this.alias = '';
      this.$emit('new-alias-created');
    } catch (e) {
      this.alertType = 'error';
      this.alertMessage = e.message;
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
