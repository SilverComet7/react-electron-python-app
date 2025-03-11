import React, { useState } from 'react'

const TitleSetter = () => {
  const [title, setTitle] = useState('')

  const handleSetTitle = (e) => {
    e.preventDefault()
    if (title.trim()) {
      window.electronAPI.ipcRenderer.setTitle(title)
    }
  }

  return (
    <div className="title-setter">
      <form onSubmit={handleSetTitle}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入新的窗口标题"
          className="title-input"
        />
        <button type="submit" className="set-button">
          设置标题
        </button>
      </form>

      <style jsx>{`
        .title-setter {
          margin: 20px 0;
        }
        .title-input {
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 200px;
        }
        .set-button {
          padding: 8px 16px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .set-button:hover {
          background-color: #1976D2;
        }
      `}</style>
    </div>
  )
}

export default TitleSetter 