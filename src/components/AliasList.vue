<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <b-table
          :data="aliases"
          backend-pagination
          backend-filtering
          striped
          :mobile-cards="false"
          @cellclick="onTableCellClick"
        >
          <template #empty>
            <b-message type="is-info">
              {{ $t('table.noEntriesFound') }}
            </b-message>
          </template>
          <b-table-column
            v-slot="props"
            field="address"
            :label="$t('table.address')"
          >
            <span data-test="aliasEntry">
              {{ props.row.address }}
            </span>
          </b-table-column>
          <b-table-column v-slot="props" width="40">
            <b-button
              :title="$t('table.edit', { alias: props.row.address })"
              @click="onEditButtonClicked($event, props.row.address)"
            >
              <b-icon icon="pencil" />
            </b-button>
          </b-table-column>
          <b-table-column v-slot="props" width="40">
            <b-button
              :title="$t('table.delete', { alias: props.row.address })"
              data-test="deleteAliasButton"
              @click="deleteAlias(props.row.address)"
            >
              <b-icon icon="delete" />
            </b-button>
          </b-table-column>
        </b-table>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <b-pagination
          v-model="page"
          :per-page="pageSize"
          :total="total"
          :aria-next-label="$t('pagination.next')"
          :aria-previous-label="$t('pagination.prev')"
          :aria-page-label="$t('pagination.page')"
          @change="changePage"
        />
      </div>
      <div class="column">
        <b-select
          id="rowsPerPage"
          v-model="pageSize"
          :title="$t('ui.pagination.pageSize')"
          :placeholder="$t('ui.pagination.pageSize')"
          data-test="pageSizeSelect"
          class="is-flex-grow-1"
          @input="loadAliases"
        >
          <option v-for="size in pageSizes" :key="size">
            {{ size }}
          </option>
        </b-select>
      </div>
    </div>
    <b-modal
      v-model="editVisible"
      has-modal-card
      aria-role="dialog"
      aria-modal
      :title="$t('table.edit', { alias: oldAddress })"
      data-test="editDialog"
      @after-enter="$refs.editInput.focus()"
      @close="editButtonClicked.focus()"
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ $t('table.edit', { alias: oldAddress }) }}
          </p>
        </header>

        <section class="modal-card-body">
          <b-message
            v-model="editAlertVisible"
            data-test="editAliert"
            :type="editAlertType"
          >
            {{ editAlertMessage }}
          </b-message>
          <form data-test="editForm" @submit="save">
            <b-field :label="$t('ui.alias')" label-for="alias">
              <b-input
                ref="editInput"
                v-model="editAddress"
                name="alias"
                title="$t('ui.alias')"
                data-test="editInput"
              />
            </b-field>
            <footer class="modal-card-foot is-justify-content-flex-end">
              <b-button @click="editVisible = false">
                {{ $t('dialog.cancel') }}
              </b-button>
              <b-button native-type="submit" type="is-primary">
                {{ $t('dialog.save') }}
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
import Axios from 'axios';
import { getEmitter } from '@/emitter';

@Component({
  name: 'AliasList',
})
export default class AliasList extends Vue {
  public loading: boolean = false;

  public alertType: string = 'is-danger';
  public alertMessage: string = '';
  public alertVisible: boolean = false;

  public editVisible: boolean = false;
  public oldAddress: string = '';
  public editAddress: string = '';
  public editAlertType: string = 'is-danger';
  public editAlertMessage: string = '';
  public editAlertVisible: boolean = false;
  public editButtonClicked: any = null;

  public aliases = [];
  public filter = '';

  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
  public pageSize = 10;
  public page = 1;
  public total = 0;
  public pageSizes = [5, 10, 20, 50];

  public mounted() {
    this.loadAliases();
  }

  created() {
    getEmitter().on('refresh', this.loadAliases);
    getEmitter().on('set-filter', (filter) => {
      this.filter = filter;
      this.loadAliases();
    });
  }

  async loadAliases() {
    try {
      this.loading = true;
      const response = await Axios.get(
        `/api/account/alias?filter=${this.filter}&page=${this.page}&pageSize=${this.pageSize}`,
      );
      this.loading = false;
      this.aliases = response.data.results;
      this.total = response.data.total;
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

  public onTableCellClick(
    row: any,
    column: object,
    rowIndex: number,
    columnIndex: number,
  ) {
    if (columnIndex == 0) {
      this.editAlias(row.address);
    }
  }

  public onEditButtonClicked(e: Event, alias: string) {
    if (e.target) {
      this.editButtonClicked = e.target;
      this.editAlias(alias);
    }
  }

  public editAlias(alias: string) {
    this.editAddress = alias;
    this.oldAddress = alias;
    this.editVisible = true;
  }

  async save(e: Event) {
    if (e) {
      e.preventDefault();
    }
    const oldAlias = this.oldAddress;
    const newAlias = this.editAddress;
    if (oldAlias === newAlias) {
      this.editVisible = false;
      return;
    }
    try {
      await Axios.put(`/api/account/alias/${oldAlias}`, {
        address: newAlias,
      });
      this.editVisible = false;
      if (this.editButtonClicked) {
        this.editButtonClicked.focus();
      }
      return this.loadAliases();
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 404:
          this.editAlertMessage = this.$t('errors.404', {
            alias: oldAlias,
          }) as string;
          break;
        case 409:
          this.editAlertMessage = this.$t('errors.409', {
            alias: newAlias,
          }) as string;
          break;
        case 401:
          getEmitter().emit('needs-login');
          break;
      }
      this.editAlertType = 'is-danger';
      this.editAlertVisible = true;
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
            alias: address,
          }) as string;
          break;
        case 401:
          getEmitter().emit('needs-login');
          break;
      }
      this.alertType = 'is-danger';
      this.alertVisible = true;
    }
  }

  public changePage(page: number) {
    this.page = page;
    this.loadAliases();
  }
}
</script>

<style scoped></style>
