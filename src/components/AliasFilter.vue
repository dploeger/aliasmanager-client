<template>
  <div>
    <b-input
      v-model="filter"
      name="filter"
      data-test="filterInput"
      :placeholder="$t('ui.filter.placeholder')"
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
