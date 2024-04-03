import { Play } from 'lucide-react'

import { PictureCard } from '@/components/gallery/picture-card'
import { Button } from '@/components/ui/button'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'

interface Picture {
  id: string
  name: string
  url: string
}

const pictures: Picture[] = [
  {
    id: '1',
    name: 'test.jpg',
    url: 'https://i.blogs.es/a3aea1/bocchi-the-rock/1366_2000.jpeg',
  },
  {
    id: '2',
    name: 'test.jpg',
    url: 'https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?cs=srgb&dl=pexels-felix-mittermeier-957061.jpg&fm=jpg',
  },
  {
    id: '3',
    name: 'test.jpg',
    url: 'https://lh5.googleusercontent.com/proxy/OLXZFAIDVQRfnJyuk_xWs3QTb_S3Ewd4TdHWExgwPE_Bt5LgUmbIz7qxKtFVMkPffvGF0R_MyVw7NcLjURInK7r5YzOgJSl3WxUzVrCs2moKhE2JIgDQW0HvMG4Sa5A4QT6w0a4OxnRYsb-FH1o',
  },
]

const PlaylistView = () => {
  const [parent, images] = useDragAndDrop<HTMLUListElement, Picture>(pictures)

  return (
    <section className="flex flex-col items-center h-full gap-2">
      <Button>
        <Play className="w-5" /> Start playlist
      </Button>
      <ul ref={parent} className="inline-flex flex-row flex-wrap justify-center items-center gap-2">
        {images.map((image, index) => (
          <li key={image.id} className="cursor-move relative">
            <span className="px-2 rounded-full border border-border bg-emerald-500 text-white absolute top-1 left-1 z-50">
              {index + 1}
            </span>
            <PictureCard name={image.name} imageUrl={image.url} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PlaylistView
