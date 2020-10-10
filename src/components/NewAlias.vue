<template>
    <div>
        {{ $store.state.username }}
    </div>
</template>

<script lang=ts>
  import Component from 'vue-class-component';
  import Vue from 'vue';

  @Component({
    name: 'NewAlias',
  })
  export default class NewAlias extends Vue {
  }
</script>

<style scoped>

</style>
