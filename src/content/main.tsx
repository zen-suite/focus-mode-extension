import React from 'react'
import ReactDOM from 'react-dom'
import Content from './content'

const contentRoot = document.createElement('div')
contentRoot.id = 'zen-mode-content-root'
document.body.append(contentRoot)

ReactDOM.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>,
  contentRoot
)
