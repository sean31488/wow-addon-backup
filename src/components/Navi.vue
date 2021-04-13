<template>
  <nav class="fixed navbar w-full">
    <div class="px-4 navbar-menu is-active">
      <div class="flex navbar-start">
        <router-link
          :to="{ name: 'Setting' }"
          :class="{ 'is-disabled': disabled }"
          class="navbar-item"
          exact-active-class="is-active">設定</router-link>
        <router-link
          :to="{ name: 'Backup' }"
          :class="{ 'is-disabled': !isBackupValidate || disabled }"
          class="navbar-item"
          exact-active-class="is-active">備份</router-link>
        <router-link
          :to="{ name: 'Restore' }"
          :class="{ 'is-disabled': !isBackupValidate || disabled }"
          class="navbar-item"
          exact-active-class="is-active">還原</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Navi',
  props: {
    disabled: Boolean
  },
  computed: {
    ...mapState(['gamePath', 'backupFolder', 'backupPath']),
    ...mapGetters(['isBackupValidate'])
  }
}
</script>

<style scoped>

</style>
