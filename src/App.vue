<template>
  <div id="app">
    <navi :disabled="isLoading"></navi>
    <div class="app-content">
      <router-view :is-loading.sync="isLoading" class="p-4"></router-view>
    </div>
  </div>
</template>

<script>
import Navi from '@/components/Navi'

export default {
  components: { Navi },
  data () {
    return {
      isLoading: false
    }
  }
}
</script>

<style lang="sass">
#app
  position: relative
  height: 100vh
  background: theme("colors.gray.100")

  .app-content
    position: absolute
    top: 56px
    width: 100%
    height: 515px
</style>
