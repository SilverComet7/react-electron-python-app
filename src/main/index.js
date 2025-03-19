import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import { PythonShell } from 'python-shell'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)




const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/index.js')
        }
    })

    // 在开发环境中使用 ELECTRON_RENDERER_URL
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
        console.log('ELECTRON_RENDERER_URL:', process.env['ELECTRON_RENDERER_URL'])
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        // 确保开发者工具打开
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    return win
}

app.whenReady().then(async () => {
    // 安装开发工具扩展
    try {
        const extensions = [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]
        for (const extension of extensions) {
            const name = await installExtension(extension, {
                loadExtensionOptions: {
                    allowFileAccess: true,
                },
            })
            console.log(`扩展安装成功: ${name}`)
        }
    } catch (e) {
        console.log('扩展安装失败:', e)
    }

    const win = createWindow()

    await import('./ipcEvent')
    // 打印版本信息
    console.log('Python Version:', getPythonVersion())
    // console.log('Chromium Version:', process.versions.chrome)
    console.log('Node Version:', process.versions.node)



    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

   
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}) 