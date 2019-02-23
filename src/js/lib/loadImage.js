export default function _loadImage(url, callback) {
  const image = new Image()
  image.src = url
  image.onload = callback
  return image
}
