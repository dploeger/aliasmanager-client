<template>
  <div>
    <v-alert :type="alertType" :value="alertVisible">
      {{ alertMessage }}
    </v-alert>
    <AliasFilter
      v-on:set-filter="
        filter = $event;
        loadAliases();
      "
    />
    <v-data-table :items="aliases" :loading="loading" :headers="headers">
      <template v-slot:item.address="props">
        <v-edit-dialog
          @save="save"
          persistent
          large
          return-value="props.item.address"
        >
          {{ props.item.address }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.address"
              label="Edit"
              single-line
            ></v-text-field>
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
import { Alias } from '@/data/Alias';
import VDataTableHeader from 'vuetify/src/components/VDataTable/VDataTableHeader';
import Axios from 'axios';
import { Prop, Watch } from 'vue-property-decorator';

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
    {
      text: 'Description',
      value: 'description',
    },
  ];

  async loadAliases() {
    try {
      this.loading = true;
      const response = await Axios.get(
        `/account/${this.$store.state.username}/alias?filter=${this.filter}`,
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
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

  async save() {
    debugger;
  }
}
</script>

<style scoped></style>
