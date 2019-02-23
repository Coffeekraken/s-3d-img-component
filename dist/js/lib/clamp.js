'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = clamp

function clamp(number, lower, upper) {
  if (upper !== undefined) {
    number = number <= upper ? number : upper
  }

  if (lower !== undefined) {
    number = number >= lower ? number : lower
  }

  return number
}
