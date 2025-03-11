import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { Counter } from './components/Counter'
import FileSelector from './components/FileSelector'
import TitleSetter from './components/TitleSetter'

// 创建根元素
const root = ReactDOM.createRoot(document.getElementById('root'))

// 渲染应用
const render = () => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <TitleSetter />
          <Counter />
          <FileSelector />
        </div>
      </Provider>
    </React.StrictMode>
  )
}

render()

// 优化后的 HMR 实现
import.meta.hot?.accept(['./renderer/**/*'], render)