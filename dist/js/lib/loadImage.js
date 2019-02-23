'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = _loadImage

function _loadImage(url, callback) {
  var image = new Image()
  image.src = url
  image.onload = callback
  return image
}
