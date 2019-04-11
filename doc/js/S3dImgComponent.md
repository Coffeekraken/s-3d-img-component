# S3dImgComponent

Create a freaking cool fake 3D effect on any image using WebGL and some magic from this [Codrops article](https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/)

### Example

```html
<s-3d-img
  src="my-cool-image.jpg"
  depth-src="my-cool-image.depth.jpg"
></s-3d-img>
```

Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https.//olivierbossel.com](https.//olivierbossel.com)

See : **Codrops article** : [https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/](https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/)

Extends **SWebComponent**

## Attributes

Here's the list of available attribute(s).

### src

Specify the source image to use

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**

### depthSrc

Specify the depth image to use

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**

### autoSize

Set the size automatically depending on the source image size

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**

### verticalThreshold

Specify the vertical threshold. Less is more mean that the lower is the number, the higher is the effect

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **15**

### horizontalThreshold

Specify the horizontal threshold. Less is more mean that the lower is the number, the higher is the effect

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **15**

### enabled

Specify if the effect is enabled or not.

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**
