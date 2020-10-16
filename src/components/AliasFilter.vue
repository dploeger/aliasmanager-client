<template>
  <div>
    <v-text-field
      v-model="filter"
      hint="Enter a filter text"
      label="Filter"
      @keyup="$emit('set-filter', filter)"
    />
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
