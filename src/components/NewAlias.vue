<template>
  <div class="columns">
    <div class="column">
      <b-message
        v-model="alertVisible"
        data-test="loginAlert"
        :type="alertType"
      >
        {{ alertMessage }}
      </b-message>
      <form data-test="newAliasForm" @submit="addAlias">
        <b-field
          :label="$t('ui.alias.placeholder')"
          label-for="newAlias"
          label-position="on-border"
          :type="alias === '' ? '' : aliasValid ? 'is-success' : 'is-danger'"
          :message="
            aliasValid ? '' : $t('errors.invalidmail', { alias: alias })
          "
        >
          <b-input
            id="newAlias"
            ref="input"
            v-model="alias"
            class="is-flex-grow-1"
            data-test="newAliasInput"
          />
          <p class="control">
            <b-button
              class="button is-primary"
              data-test="newAliasButton"
              :title="$t('ui.filter.clear')"
              @click="addAlias"
            >
              <b-icon icon="plus" />
            </b-button>
          </p>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import Axios from 'axios';
import { getEmitter } from '@/emitter';

@Component({
  name: 'NewAlias',
})
export default class NewAlias extends Vue {
  public alias: string = '';
  public alertVisible: boolean = false;
  public alertType: string = 'is-danger';
  public alertMessage: string = '';
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  public get aliasValid(): boolean | null {
    return this.alias === '' || this.eMailRegex.test(this.alias);
  }

  public async addAlias(e: Event) {
    e.preventDefault();
    try {
      await Axios.post(`/api/account/alias`, {
        address: this.alias,
      });
      this.alias = '';
      getEmitter().emit('refresh');
      this.alertVisible = false;
    } catch (error) {
      this.alertType = 'is-danger';
      switch (error.response.status) {
        case 409:
          this.alertMessage = this.$t('errors.409', {
            alias: this.alias,
          }) as string;
          break;
        case 401:
          getEmitter().emit('needs-login');
          break;
      }
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
