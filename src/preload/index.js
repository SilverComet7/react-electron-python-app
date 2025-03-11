const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer: {
        ...ipcRenderer,
        openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
        setTitle: (title) => ipcRenderer.send('set:title', title)
    }
})
