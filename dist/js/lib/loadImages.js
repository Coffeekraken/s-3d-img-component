'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = _loadImages

var _loadImage2 = _interopRequireDefault(require('./loadImage'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _loadImages(urls, callback) {
  var images = []
  var imagesToLoad = urls.length // Called each time an image finished loading.

  var onImageLoad = function onImageLoad() {
    imagesToLoad -= 1 // If all the images are loaded call the callback.

    if (imagesToLoad === 0) {
      callback(images)
    }
  }

  for (var ii = 0; ii < imagesToLoad; ii += 1) {
    var image = (0, _loadImage2.default)(urls[ii], onImageLoad)
    images.push(image)
  }
}
