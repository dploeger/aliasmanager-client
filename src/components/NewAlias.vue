<template>
  <div>
    <b-alert
      v-model="alertVisible"
      data-test="newAliasAlert"
      :variant="alertType"
      dismissible
    >
      {{ alertMessage }}
    </b-alert>
    <b-form data-test="newAliasForm" @submit="addAlias">
      <b-input-group>
        <b-form-input
          ref="input"
          v-model="alias"
          data-test="newAliasInput"
          :placeholder="$t('ui.alias.placeholder')"
          :state="aliasValid"
          aria-describedby="newAliasFeedback"
          :aria-invalid="!aliasValid"
          type="email"
          :autofocus="true"
        />
        <b-input-group-append>
          <b-btn
            variant="primary"
            data-test="newAliasButton"
            squared
            :title="$t('ui.alias.create')"
            @click="addAlias"
          >
            <b-icon-plus />
          </b-btn>
        </b-input-group-append>
        <span id="newAliasFeedback" class="sr-only">
          {{ $t('errors.invalidmail', { alias: alias }) }}
        </span>
      </b-input-group>
    </b-form>
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
  public alertType: string = 'danger';
  public alertMessage: string = '';
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  public get aliasValid(): boolean | null {
    if (this.alias === '') {
      return null;
    }
    return this.eMailRegex.test(this.alias);
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
      this.alertType = 'danger';
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
