<template>
  <div>
    <b-alert v-model="alertVisible" :variant="alertType">
      {{ alertMessage }}
    </b-alert>
    <b-row>
      <b-col>
        <AliasFilter
          @set-filter="
            filter = $event;
            loadAliases();
          "
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          :items="aliases"
          responsive="true"
          :fields="headers"
          striped
          dark
          :busy="loading"
          :show-empty="true"
        >
          <template #empty>
            <b-alert data-test="noEntriesFound" :show="true" variant="info">
              {{ $t('table.noEntriesFound') }}
            </b-alert>
          </template>
          <template #head(actions)="">
            <b-btn :title="$t('table.refresh')" @click="loadAliases">
              {{ $t('table.refresh') }}
            </b-btn>
          </template>
          <template #cell(address)="data">
            <b-link
              href="#"
              :title="$t('table.edit', { alias: data.value })"
              data-test="aliasEntry"
              @click="showEditBox(data.value)"
            >
              {{ data.value }}
            </b-link>
          </template>
          <template #cell(actions)="data">
            <b-btn
              pill
              variant="light"
              :title="$t('table.delete', { alias: data.item.address })"
              data-test="deleteAliasButton"
              @click="deleteAlias(data.item.address)"
            >
              <b-icon-trash />
            </b-btn>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-modal :visible="editVisible" data-test="editDialog" ok-only @ok="save">
      <b-form data-test="editForm" @submit="save">
        <b-form-input
          ref="editInput"
          v-model="editAlias"
          autofocus
          data-test="editInput"
          :placeholder="$t('ui.alias.placeholder')"
          :state="editAliasValid"
          type="email"
        />
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasFilter from '@/components/AliasFilter.vue';
import Axios from 'axios';
import { getEmitter } from '@/emitter';

@Component({
  name: 'AliasList',
  components: { AliasFilter },
})
export default class AliasList extends Vue {
  public loading: boolean = false;
  public alertType: string = 'danger';
  public alertMessage: string = '';
  public alertVisible: boolean = false;
  public editVisible: boolean = false;
  public editAlias: string = '';
  public aliases = [];
  public filter = '';

  public oldAddress = '';
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  public mounted() {
    this.loadAliases();
  }

  public get headers(): any {
    return [
      {
        label: this.$t('table.address'),
        key: 'address',
        thStyle: 'width:100%',
      },
      {
        label: '',
        key: 'actions',
      },
    ];
  }

  public get editAliasValid(): boolean | null {
    if (this.editAlias === '') {
      return null;
    }
    return this.eMailRegex.test(this.editAlias);
  }

  created() {
    getEmitter().on('refresh', this.loadAliases);
  }

  async loadAliases() {
    try {
      this.loading = true;
      const response = await Axios.get(
        `/api/account/alias?filter=${this.filter}`,
      );
      this.loading = false;
      this.aliases = response.data;
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 401:
          this.aliases = [];
          getEmitter().emit('needs-login');
          break;
      }
    }
  }

  editAddress(oldAddress: string, eventHandler: any) {
    this.oldAddress = oldAddress;
    eventHandler.click();
  }

  async save(e: Event) {
    if (e) {
      e.preventDefault();
    }
    try {
      await Axios.put(`/api/account/alias/${this.oldAddress}`, {
        address: this.editAlias,
      });
      this.editAlias = '';
      this.editVisible = false;
      return this.loadAliases();
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 404:
          this.alertMessage = this.$t('errors.404', {
            alias: this.oldAddress,
          }) as string;
          break;
        case 409:
          this.alertMessage = this.$t('errors.409', {
            alias: this.editAlias,
          }) as string;
          break;
        case 401:
          getEmitter().emit('needs-login');
          break;
      }
      this.alertType = 'danger';
      this.alertVisible = true;
    }
  }

  async deleteAlias(address: string) {
    try {
      await Axios.delete(`/api/account/alias/${address}`, {});
      return this.loadAliases();
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 404:
          this.alertMessage = this.$t('errors.404', {
            alias: this.oldAddress,
          }) as string;
          break;
        case 401:
          getEmitter().emit('needs-login');
          break;
      }
      this.alertType = 'danger';
      this.alertVisible = true;
    }
  }

  public showEditBox(alias: string) {
    this.oldAddress = alias;
    this.editAlias = alias;
    this.editVisible = true;
  }
}
</script>

<style scoped></style>
