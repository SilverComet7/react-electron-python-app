import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '../store/counterSlice'

export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>计数器示例 - HMR 测试</h2>
      <div style={{ fontSize: '24px', margin: '20px 0' }}>
        当前计数: {count}
      </div>
      <div>
        <button
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch(decrement())}
        >
          减少
        </button>
        <button
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => dispatch(increment())}
        >
          增加
        </button>
        
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>
        测试 HMR 功能，修改代码后，点击按钮，可以看到计数器自动更新。
      </p>
    </div>
  )
} 