<template>
  <div class="h-full backup">
    <div class="notification-section">
      <div v-if="notification.text" class="notification" :class="notification.status">
        {{ notification.text }}
      </div>
    </div>
    <div class="flex justify-center items-center button-section">
      <app-button @click="confirmOnClick" class="is-primary" :disabled="isLoading">
        開始備份
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppButton from '@/components/AppButton'
import { format as dateFormat, differenceInSeconds } from 'date-fns'

export default {
  name: 'Backup',
  components: { AppButton },
  props: {
    isLoading: Boolean
  },
  data () {
    return {
      notification: {
        text: '',
        status: ''
      }
    }
  },
  computed: {
    ...mapState([
      'gamePath',
      'backupPath',
      'backupFolder',
      'googleDriveFolder',
      'isUploadToGoogleDrive',
      'isDeleteLocalFileAfterUpload',
      'googleToken'
    ])
  },
  methods: {
    async confirmOnClick () {
      const startTime = new Date()
      this.$emit('update:is-loading', true)
      this.notification.text = '備份進行中，請勿關閉視窗'
      this.notification.status = 'is-warning'
      const zipFilename = `wow-addons-backup_${dateFormat(new Date(), 'yyyy-MM-dd-HHmmss')}.zip`
      const zipFullPath = `${this.backupPath}/${zipFilename}`

      try {
        await window.zipdir(this.gamePath, {
          saveTo: zipFullPath,
          filter: path => {
            let pathMatch = /_retail_$/.test(path)
            if (this.backupFolder.wtf) {
              pathMatch = pathMatch || /WTF/.test(path)
            }
            if (this.backupFolder.addon) {
              pathMatch = pathMatch || /Interface$/.test(path) || /Interface(\/|\\)AddOns/.test(path)
            }
            return pathMatch
          }
        })

        if (this.isUploadToGoogleDrive) {
          try {
            await window.ipcRenderer.invoke('google.drive.upload-file', {
              googleToken: this.googleToken,
              parent: this.googleDriveFolder.id,
              isDeleteLocalFileAfterUpload: this.isDeleteLocalFileAfterUpload,
              zipFilename,
              zipFullPath
            })

            this.notification.text =
              `備份成功，用時${differenceInSeconds(new Date(), startTime)}秒，${zipFilename}`
            this.notification.status = 'is-success'
          } catch (err) {
            this.notification.text = err
            this.notification.status = 'is-danger'
          }
        } else {
          this.notification.text =
            `備份成功，用時${differenceInSeconds(new Date(), startTime)}秒，${zipFilename}`
          this.notification.status = 'is-success'
        }
      } catch (err) {
        this.notification.text = err
        this.notification.status = 'is-danger'
      } finally {
        this.$emit('update:is-loading', false)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.backup
  .notification-section
    height: 64px
  .button-section
    height: calc(100% - 88px)
</style>
