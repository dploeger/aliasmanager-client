<template>
  <div>
    <v-alert :type="alertType" :value="alertVisible">
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
        <v-edit-dialog
          v-model:return-value="props.item.address"
          persistent
          large
          @open="open(props.item.address)"
          @save="save(props.item.address)"
        >
          {{ props.item.address }}
          <template #input>
            <v-text-field
              ref="editInput"
              v-model="props.item.address"
              label="Edit"
              single-line
            />
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import AliasFilter from '@/components/AliasFilter.vue';
//import { Alias } from '@/data/Alias';
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
      value: 'address',
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
    } catch (e) {
      this.loading = false;
      this.alertMessage = e.response.data.message;
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

  async open(oldAddress: string) {
    this.oldAddress = oldAddress;
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
    } catch (e) {
      this.loading = false;
      this.alertMessage = e.response.data.message;
      this.alertType = 'error';
      this.alertVisible = true;
    }
  }
}
</script>

<style scoped></style>
