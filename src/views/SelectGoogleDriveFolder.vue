<template>
  <div class="relative select-google-drive-folder menu">
    <div class="overflow-y-auto tree-view">
      <ul class="menu-list">
        <li>
          <a @click="rootFolderOnClick"
             :class="{ 'is-active': googleDriveFolder.id === 'root' }"
             class="select-none">- 根目錄</a>
        </li>
      </ul>
      <tree-view
        :items="rootFolders"
        :active-item-id="googleDriveFolder.id"
        class="pl-5"
        @google-drive-folder-on-change="googleDriveFolder = $event"></tree-view>
    </div>
    <div class="absolute top-0 right-0 m-4 notification is-info">
      <ul class="pl-5 list-disc">
        <li>滑鼠單擊選擇目錄</li>
        <li>滑鼠雙擊展開</li>
      </ul>
    </div>
    <div class="absolute bottom-0 left-0 p-4 w-full text-right bg-gray-200">
      <app-button class="is-primary" @click="selectGoogleDriveFolderOnConfirm">確認</app-button>
      <router-link :to="{ name: 'Setting' }">
        <app-button class="ml-2 is-outlined">取消</app-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TreeView from '../components/TreeView'
import AppButton from '../components/AppButton'

export default {
  name: 'SelectGoogleDriveFolder',
  components: { AppButton, TreeView },
  data () {
    return {
      token: [],
      rootFolders: [],
      googleDriveFolder: {
        id: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapState(['googleToken'])
  },
  created () {
    window.ipcRenderer.invoke('google.drive.get-files', {
      googleToken: this.googleToken,
      params: {
        q: `mimeType = 'application/vnd.google-apps.folder'
              and 'root' in parents
              and trashed = false`
      }
    }).then(files => {
      this.rootFolders = files
    })
  },
  methods: {
    rootFolderOnClick () {
      this.googleDriveFolder.id = 'root'
      this.googleDriveFolder.name = '根目錄'
    },
    selectGoogleDriveFolderOnConfirm () {
      this.$store.commit('updateGoogleDriveFolder', this.googleDriveFolder)
      this.$router.push({ name: 'Setting' })
    }
  }
}
</script>

<style lang="sass" scoped>
.select-google-drive-folder
  height: calc(100vh - 56px)

  .tree-view
    max-height: calc(100% - 56px)
</style>
