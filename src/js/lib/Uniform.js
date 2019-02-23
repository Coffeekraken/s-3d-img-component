function Uniform(name, suffix, program, gl) {
  this.name = name
  this.suffix = suffix
  this._gl = gl
  this._program = program
  this.location = gl.getUniformLocation(program, name)
}

Uniform.prototype.set = function(...values) {
  const method = `uniform${this.suffix}`
  const args = [this.location].concat(values)
  this._gl[method].apply(this._gl, args)
}

export default Uniform
