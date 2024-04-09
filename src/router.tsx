import { createBrowserRouter } from 'react-router-dom'

import Root from '@/views/root'
import GalleryView from '@/views/gallery-view'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <GalleryView />,
      },
    ],
  },
])

export default router
