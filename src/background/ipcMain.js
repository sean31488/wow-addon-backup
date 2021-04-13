import { ipcMain, dialog } from 'electron'
import { google } from 'googleapis'
import fs from 'fs-extra'
import extractZip from 'extract-zip'

ipcMain.handle('electron.show-open-dialog', () => {
  return dialog.showOpenDialog({ properties: ['openDirectory'] })
})

ipcMain.handle('google.auth.get-login-url', () => {
  const auth = getGoogleAuth()
  const authUrl = auth.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/drive'
    ]
  })
  return Promise.resolve(authUrl)
})

ipcMain.handle('google.auth.get-token', (event, code) => {
  const auth = getGoogleAuth()
  return auth.getToken(code).then(({ tokens }) => {
    return Promise.resolve(tokens)
  }).catch(err => {
    return Promise.reject(err)
  })
})

ipcMain.handle('google.drive.get-files', (event, args) => {
  const { googleToken, params } = args
  const drive = initGoogleDrive(googleToken)

  return drive.files.list(params)
    .then(({ data }) => {
      const files = data.files.map(file => {
        file.node = null
        file.isFold = true
        return file
      })
      return Promise.resolve(files)
    })
    .catch(err => {
      return Promise.reject(err)
    })
})

ipcMain.handle('google.drive.upload-file', (event, args) => {
  const {
    googleToken,
    parent,
    isDeleteLocalFileAfterUpload,
    zipFilename,
    zipFullPath
  } = args

  const drive = initGoogleDrive(googleToken)
  const fileMetadata = {
    name: zipFilename,
    parents: [parent]
  }
  const media = {
    body: fs.createReadStream(zipFullPath),
    fields: 'id'
  }

  return drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }).then(() => {
    if (isDeleteLocalFileAfterUpload) {
      fs.removeSync(zipFullPath)
    }
    return Promise.resolve()
  }).catch(err => {
    return Promise.reject(err)
  })
})

ipcMain.handle('google.drive.download-file', (event, args) => {
  const { backupPath, googleToken, file } = args
  const drive = initGoogleDrive(googleToken)
  const filePath = `${backupPath}/${file.name}`

  return drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'stream' }
  ).then(res => {
    return new Promise((resolve, reject) => {
      fs.removeSync(filePath)
      const dest = fs.createWriteStream(filePath)
      // let progress = 0

      res.data.on('end', () => {
        resolve(filePath)
      }).on('error', err => {
        reject(err)
      }).on('data', d => {
        // progress += d.length
      }).pipe(dest)
    })
  })
})

ipcMain.handle('node.get-dir-files', (event, path) => {
  try {
    const files = fs.readdirSync(path)
    return Promise.resolve(files)
  } catch (err) {
    return Promise.reject(err)
  }
})

ipcMain.handle('extract-zip.extract', (event, args) => {
  const { backupPath, zipFileName, gamePath } = args

  const tempDir = `${backupPath}/wow-addons-backup-temp`
  fs.emptyDirSync(tempDir)

  return extractZip(`${backupPath}/${zipFileName}`, { dir: tempDir })
    .then(() => {
      if (fs.existsSync(`${tempDir}/_retail_/WTF`)) {
        fs.moveSync(
          `${tempDir}/_retail_/WTF`,
          `${gamePath}/_retail_/WTF`,
          { overwrite: true }
        )
      }

      if (fs.existsSync(`${tempDir}/_retail_/Interface/AddOns`)) {
        fs.moveSync(
          `${tempDir}/_retail_/Interface/AddOns`,
          `${gamePath}/_retail_/Interface/AddOns`,
          { overwrite: true }
        )
      }

      fs.removeSync(tempDir)
      return Promise.resolve()
    }).catch(err => {
      return Promise.reject(err)
    })
})

function getGoogleAuth () {
  return new google.auth.OAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    'http://127.0.0.1/google-auth'
  )
}

function initGoogleDrive (googleToken) {
  const auth = getGoogleAuth()
  auth.setCredentials(googleToken)
  return google.drive({ version: 'v3', auth })
}
