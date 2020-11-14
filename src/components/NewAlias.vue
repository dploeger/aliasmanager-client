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

/**
 * A component for adding a new alias
 */
@Component({
  name: 'NewAlias',
})
export default class NewAlias extends Vue {
  /**
   * The new alias
   */
  public alias: string = '';

  /**
   * Wether the new alias alert are visible
   */
  public alertVisible: boolean = false;
  /**
   * The type of the new alias alert
   */
  public alertType: string = 'is-danger';
  /**
   * The message of the new alias aliert
   */
  public alertMessage: string = '';

  /**
   * A regexp validating the new alias
   */
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  /**
   * Wether the specified alias is valid
   */
  public get aliasValid(): boolean | null {
    return this.alias === '' || this.eMailRegex.test(this.alias);
  }

  /**
   * Add an alias
   * @param e an optional submit event
   */
  public async addAlias(e: Event) {
    if (e) {
      e.preventDefault();
    }
    try {
      this.$log.debug(`Adding alias ${this.alias}`);
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
          this.$log.error(`Alias ${this.alias} already exists`);
          this.alertMessage = this.$t('errors.409', {
            alias: this.alias,
          }) as string;
          break;
        case 401:
          this.$log.warn('Authentication failed. Showing login modal');
          getEmitter().emit('needs-login');
          break;
      }
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
