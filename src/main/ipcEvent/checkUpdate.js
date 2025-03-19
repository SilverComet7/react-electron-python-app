import { autoUpdater } from 'electron-updater'
import { ipcMain } from 'electron'
// const log = require('electron-log');

autoUpdater.autoDownload = false
autoUpdater.setFeedURL({ provider: 'github', owner: 'SilverComet7', repo: 'react-electron-python-app' })

// 检查更新
autoUpdater.checkForUpdatesAndNotify()

autoUpdater.on('update-available', () => {
    console.log('Update available.')
})

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded; will install now')
    autoUpdater.quitAndInstall()
})


ipcMain.handle('get-version', async () => {
    console.log("get-version");
    return await { version: "1.1.0" }
})
