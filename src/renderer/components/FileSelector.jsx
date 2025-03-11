import React, { useState } from 'react'

const FileSelector = () => {
  const [selectedPath, setSelectedPath] = useState('')

  const handleSelectDirectory = async () => {
    try {
      const path = await window.electronAPI.ipcRenderer.openDirectory()
      if (path) {
        setSelectedPath(path)
      }
    } catch (err) {
      console.error('选择目录时发生错误:', err)
    }
  }

  const handleSelectDirectoryTest =  () => {
    const path =  window.electronAPI.ipcRenderer.send('open-folder', "C:\\Users\\PC\\Downloads\\aimix_save")
    if (path) {
      setSelectedPath(path)
    }
  }

  const showPythonPath = async () => {
    const path = await window.electronAPI.ipcRenderer.invoke('get:python-info')
    console.log(path)
  }

  return (
    <div className="file-selector">
      <button 
        onClick={handleSelectDirectory}
        className="select-button"
      >
        选择目录
      </button>

      <button 
        onClick={handleSelectDirectoryTest}
        className="select-button"
      >
        选择目录测试
      </button>

      <button 
        onClick={showPythonPath}
        className="select-button"
      >
       获取python路径
      </button>


      {selectedPath && (
        <div className="selected-path">
          已选择目录: {selectedPath}
        </div>
      )}
      <style jsx>{`
        .file-selector {
          padding: 20px;
        }
        .select-button {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .select-button:hover {
          background-color: #45a049;
        }
        .selected-path {
          margin-top: 10px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
          word-break: break-all;
        }
      `}</style>
    </div>
  )
}

export default FileSelector 