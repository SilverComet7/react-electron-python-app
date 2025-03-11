import { app, BrowserWindow, ipcMain, dialog,shell } from 'electron'
import path from 'path'
import { PythonShell } from 'python-shell'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取应用根目录
function getAppPath() {
    return  process.cwd()
}

// 获取 Python 路径的函数
function getPythonPath() {
    const appPath = getAppPath()
    const pythonPath = app.isPackaged
        ? path.join(appPath, 'resources', 'python-env', 'Scripts', 'python.exe')
        : path.join(appPath, 'python-env', 'Scripts', 'python.exe')

    console.log('Python Path:', pythonPath)
    return pythonPath
}

// 获取 Python 脚本路径
function getPythonScriptPath() {
    const appPath = getAppPath()
    return app.isPackaged
        ? path.join(appPath, 'resources', 'python')
        : path.join(appPath, 'python')
}

// 获取 Python 版本
function getPythonVersion() {
    try {
        const pythonPath = getPythonPath()
        const version = execSync(`"${pythonPath}" --version`).toString().trim()
        return version
    } catch (error) {
        console.error('Error getting Python version:', error)
        return 'Python not found'
    }
}

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

    // 打印版本信息
    console.log('Python Version:', getPythonVersion())
    console.log('Chromium Version:', process.versions.chrome)
    console.log('Node Version:', process.versions.node)

    
    // 创建运行 Python 脚本的函数
    function runPythonScript(scriptName, args = []) {
        // Python 脚本执行配置
        let options = {
            pythonPath: getPythonPath(),
            pythonOptions: ['-u'], // 无缓冲输出
            scriptPath: getPythonScriptPath(), // 使用正确的 Python 脚本路径
            mode: 'text'  // 使用文本模式
        }
        return new Promise((resolve, reject) => {
            const scriptOptions = { ...options, args }
            let pyshell = new PythonShell(scriptName, scriptOptions)
            
            let output = []
            let errors = []

            pyshell.on('message', function (message) {
                console.log('Python output:', message)
                output.push(message)
            })

            pyshell.on('stderr', function (stderr) {
                console.error('Python error:', stderr)
                errors.push(stderr)
            })

            pyshell.end(function (err, code, signal) {
                if (err) {
                    console.error('Python execution error:', err)
                    reject({ err, code, signal, errors })
                } else {
                    console.log('Python process finished with code:', code)
                    resolve({ output, code, signal })
                }
            })

            // 保存 pyshell 实例以便在应用退出时清理
            app.on('before-quit', () => {
                if (pyshell) {
                    pyshell.kill()
                }
            })
        })
    }

    // 测试运行 hello.py
    runPythonScript('hello.py')
        .then(result => {
            console.log('Python script execution successful:', result)
        })
        .catch(error => {
            console.error('Python script execution failed:', error)
        })

    // 处理打开目录对话框的请求
    ipcMain.handle('dialog:openDirectory', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })
        if (!canceled) {
            return filePaths[0]
        }
        return null
    })

    // 获取python版本和路径
    ipcMain.handle('get:python-info', async () => {
        try {
            const { output } = await runPythonScript('hello.py')
            return {
                version: getPythonVersion(),
                path: getPythonPath(),
                additionalInfo: output
            }
        } catch (error) {
            console.error('Error getting Python info:', error)
            return {
                version: getPythonVersion(),
                path: getPythonPath(),
                error: 'Failed to get additional Python information'
            }
        }
    })

    // 处理设置窗口标题的请求
    ipcMain.on('set:title', (_event, title) => {
        win.setTitle(title)
    })

    ipcMain.on('open-folder', (event, folderPath) => {
        console.log('open-folder', folderPath)
        if (folderPath) {
            shell
                .openPath(folderPath)
                .then(() => {
                    console.log('成功打开文件夹:', folderPath)
                })
                .catch((err) => {
                    console.error('打开文件夹失败:', err)
                })
        }
    })
    
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