import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import GyroNorm from 'gyronorm/dist/gyronorm.complete'
import Uniform from './lib/Uniform'
import Rect from './lib/Rect'
import _loadImages from './lib/loadImages'
import clamp from './lib/clamp'
import fragmentShader from './shaders/fragment'
import vertexShader from './shaders/vertex'

/**
 * Create a freaking cool fake 3D effect on any image using WebGL and some magic from this [Codrops article](https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/)
 *
 * @example    html
 * <s-3d-img src="my-cool-image.jpg" depth-src="my-cool-image.depth.jpg"></s-3d-img>
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https.//olivierbossel.com)
 * @see    https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/    Codrops article
 */
export default class S3dImgComponent extends SWebComponent {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {
      /**
       * Specify the source image to use
       * @prop
       * @type    {String}
       */
      src: null,

      /**
       * Specify the depth image to use
       * @prop
       * @type    {String}
       */
      depthSrc: null,

      /**
       * Specify the vertical threshold. Less is more mean that the lower is the number, the gigher is the effect
       * @prop
       * @type    {Number}
       */
      verticalThreshold: 15,

      /**
       * Specify the horizontal threshold. Less is more mean that the lower is the number, the gigher is the effect
       * @prop
       * @type    {Number}
       */
      horizontalThreshold: 15,

      /**
       * Specify if the effect is enabled or not.
       * @prop
       * @type    {Boolean}
       */
      enabled: true
    }
  }

  /**
   * Required props
   * @definition    SWebComponent.requiredProps
   * @protected
   */
  static get requiredProps() {
    return ['src', 'depthSrc']
  }

  /**
   * Physical props
   * @definition    SWebComponent.physicalProps
   * @protected
   */
  static get physicalProps() {
    return ['enabled']
  }

  /**
   * Css
   * @protected
   */
  static defaultCss(componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display : block;
      }
    `
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount() {
    super.componentWillMount()
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   * @protected
   */
  componentWillReceiveProp(name, newVal, oldVal) {
    super.componentWillReceiveProp(name, newVal, oldVal)
    switch (name) {
      case 'enabled':
        if (newVal) this._renderGl()
        break
      default:
    }
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   * @protected
   */
  componentMount() {
    super.componentMount()
    // create a canvas to work with
    this._$canvas = document.createElement('canvas')
    this._$canvas.width = '100%'
    this._$canvas.height = '100%'
    this.appendChild(this._$canvas)
    // get the webgl context
    this._gl =
      this._$canvas.getContext('webgl') ||
      this._$canvas.getContext('experimental-webgl')
    // get the pixel ratio of the device
    this._pixelRatio = window.devicePixelRatio
    // window size
    this._windowWidth = window.innerWidth
    this._windowHeight = window.innerHeight
    // mouse positions
    this._mouseX = 0
    this._mouseY = 0
    this._mouseTargetX = 0
    this._mouseTargetY = 0
    // textures
    this._textures = []
    // get the start time
    this._startTime = new Date().getTime() // Get start time for animating
    // create the scene
    this._createScene()
    // add images textures
    this._addTexture()
    // listen for mouse move
    this._mouseMove()
    // listen for gyroscope on mobile devices
    this._gyro()
  }

  /**
   * Add shader
   */
  _addShader(source, type) {
    const shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)
    const isCompiled = this._gl.getShaderParameter(
      shader,
      this._gl.COMPILE_STATUS
    )
    if (!isCompiled) {
      throw new Error(
        `Shader compile error: ${this._gl.getShaderInfoLog(shader)}`
      )
    }
    this._gl.attachShader(this._program, shader)
  }

  /**
   * Resize handler
   */
  _resizeHandler() {
    this._windowWidth = window.innerWidth
    this._windowHeight = window.innerHeight
    this._width = this.offsetWidth
    this._height = this.offsetHeight

    this._$canvas.width = this._width * this._pixelRatio
    this._$canvas.height = this._height * this._pixelRatio
    this._$canvas.style.width = `${this._width}px`
    this._$canvas.style.height = `${this._height}px`
    let a1
    let a2
    if (this._height / this._width < this._imageAspect) {
      a1 = 1
      a2 = this._height / this._width / this._imageAspect
    } else {
      a1 = (this._width / this._height) * this._imageAspect
      a2 = 1
    }
    this._uResolution.set(this._width, this._height, a1, a2)
    this._uRatio.set(1 / this._pixelRatio)
    this._uThreshold.set(
      this.props.horizontalThreshold,
      this.props.verticalThreshold
    )
    this._gl.viewport(
      0,
      0,
      this._width * this._pixelRatio,
      this._height * this._pixelRatio
    )
  }

  /**
   * Resize
   */
  _resize() {
    this._resizeHandler()
    window.addEventListener('resize', this._resizeHandler.bind(this))
  }

  /**
   * Create the scene
   */
  _createScene() {
    // create program
    this._program = this._gl.createProgram()
    // add shaders
    this._addShader(vertexShader, this._gl.VERTEX_SHADER)
    this._addShader(fragmentShader, this._gl.FRAGMENT_SHADER)
    // link and use program
    this._gl.linkProgram(this._program)
    this._gl.useProgram(this._program)
    // create fragment uniforms
    this._uResolution = new Uniform('resolution', '4f', this._program, this._gl)
    this._uMouse = new Uniform('mouse', '2f', this._program, this._gl)
    this._uTime = new Uniform('time', '1f', this._program, this._gl)
    this._uRatio = new Uniform('pixelRatio', '1f', this._program, this._gl)
    this._uThreshold = new Uniform('threshold', '2f', this._program, this._gl)
    // create position attrib
    this._billboard = new Rect(this._gl)
    this._positionLocation = this._gl.getAttribLocation(
      this._program,
      'a_position'
    )
    this._gl.enableVertexAttribArray(this._positionLocation)
    this._gl.vertexAttribPointer(
      this._positionLocation,
      2,
      this._gl.FLOAT,
      false,
      0,
      0
    )
  }

  /**
   * Add texture
   */
  _addTexture() {
    _loadImages([this.props.src, this.props.depthSrc], this._start.bind(this))
  }

  /**
   * Start
   */
  _start(images) {
    const that = this
    const gl = that._gl

    // connect images
    this._imageAspect = images[0].naturalHeight / images[0].naturalWidth
    for (let i = 0; i < images.length; i += 1) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

      // Upload the image into the texture.
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        images[i]
      )
      this._textures.push(texture)
    }

    // lookup the sampler locations.
    const uImage0Location = this._gl.getUniformLocation(this._program, 'image0')
    const uImage1Location = this._gl.getUniformLocation(this._program, 'image1')

    // set which texture units to render with.
    this._gl.uniform1i(uImage0Location, 0) // texture unit 0
    this._gl.uniform1i(uImage1Location, 1) // texture unit 1

    // Set each texture unit to use a particular texture.
    this._gl.activeTexture(this._gl.TEXTURE0)
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures[0])
    this._gl.activeTexture(this._gl.TEXTURE1)
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures[1])

    // start application
    this._resize()
    this._renderGl()
  }

  /**
   * Gyroscope
   */
  _gyro() {
    this._maxTilt = 15

    const gn = new GyroNorm()

    gn.init({
      gravityNormalized: true
    })
      .then(() => {
        gn.start(data => {
          const y = data.do.gamma
          const x = data.do.beta

          this._mouseTargetY =
            clamp(x, -this._maxTilt, this._maxTilt) / this._maxTilt
          this._mouseTargetX =
            -clamp(y, -this._maxTilt, this._maxTilt) / this._maxTilt
        })
      })
      .catch(() => {
        // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
      })
  }

  /**
   * Mouse move
   */
  _mouseMove() {
    document.addEventListener('mousemove', e => {
      const halfX = this._windowWidth / 2
      const halfY = this._windowHeight / 2
      this._mouseTargetX = (halfX - e.clientX) / halfX
      this._mouseTargetY = (halfY - e.clientY) / halfY
    })
  }

  /**
   * Render GL
   */
  _renderGl() {
    const now = new Date().getTime()
    const currentTime = (now - this._startTime) / 1000
    this._uTime.set(currentTime)
    // inertia
    this._mouseX += (this._mouseTargetX - this._mouseX) * 0.05
    this._mouseY += (this._mouseTargetY - this._mouseY) * 0.05

    this._uMouse.set(this._mouseX, this._mouseY)

    // render
    this._billboard.render(this._gl)

    if (!this.props.enabled) return
    requestAnimationFrame(this._renderGl.bind(this))
  }
}
