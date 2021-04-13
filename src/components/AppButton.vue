<template>
  <button class="app-button button" @click="$emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    disabled: { type: Boolean, default: false }
  }
}
</script>

<style lang="sass">

</style>
