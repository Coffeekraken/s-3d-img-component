function Rect(gl) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, Rect.verts, gl.STATIC_DRAW)
}

Rect.verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

Rect.prototype.render = function(gl) {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export default Rect
