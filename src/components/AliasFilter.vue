<template>
  <div class="columns">
    <div class="column">
      <b-field
        :label="$t('ui.filter.placeholder')"
        label-for="filter"
        label-position="on-border"
      >
        <b-input
          id="filter"
          v-model="filter"
          name="filter"
          data-test="filterInput"
          class="is-flex-grow-1"
          @input="setFilter"
        />
        <p class="control">
          <b-button
            class="button is-primary"
            data-test="clearFilterButton"
            :title="$t('ui.filter.clear')"
            @click="
              filter = '';
              setFilter();
            "
          >
            <b-icon icon="close" />
          </b-button>
        </p>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { getEmitter } from '@/emitter';

@Component({
  name: 'AliasFilter',
  components: { AliasFilter },
})
export default class AliasFilter extends Vue {
  public filter: string = '';
  public setFilter() {
    getEmitter().emit('set-filter', this.filter);
  }
}
</script>

<style scoped></style>
