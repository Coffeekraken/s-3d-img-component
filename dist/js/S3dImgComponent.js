'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0

var _SWebComponent2 = _interopRequireDefault(
  require('coffeekraken-sugar/js/core/SWebComponent')
)

var _gyronorm = _interopRequireDefault(
  require('gyronorm/dist/gyronorm.complete')
)

var _Uniform = _interopRequireDefault(require('./lib/Uniform'))

var _Rect = _interopRequireDefault(require('./lib/Rect'))

var _loadImages2 = _interopRequireDefault(require('./lib/loadImages'))

var _clamp = _interopRequireDefault(require('./lib/clamp'))

var _fragment = _interopRequireDefault(require('./shaders/fragment'))

var _vertex = _interopRequireDefault(require('./shaders/vertex'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call
  }
  return _assertThisInitialized(self)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return self
}

function _get(target, property, receiver) {
  if (typeof Reflect !== 'undefined' && Reflect.get) {
    _get = Reflect.get
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property)
      if (!base) return
      var desc = Object.getOwnPropertyDescriptor(base, property)
      if (desc.get) {
        return desc.get.call(receiver)
      }
      return desc.value
    }
  }
  return _get(target, property, receiver || target)
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object)
    if (object === null) break
  }
  return object
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }
  return _setPrototypeOf(o, p)
}

/**
 * Create a freaking cool fake 3D effect on any image using WebGL and some magic from this [Codrops article](https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/)
 *
 * @example    html
 * <s-3d-img src="my-cool-image.jpg" depth-src="my-cool-image.depth.jpg"></s-3d-img>
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https.//olivierbossel.com)
 * @see    https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/    Codrops article
 */
var S3dImgComponent =
  /*#__PURE__*/
  (function(_SWebComponent) {
    _inherits(S3dImgComponent, _SWebComponent)

    function S3dImgComponent() {
      _classCallCheck(this, S3dImgComponent)

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(S3dImgComponent).apply(this, arguments)
      )
    }

    _createClass(
      S3dImgComponent,
      [
        {
          key: 'componentWillMount',

          /**
           * Component will mount
           * @definition    SWebComponent.componentWillMount
           * @protected
           */
          value: function componentWillMount() {
            _get(
              _getPrototypeOf(S3dImgComponent.prototype),
              'componentWillMount',
              this
            ).call(this)
          }
          /**
           * Component will receive prop
           * @definition    SWebComponent.componentWillReceiveProp
           * @protected
           */
        },
        {
          key: 'componentWillReceiveProp',
          value: function componentWillReceiveProp(name, newVal, oldVal) {
            _get(
              _getPrototypeOf(S3dImgComponent.prototype),
              'componentWillReceiveProp',
              this
            ).call(this, name, newVal, oldVal)

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
        },
        {
          key: 'componentMount',
          value: function componentMount() {
            var _this = this

            _get(
              _getPrototypeOf(S3dImgComponent.prototype),
              'componentMount',
              this
            ).call(this) // load the base image to get his size

            var img = new Image()

            img.onload = function() {
              var imgRatio = img.height / img.width

              if (_this.props.autoSize) {
                _this.style.width = '100%'
                _this.style.height = _this.offsetWidth * imgRatio + 'px'
                window.addEventListener('resize', function(e) {
                  _this.style.height = _this.offsetWidth * imgRatio + 'px'
                })
              }

              _this._init()
            }

            img.src = this.props.src
          }
          /**
           * Init
           */
        },
        {
          key: '_init',
          value: function _init() {
            // create a canvas to work with
            this._$canvas = document.createElement('canvas')
            this._$canvas.width = '100%'
            this._$canvas.height = '100%'
            this.appendChild(this._$canvas) // get the webgl context

            this._gl =
              this._$canvas.getContext('webgl') ||
              this._$canvas.getContext('experimental-webgl') // get the pixel ratio of the device

            this._pixelRatio = window.devicePixelRatio // window size

            this._windowWidth = window.innerWidth
            this._windowHeight = window.innerHeight // mouse positions

            this._mouseX = 0
            this._mouseY = 0
            this._mouseTargetX = 0
            this._mouseTargetY = 0 // textures

            this._textures = [] // get the start time

            this._startTime = new Date().getTime() // Get start time for animating
            // create the scene

            this._createScene() // add images textures

            this._addTexture() // listen for mouse move

            this._mouseMove() // listen for gyroscope on mobile devices

            this._gyro()
          }
          /**
           * Add shader
           */
        },
        {
          key: '_addShader',
          value: function _addShader(source, type) {
            var shader = this._gl.createShader(type)

            this._gl.shaderSource(shader, source)

            this._gl.compileShader(shader)

            var isCompiled = this._gl.getShaderParameter(
              shader,
              this._gl.COMPILE_STATUS
            )

            if (!isCompiled) {
              throw new Error(
                'Shader compile error: '.concat(
                  this._gl.getShaderInfoLog(shader)
                )
              )
            }

            this._gl.attachShader(this._program, shader)
          }
          /**
           * Resize handler
           */
        },
        {
          key: '_resizeHandler',
          value: function _resizeHandler() {
            this._windowWidth = window.innerWidth
            this._windowHeight = window.innerHeight
            this._width = this.offsetWidth
            this._height = this.offsetHeight
            this._$canvas.width = this._width * this._pixelRatio
            this._$canvas.height = this._height * this._pixelRatio
            this._$canvas.style.width = ''.concat(this._width, 'px')
            this._$canvas.style.height = ''.concat(this._height, 'px')
            var a1
            var a2

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
        },
        {
          key: '_resize',
          value: function _resize() {
            this._resizeHandler()

            window.addEventListener('resize', this._resizeHandler.bind(this))
          }
          /**
           * Create the scene
           */
        },
        {
          key: '_createScene',
          value: function _createScene() {
            // create program
            this._program = this._gl.createProgram() // add shaders

            this._addShader(_vertex.default, this._gl.VERTEX_SHADER)

            this._addShader(_fragment.default, this._gl.FRAGMENT_SHADER) // link and use program

            this._gl.linkProgram(this._program)

            this._gl.useProgram(this._program) // create fragment uniforms

            this._uResolution = new _Uniform.default(
              'resolution',
              '4f',
              this._program,
              this._gl
            )
            this._uMouse = new _Uniform.default(
              'mouse',
              '2f',
              this._program,
              this._gl
            )
            this._uTime = new _Uniform.default(
              'time',
              '1f',
              this._program,
              this._gl
            )
            this._uRatio = new _Uniform.default(
              'pixelRatio',
              '1f',
              this._program,
              this._gl
            )
            this._uThreshold = new _Uniform.default(
              'threshold',
              '2f',
              this._program,
              this._gl
            ) // create position attrib

            this._billboard = new _Rect.default(this._gl)
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
        },
        {
          key: '_addTexture',
          value: function _addTexture() {
            ;(0, _loadImages2.default)(
              [this.props.src, this.props.depthSrc],
              this._start.bind(this)
            )
          }
          /**
           * Start
           */
        },
        {
          key: '_start',
          value: function _start(images) {
            var that = this
            var gl = that._gl // connect images

            this._imageAspect = images[0].naturalHeight / images[0].naturalWidth

            for (var i = 0; i < images.length; i += 1) {
              var texture = gl.createTexture()
              gl.bindTexture(gl.TEXTURE_2D, texture) // Set the parameters so we can render any size image.

              gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
              )
              gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
              )
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) // Upload the image into the texture.

              gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                images[i]
              )

              this._textures.push(texture)
            } // lookup the sampler locations.

            var uImage0Location = this._gl.getUniformLocation(
              this._program,
              'image0'
            )

            var uImage1Location = this._gl.getUniformLocation(
              this._program,
              'image1'
            ) // set which texture units to render with.

            this._gl.uniform1i(uImage0Location, 0) // texture unit 0

            this._gl.uniform1i(uImage1Location, 1) // texture unit 1
            // Set each texture unit to use a particular texture.

            this._gl.activeTexture(this._gl.TEXTURE0)

            this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures[0])

            this._gl.activeTexture(this._gl.TEXTURE1)

            this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures[1]) // start application

            this._resize()

            this._renderGl()
          }
          /**
           * Gyroscope
           */
        },
        {
          key: '_gyro',
          value: function _gyro() {
            var _this2 = this

            var gn = new _gyronorm.default()
            gn.init({
              gravityNormalized: true
            })
              .then(function() {
                gn.start(function(data) {
                  var y = data.do.gamma
                  var x = data.do.beta
                  _this2._mouseTargetY =
                    (0, _clamp.default)(
                      x,
                      -_this2.props.horizontalThreshold,
                      _this2.props.horizontalThreshold
                    ) / _this2.props.horizontalThreshold
                  _this2._mouseTargetX =
                    -(0, _clamp.default)(
                      y,
                      -_this2.props.verticalThreshold,
                      _this2.props.verticalThreshold
                    ) / _this2.props.verticalThreshold
                })
              })
              .catch(function() {
                // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
              })
          }
          /**
           * Mouse move
           */
        },
        {
          key: '_mouseMove',
          value: function _mouseMove() {
            var _this3 = this

            document.addEventListener('mousemove', function(e) {
              var halfX = _this3._windowWidth / 2
              var halfY = _this3._windowHeight / 2
              _this3._mouseTargetX = (halfX - e.clientX) / halfX
              _this3._mouseTargetY = (halfY - e.clientY) / halfY
            })
          }
          /**
           * Render GL
           */
        },
        {
          key: '_renderGl',
          value: function _renderGl() {
            var now = new Date().getTime()
            var currentTime = (now - this._startTime) / 1000

            this._uTime.set(currentTime) // inertia

            this._mouseX += (this._mouseTargetX - this._mouseX) * 0.05
            this._mouseY += (this._mouseTargetY - this._mouseY) * 0.05

            this._uMouse.set(this._mouseX, this._mouseY) // render

            this._billboard.render(this._gl)

            if (!this.props.enabled) return
            requestAnimationFrame(this._renderGl.bind(this))
          }
        }
      ],
      [
        {
          key: 'defaultCss',

          /**
           * Css
           * @protected
           */
          value: function defaultCss(componentName, componentNameDash) {
            return '\n      '.concat(
              componentNameDash,
              ' {\n        display : block;\n      }\n    '
            )
          }
        },
        {
          key: 'defaultProps',

          /**
           * Default props
           * @definition    SWebComponent.defaultProps
           * @protected
           */
          get: function get() {
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
               * Set the size automatically depending on the source image size
               * @prop
               * @type    {Boolean}
               */
              autoSize: true,

              /**
               * Specify the vertical threshold. Less is more mean that the lower is the number, the higher is the effect
               * @prop
               * @type    {Number}
               */
              verticalThreshold: 15,

              /**
               * Specify the horizontal threshold. Less is more mean that the lower is the number, the higher is the effect
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
        },
        {
          key: 'requiredProps',
          get: function get() {
            return ['src', 'depthSrc']
          }
          /**
           * Physical props
           * @definition    SWebComponent.physicalProps
           * @protected
           */
        },
        {
          key: 'physicalProps',
          get: function get() {
            return ['enabled']
          }
        }
      ]
    )

    return S3dImgComponent
  })(_SWebComponent2.default)

exports.default = S3dImgComponent
