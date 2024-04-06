import { Button } from '@/components/ui/button'
import { SearchBox } from '@/components/ui/search-box'
import { invoke } from '@tauri-apps/api'

const GalleryView = () => {
  const change_path = async () => {
    await invoke('change_dir', { dir: '/Users/andresvelasco/Documents/pictures/wallpapers' })
  }

  return (
    <div className="flex flex-col gap-2">
      <header className="sticky top-0 z-50 bg-background/40 backdrop-blur-md">
        <SearchBox placeholder="Search in gallery" onSearch={() => null} />
      </header>
      <div className="flex flex-row flex-wrap gap-2 mx-5 py-4 justify-center">
        <Button onClick={change_path}>Change path</Button>
        {/* <PictureCard
          isDesktopPicture
          name="test.jpg"
          imageUrl="https://i.blogs.es/a3aea1/bocchi-the-rock/1366_2000.jpeg"
        />
        <PictureCard
          name="test.jpg"
          imageUrl="https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?cs=srgb&dl=pexels-felix-mittermeier-957061.jpg&fm=jpg"
        />
        <PictureCard
          inPlaylist
          name="test.jpg"
          imageUrl="https://lh5.googleusercontent.com/proxy/OLXZFAIDVQRfnJyuk_xWs3QTb_S3Ewd4TdHWExgwPE_Bt5LgUmbIz7qxKtFVMkPffvGF0R_MyVw7NcLjURInK7r5YzOgJSl3WxUzVrCs2moKhE2JIgDQW0HvMG4Sa5A4QT6w0a4OxnRYsb-FH1o"
        />
        <PictureCard
          isDesktopPicture
          name="test.jpg"
          imageUrl="https://i.blogs.es/a3aea1/bocchi-the-rock/1366_2000.jpeg"
        />
        <PictureCard
          name="test.jpg"
          imageUrl="https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?cs=srgb&dl=pexels-felix-mittermeier-957061.jpg&fm=jpg"
        />
        <PictureCard
          inPlaylist
          name="test.jpg"
          imageUrl="https://lh5.googleusercontent.com/proxy/OLXZFAIDVQRfnJyuk_xWs3QTb_S3Ewd4TdHWExgwPE_Bt5LgUmbIz7qxKtFVMkPffvGF0R_MyVw7NcLjURInK7r5YzOgJSl3WxUzVrCs2moKhE2JIgDQW0HvMG4Sa5A4QT6w0a4OxnRYsb-FH1o"
        />
        <PictureCard
          isDesktopPicture
          name="test.jpg"
          imageUrl="https://i.blogs.es/a3aea1/bocchi-the-rock/1366_2000.jpeg"
        />
        <PictureCard
          name="test.jpg"
          imageUrl="https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?cs=srgb&dl=pexels-felix-mittermeier-957061.jpg&fm=jpg"
        />
        <PictureCard
          inPlaylist
          name="test.jpg"
          imageUrl="https://lh5.googleusercontent.com/proxy/OLXZFAIDVQRfnJyuk_xWs3QTb_S3Ewd4TdHWExgwPE_Bt5LgUmbIz7qxKtFVMkPffvGF0R_MyVw7NcLjURInK7r5YzOgJSl3WxUzVrCs2moKhE2JIgDQW0HvMG4Sa5A4QT6w0a4OxnRYsb-FH1o"
        /> */}
      </div>
    </div>
  )
}

export default GalleryView
