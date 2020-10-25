<template>
  <div>
    <v-alert v-model="alertVisible" :type="alertType" dismissible>
      {{ alertMessage }}
    </v-alert>
    <AliasFilter
      @set-filter="
        filter = $event;
        loadAliases();
      "
    />
    <v-data-table :items="aliases" :loading="loading" :headers="headers">
      <template #[`item.address`]="props">
        <v-dialog persistent>
          <v-card>
            <v-card-title>Edit {{ props.item.address }}</v-card-title>
            <v-card-text>
              <v-text-field
                ref="editInput"
                v-model="oldAddress"
                label="Edit"
                single-line
              />
              <v-card-actions>
                <v-spacer />
                <v-btn text color="primary"> Ok </v-btn>
                <v-btn text color="cancel">Cancel </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
          <template #activator="{ on }">
            <v-btn
              icon
              :title="`Edit ${props.item.address}`"
              v-on="editAddress(props.item.address, on)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-dialog>
        <span tabindex="0">{{ props.item.address }}</span>
      </template>
      <template #[`item.delete`]="props">
        <v-btn
          icon
          :title="`Delete alias ${props.item.address}`"
          tabindex="0"
          @click="deleteAlias(props.item.address)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasFilter from '@/components/AliasFilter.vue';
import Axios from 'axios';
import { Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Account } from '@/stores/modules/Account';

const account = getModule(Account);

@Component({
  name: 'AliasList',
  components: { AliasFilter },
})
export default class AliasList extends Vue {
  public loading: boolean = false;
  public alertType: string = 'error';
  public alertMessage: string = '';
  public alertVisible: boolean = false;
  @Prop({ default: false })
  public loggedIn: boolean = false;
  public aliases = [];
  public filter = '';
  public headers = [
    {
      text: 'Address',
      width: '100%',
      value: 'address',
    },
    {
      text: '',
      value: 'delete',
      sortable: false,
    },
  ];
  public oldAddress = '';

  created() {
    this.$on('refresh', this.loadAliases);
  }

  async loadAliases() {
    try {
      this.loading = true;
      const response = await Axios.get(
        `/api/account/alias?filter=${this.filter}`,
        {
          headers: {
            Authorization: `Bearer ${account.token}`,
          },
        },
      );
      this.loading = false;
      this.aliases = response.data;
    } catch (error) {
      this.loading = false;
      switch (error.response.status) {
        case 401:
          account.token = null;
          break;
      }
      this.alertType = 'error';
      this.alertVisible = true;
      this.aliases = [];
    }
  }

  @Watch('loggedIn')
  async onLoggedIn(value: boolean) {
    if (value) {
      await this.loadAliases();
    }
  }

  editAddress(oldAddress: string, eventHandler) {
    this.oldAddress = oldAddress;
    eventHandler.click();
  }

  async save(newAddress: string) {
    try {
      await Axios.put(
        `/api/account/alias/${this.oldAddress}`,
        {
          address: newAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${account.token}`,
          },
        },
      );
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
            alias: newAddress,
          }) as string;
          break;
        case 401:
          account.token = null;
          break;
      }
      this.alertType = 'error';
      this.alertVisible = true;
    }
  }

  async deleteAlias(address: string) {
    try {
      await Axios.delete(`/api/account/alias/${address}`, {
        headers: {
          Authorization: `Bearer ${account.token}`,
        },
      });
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
          account.token = null;
          break;
      }
      this.alertType = 'error';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
