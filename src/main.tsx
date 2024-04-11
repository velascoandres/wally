import React from 'react'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'
import { WallpaperManagerProvider } from './providers/wallpaper-manager'

import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WallpaperManagerProvider>
      <RouterProvider router={router} />
    </WallpaperManagerProvider>
  </React.StrictMode>,
)
