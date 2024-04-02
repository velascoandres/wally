import { createBrowserRouter } from 'react-router-dom'

import Root from '@/views/root'
import GalleryView from '@/views/gallery-view'
import PlaylistView from '@/views/playlist-view'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <GalleryView />,
      },
      {
        path: '/playlist',
        element: <PlaylistView />,
      },
    ],
  },
])

export default router
