import { ipcRenderer } from 'electron'
import zipdir from 'zip-dir'

window.ipcRenderer = ipcRenderer
window.zipdir = zipdir
