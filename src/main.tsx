import React from 'react'

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'
import { WallpaperManagerProvider } from './providers/wallpaper-manager'

import './styles.css'
import { ThemeProvider } from './components/theme/theme-provider'
import { ModalContainer } from './components/ui/modal'
import { Toaster } from './components/ui/toaster'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WallpaperManagerProvider>
        <RouterProvider router={router} />
        <ModalContainer />
        <Toaster />
      </WallpaperManagerProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
