import _loadImage from './loadImage'

export default function _loadImages(urls, callback) {
  const images = []
  let imagesToLoad = urls.length

  // Called each time an image finished loading.
  const onImageLoad = () => {
    imagesToLoad -= 1
    // If all the images are loaded call the callback.
    if (imagesToLoad === 0) {
      callback(images)
    }
  }

  for (let ii = 0; ii < imagesToLoad; ii += 1) {
    const image = _loadImage(urls[ii], onImageLoad)
    images.push(image)
  }
}
