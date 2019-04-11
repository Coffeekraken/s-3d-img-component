module.exports = {
  // server port
  port: 3000,

  // title
  title: 's-3d-img-component',

  // layout
  layout: 'right',

  // compile server
  compileServer: {
    // compile server port
    port: 4000
  },

  // editors
  editors: {
    html: {
      language: 'html',
      data: `
        <div class="container">
          <s-3d-img src="/demo/data/mount.jpg" depth-src="/demo/data/mount-map.jpg" auto-size="false" vertical-threshold="15" horizontal-threshold="15"></s-3d-img>

          <div class="metas">
            <h1 class="h1 m-b">
              Aenean diam mi.
            </h1>
            <p class="p m-b">
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ut dolor sapien. Sed laoreet ante quam, quis rutrum ligula porta nec. Aliquam consequat quam in.
            </p>
            <a class="btn btn--primary">Etiam luctus arcu.</a>
          </div>
        </div>
      `
    },
    css: {
      language: 'scss',
      data: `
        @import 'node_modules/coffeekraken-sugar/index';
        @import 'node_modules/coffeekraken-s-button-component/index';;
        @import 'node_modules/coffeekraken-s-typography-component/index';

        @include s-setup(());
        @include s-init();
        @include s-classes();

        @include s-typography-classes();
        @include s-button-classes();

        body {
        }

        .container {
          @include s-fit(fixed);

          s-3d-img {
            @include s-fit(absolute);
          }
        }
          .metas {
            @include s-position(absolute, middle, center);
            color: white;
            width: 100%;
            max-width: 400px;
            text-align: center;
            text-shadow: rgba(0,0,0,.3) 0 0 20px;
          }
      `
    },
    js: {
      language: 'js',
      data: `
        import S3dImgComponent from './dist/index'
      `
    }
  }
}
