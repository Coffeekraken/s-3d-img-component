'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

function Uniform(name, suffix, program, gl) {
  this.name = name
  this.suffix = suffix
  this._gl = gl
  this._program = program
  this.location = gl.getUniformLocation(program, name)
}

Uniform.prototype.set = function() {
  var method = 'uniform'.concat(this.suffix)

  for (
    var _len = arguments.length, values = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    values[_key] = arguments[_key]
  }

  var args = [this.location].concat(values)

  this._gl[method].apply(this._gl, args)
}

var _default = Uniform
exports.default = _default
