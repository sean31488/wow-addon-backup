import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    gamePath: '',
    backupPath: '',
    backupFolder: {
      wtf: true,
      addon: true
    },
    googleDriveFolder: {
      id: '',
      name: ''
    },
    isUploadToGoogleDrive: false,
    isDeleteLocalFileAfterUpload: false,
    googleToken: null
  },
  mutations: {
    updateGamePath (state, payload) {
      state.gamePath = payload
    },
    updateBackupPath (state, payload) {
      state.backupPath = payload
    },
    updateBackupFolder (state, { key, value }) {
      state.backupFolder[key] = value
    },
    updateGoogleDriveFolder (state, payload) {
      state.googleDriveFolder = payload
    },
    updateIsUploadToGoogleDrive (state, payload) {
      state.isUploadToGoogleDrive = payload
    },
    updateIsDeleteLocalFileAfterUpload (state, payload) {
      state.isDeleteLocalFileAfterUpload = payload
    },
    updateGoogleToken (state, payload) {
      state.googleToken = payload
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isBackupValidate (state) {
      const hasBackupFolder = Object.values(state.backupFolder).some(value => value)
      return state.gamePath && state.backupPath && hasBackupFolder
    }
  }
})
