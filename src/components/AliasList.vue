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

/**
 * The list of aliases
 */
@Component({
  name: 'AliasList',
})
export default class AliasList extends Vue {
  /**
   * Wether the list is loading
   */
  public loading: boolean = false;

  /**
   * The type of the alert shown
   */
  public alertType: string = 'is-danger';
  /**
   * The message of the alert
   */
  public alertMessage: string = '';
  /**
   * Wether the alert is visible or not
   */
  public alertVisible: boolean = false;

  /**
   * Wether the edit modal is visible
   */
  public editVisible: boolean = false;

  /**
   * The old address that is edited
   */
  public oldAddress: string = '';
  /**
   * The new value of the edited address
   */
  public editAddress: string = '';
  /**
   * The type of the edit alert
   */
  public editAlertType: string = 'is-danger';
  /**
   * The alert message in the edit modal
   */
  public editAlertMessage: string = '';
  /**
   * Wether the alert message in the edit is visible
   */
  public editAlertVisible: boolean = false;
  /**
   * The last focused edit button
   */
  public editButtonClicked: any = null;

  /**
   * The list of aliases
   */
  public aliases = [];
  /**
   * A filter for the aliases
   */
  public filter = '';

  /**
   * A reg exp validating the alias
   */
  public eMailRegex: RegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

  /**
   * The paginiation page size
   */
  public pageSize = 10;
  /**
   * The currently displayed page
   */
  public page = 1;
  /**
   * The total number of aliases in the system matching the filter
   */
  public total = 0;
  /**
   * Valid page sizes
   */
  public pageSizes = [5, 10, 20, 50];

  /**
   * Fill the alias table once it is mounted
   */
  public mounted() {
    this.loadAliases();
  }

  /**
   * Set up event emitter handlers
   */
  created() {
    this.$log.debug('Setting up refresh event handler');
    getEmitter().on('refresh', this.loadAliases);
    this.$log.debug('Setting up set-filter event handler');
    getEmitter().on('set-filter', (filter) => {
      this.filter = filter;
      this.loadAliases();
    });
  }

  /**
   * Load the aliases from the API-server
   */
  async loadAliases() {
    try {
      this.$log.debug(
        `Loading aliases page ${this.page} with filter ${this.filter} with a page size of ${this.pageSize}`,
      );
      this.loading = true;
      const response = await Axios.get(
        `/api/account/alias?filter=${this.filter}&page=${this.page}&pageSize=${this.pageSize}`,
      );
      this.loading = false;
      this.aliases = response.data.results;
      this.total = response.data.total;
      this.$log.debug(`Got ${this.aliases.length} of ${this.total} aliases`);
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 401:
          this.$log.warn(
            'Got unauthenticated response. Maybe you need to log in or have the wrong password?',
          );
          this.aliases = [];
          getEmitter().emit('needs-login');
          break;
      }
    }
  }

  /**
   * Called when the alias table was clicked
   * @param row row that was clicked
   * @param column column that was clicked
   * @param rowIndex index of row that was clicked
   * @param columnIndex index of column that was clicked
   */
  public onTableCellClick(
    row: any,
    column: object,
    rowIndex: number,
    columnIndex: number,
  ) {
    if (columnIndex == 0) {
      this.$log.debug(`Alias ${row.address} was clicked. Opening edit modal`);
      this.editAlias(row.address);
    }
  }

  /**
   * Called when an edit button was clicked
   * @param e click event
   * @param alias selected alias
   */
  public onEditButtonClicked(e: Event, alias: string) {
    if (e.target) {
      this.$log.debug('Storing clicked edit button to focus later');
      this.editButtonClicked = e.target;
      this.$log.debug(`Alias ${alias} was clicked, opening edit modal`);
      this.editAlias(alias);
    }
  }

  /**
   * Opens the edit alias modal
   * @param alias the alias to be edited
   */
  public editAlias(alias: string) {
    this.editAddress = alias;
    this.oldAddress = alias;
    this.editVisible = true;
  }

  /**
   * Saving an edit alias
   * @param e optional click event
   */
  async save(e: Event) {
    if (e) {
      e.preventDefault();
    }
    const oldAlias = this.oldAddress;
    const newAlias = this.editAddress;
    if (oldAlias === newAlias) {
      this.$log.debug(
        'No change was made to the alias. Simply closing the modal',
      );
      this.editVisible = false;
      return;
    }
    try {
      this.$log.debug(`Changing alias ${oldAlias} to ${newAlias}`);
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
          this.$log.error(`Alias ${oldAlias} was not found`);
          this.editAlertMessage = this.$t('errors.404', {
            alias: oldAlias,
          }) as string;
          break;
        case 409:
          this.$log.error(`Alias ${newAlias} already exists`);
          this.editAlertMessage = this.$t('errors.409', {
            alias: newAlias,
          }) as string;
          break;
        case 401:
          this.$log.warn('Authentication failed. Showing login modal');
          getEmitter().emit('needs-login');
          break;
      }
      this.editAlertType = 'is-danger';
      this.editAlertVisible = true;
    }
  }

  /**
   * Delete an alias
   * @param address alias to delete
   */
  async deleteAlias(address: string) {
    try {
      this.$log.debug(`Deleting alias ${address}`);
      await Axios.delete(`/api/account/alias/${address}`, {});
      return this.loadAliases();
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 404:
          this.$log.error(`Alias ${address} was not found`);
          this.alertMessage = this.$t('errors.404', {
            alias: address,
          }) as string;
          break;
        case 401:
          this.$log.warn('Authentication failed. Showing login modal');
          getEmitter().emit('needs-login');
          break;
      }
      this.alertType = 'is-danger';
      this.alertVisible = true;
    }
  }

  /**
   * Change the page shown
   * @param page target page
   */
  public changePage(page: number) {
    this.page = page;
    this.loadAliases();
  }
}
</script>

<style scoped></style>
