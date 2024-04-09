import React from 'react'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'
import { WallpaperProvider } from './providers/wallpaper-provider'

import './styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WallpaperProvider>
      <RouterProvider router={router} />
    </WallpaperProvider>
  </React.StrictMode>,
)
