<template>
  <label class="checkbox app-checkbox" :class="{ 'is-disabled': disabled }">
    <input
      type="checkbox"
      class="checkbox"
      :checked="value"
      @input="$emit('input', $event.target.checked)">
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'AppCheckbox',
  props: {
    value: Boolean,
    disabled: { type: Boolean, default: false }
  }
}
</script>

<style lang="sass">
.app-checkbox
  display: inline-block
  user-select: none

  .checkbox
    margin-right: 4px
</style>
