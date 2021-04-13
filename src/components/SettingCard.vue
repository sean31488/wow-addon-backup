<template>
  <div class="card setting-card">
    <div class="card-content">
      <div class="flex justify-between items-center content">
        <div>
          <slot name="left"></slot>
        </div>
        <div>
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingCard'
}
</script>

<style lang="sass">
.setting-card
  .card-content
    .content
      height: 64px

    .card-button
      position: absolute
      right: 1.5rem
      top: 36px
</style>
