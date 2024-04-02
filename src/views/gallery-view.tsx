import { PictureCard } from '@/components/gallery/picture-card'

const GalleryView = () => {
  return (
    <div className="flex flex-row flex-wrap gap-2 w-full mx-5 py-4">
      <PictureCard name="test.jpg" imageUrl="https://i.blogs.es/a3aea1/bocchi-the-rock/1366_2000.jpeg" />
      <PictureCard
        name="test.jpg"
        imageUrl="https://images.pexels.com/photos/957061/milky-way-starry-sky-night-sky-star-957061.jpeg?cs=srgb&dl=pexels-felix-mittermeier-957061.jpg&fm=jpg"
      />
      <PictureCard
        name="test.jpg"
        imageUrl="https://lh5.googleusercontent.com/proxy/OLXZFAIDVQRfnJyuk_xWs3QTb_S3Ewd4TdHWExgwPE_Bt5LgUmbIz7qxKtFVMkPffvGF0R_MyVw7NcLjURInK7r5YzOgJSl3WxUzVrCs2moKhE2JIgDQW0HvMG4Sa5A4QT6w0a4OxnRYsb-FH1o"
      />
    </div>
  )
}

export default GalleryView
