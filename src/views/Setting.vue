<template>
<div class="setting">
  <div v-if="!isBackupValidate" class="notification is-danger">
    紅色星號為必填欄位
  </div>
  <setting-card>
    <template #left>
      <p class="h-6">遊戲路徑<span class="has-text-danger">*</span></p>
      <p class="m-0 h-6"> {{ gamePath }}</p>
    </template>
    <template #right>
      <app-button @click="selectFolderPath('game')" class="is-primary">選擇目錄</app-button>
    </template>
  </setting-card>
  <setting-card class="mt-2">
    <template #left>
      <p>備份目錄<span class="has-text-danger">*</span></p>
      <app-checkbox :value="backupFolder.wtf" @input="backupFolderOnChange('wtf', $event)" class="mr-8">
        _retail_\WTF
      </app-checkbox>
      <app-checkbox :value="backupFolder.addon" @input="backupFolderOnChange('addon', $event)">
        _retail_\Interface\AddOns
      </app-checkbox>
    </template>
  </setting-card>
  <setting-card class="mt-2">
    <template #left>
      <p class="h-6">備份路徑<span class="has-text-danger">*</span></p>
      <p class="m-0 h-6"> {{ backupPath }}</p>
    </template>
    <template #right>
      <app-button @click="selectFolderPath('backup')" class="is-primary card-button">選擇目錄</app-button>
    </template>
  </setting-card>
  <setting-card class="mt-2">
    <template #left>
      <div class="flex items-baseline h-8">
        <p class="mr-14">google雲端硬碟:
          <span v-if="googleToken" class="has-text-success">已授權</span>
          <span v-else class="has-text-danger">未授權</span>
        </p>
        <app-checkbox
          :value="isUploadToGoogleDrive"
          @input="isUploadToGoogleDriveOnChange($event)"
          :disabled="!googleToken"
          class="mr-8">上傳雲端</app-checkbox>
        <app-checkbox
          :value="isDeleteLocalFileAfterUpload"
          @input="$store.commit('updateIsDeleteLocalFileAfterUpload', $event)"
          :disabled="!googleToken || !isUploadToGoogleDrive">刪除本地檔案</app-checkbox>
      </div>
      <p class="m-0 h-6">
        <span v-if="googleToken">{{ googleDriveFolder.name }}</span>
      </p>
    </template>
    <template #right>
      <template v-if="googleToken">
        <app-button @click="googleSignOut">
          <img src="~@/assets/logo_drive.png" class="pr-1 h-4">登出
        </app-button>
        <router-link :to="{ name: 'SelectGoogleDriveFolder' }">
          <app-button class="ml-1 is-primary">選擇目錄</app-button>
        </router-link>
      </template>
      <app-button
        v-else
        @click="googleSignIn"
        :disabled="!hasGoogleApiClientId"
        class="is-primary">
        <img src="~@/assets/logo_drive.png" class="pr-1 h-4">登入
      </app-button>
    </template>
  </setting-card>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import AppButton from '@/components/AppButton'
import AppCheckbox from '@/components/AppCheckbox'
import SettingCard from '@/components/SettingCard'

export default {
  name: 'Setting',
  components: { SettingCard, AppCheckbox, AppButton },
  computed: {
    ...mapState([
      'gamePath',
      'backupPath',
      'backupFolder',
      'googleDriveFolder',
      'isUploadToGoogleDrive',
      'isDeleteLocalFileAfterUpload',
      'googleToken'
    ]),
    ...mapGetters(['isBackupValidate']),
    hasGoogleApiClientId () {
      return !!process.env.VUE_APP_GOOGLE_CLIENT_ID
    }
  },
  created () {
    const code = this.$route.query.code || ''
    if (code) {
      window.ipcRenderer.invoke('google.auth.get-token', code)
        .then(tokens => {
          this.$store.commit('updateGoogleToken', tokens)
          this.$store.commit('updateIsUploadToGoogleDrive', true)
        }).finally(() => {
          this.$router.replace({ query: null })
        })
    }
  },
  methods: {
    selectFolderPath (type) {
      window.ipcRenderer.invoke('electron.show-open-dialog')
        .then(({ filePaths }) => {
          const path = filePaths.length ? filePaths[0] : ''
          if (type === 'game') {
            this.$store.commit('updateGamePath', path)
          } else {
            this.$store.commit('updateBackupPath', path)
          }
        })
    },
    backupFolderOnChange (key, value) {
      this.$store.commit('updateBackupFolder', { key, value })
    },
    isUploadToGoogleDriveOnChange (value) {
      this.$store.commit('updateIsUploadToGoogleDrive', value)
      if (!value) {
        this.$store.commit('updateIsDeleteLocalFileAfterUpload', false)
      }
    },
    googleSignIn () {
      window.ipcRenderer.invoke('google.auth.get-login-url')
        .then(authUrl => {
          window.location.href = authUrl
        })
    },
    googleSignOut () {
      this.$store.commit('updateGoogleToken', null)
      this.$store.commit('updateIsUploadToGoogleDrive', false)
      this.$store.commit('updateIsDeleteLocalFileAfterUpload', false)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
