<template>
  <div class="relative restore">
    <div class="mb-4 notification" :class="notification.status">
      {{ notification.text }}
    </div>
    <div class="flex">
      <div class="w-1/2 menu">
        <p class="font-bold">本地還原檔</p>
        <ul class="menu-list">
          <li v-for="file in localFiles"
              :key="file"
              @click="fileOnClick('local', file)">
            <a class="select-none" :class="{ 'is-active': selectedFile.local === file}">
              {{ file }}
            </a>
          </li>
        </ul>
      </div>
      <div class="w-1/2 menu">
        <p class="font-bold">遠端還原檔</p>
        <ul class="menu-list">
          <li v-for="file in googleDriveFiles"
              :key="file.id"
              @click="fileOnClick('googleDrive', file)">
            <a class="select-none"
               :class="{ 'is-active': selectedFile.googleDrive === file}">
              {{ file.name }}
            </a>
          </li>
        </ul>
      </div>
      <div class="absolute bottom-0 left-0 p-4 w-full text-right bg-gray-200">
        <app-button class="is-primary" :disabled="isLoading" @click="confirmOnClick">確認</app-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppButton from '@/components/AppButton'
import { differenceInSeconds } from 'date-fns'

export default {
  name: 'Restore',
  components: { AppButton },
  props: {
    isLoading: Boolean
  },
  data () {
    return {
      localFiles: [],
      googleDriveFiles: [],
      selectedFile: {
        local: '',
        googleDrive: null
      },
      notification: {
        text: '請選擇檔案',
        status: 'is-info'
      }
    }
  },
  computed: {
    ...mapState(['backupPath', 'gamePath', 'googleDriveFolder', 'googleToken'])
  },
  created () {
    if (this.googleToken) {
      window.ipcRenderer.invoke('google.drive.get-files', {
        googleToken: this.googleToken,
        params: {
          q: `mimeType = 'application/zip'
              and name contains 'wow-addons-backup'
              and '${this.googleDriveFolder.id}' in parents
              and trashed = false`,
          orderBy: 'name desc'
        }
      }).then(files => {
        this.googleDriveFiles = files
      })
    }
    this.fetchLocalFiles()
  },
  methods: {
    fetchLocalFiles () {
      window.ipcRenderer.invoke('node.get-dir-files', this.backupPath)
        .then(files => {
          this.localFiles = files
            .filter(file => (/^wow-addons-backup.*.zip$/.test(file)))
            .sort()
            .reverse()
        })
        .catch(err => {
          this.notification.text = err
          this.notification.status = 'is-danger'
        })
    },
    fileOnClick (type, file) {
      if (this.isLoading) return

      if (type === 'local') {
        this.selectedFile.local = file
        this.selectedFile.googleDrive = null
      } else {
        this.selectedFile.googleDrive = file
        this.selectedFile.local = ''
      }
    },
    async confirmOnClick () {
      const startTime = new Date()
      this.$emit('update:is-loading', true)
      this.notification.text = '還原進行中，請勿關閉視窗'
      this.notification.status = 'is-warning'

      if (this.googleToken && this.selectedFile.googleDrive) {
        try {
          await window.ipcRenderer.invoke('google.drive.download-file', {
            backupPath: this.backupPath,
            googleToken: this.googleToken,
            file: this.selectedFile.googleDrive
          })
        } catch (err) {
          this.notification.text = err
          this.notification.status = 'is-danger'
          this.$emit('update:is-loading', false)
          return
        }
      }

      try {
        await window.ipcRenderer.invoke('extract-zip.extract', {
          startTime,
          backupPath: this.backupPath,
          zipFileName: this.selectedFile.local || this.selectedFile.googleDrive.name,
          gamePath: this.gamePath
        })
        this.notification.text = `還原成功，用時${differenceInSeconds(new Date(), startTime)}秒`
        this.notification.status = 'is-success'
      } catch (err) {
        this.notification.text = err
        this.notification.status = 'is-danger'
      }
      this.$emit('update:is-loading', false)
      this.fetchLocalFiles()
    }
  }
}
</script>

<style lang="sass" scoped>
.restore
  height: calc(100vh - 56px)

  .menu-list
    height: 330px
    overflow-y: auto
</style>
