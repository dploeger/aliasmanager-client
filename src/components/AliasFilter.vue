<template>
  <div>
    <v-text-field
      v-on:keyup="$emit('set-filter', filter)"
      v-model="filter"
      hint="Enter a filter text"
      label="Filter"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';

@Component({
  name: 'AliasFilter',
  components: { AliasFilter },
})
export default class AliasFilter extends Vue {
  public filter: string = '';
}
</script>

<style scoped></style>
