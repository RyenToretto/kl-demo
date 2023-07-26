## kl-demo

### Usage

```html
<script>
  ;(function (data) {
    window.__payload = data
    var script = document.createElement('script')
    script.src = 'https://static.ferngrowth.com/js/kl-demo.js?t=' + new Date().getTime()
    document.body.appendChild(script)
  })({
    x: 'https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9753471804235382827%22%7D&n_type=-1&p_from=-1'
  })
</script>
```

### dev

- [代码库](https://hn.devcloud.huaweicloud.com/codehub/project/7d347ae24ad64e0c84f9efd96923e043/codehub/7545620/home?ref=master)

```bash
git clone https://github.com/RyenToretto/kl-demo
cd kl-demo
npm i
npm start
```

### script

- `dev` - starts dev server
- `build` - generates the following bundles: CommonJS (`.cjs`) ESM (`.mjs`) and IIFE (`.iife.js`). The name of bundle is automatically taken from `package.json` name property
- `test` - starts vitest and runs all tests
- `test:coverage` - starts vitest and run all tests with code coverage report
- `lint:scripts` - lint `.ts` files with eslint
- `lint:styles` - lint `.css` and `.scss` files with stylelint
- `format:scripts` - format `.ts`, `.html` and `.json` files with prettier
- `format:styles` - format `.cs` and `.scss` files with stylelint
- `format` - format all with prettier and stylelint
- `prepare` - script for setting up husky pre-commit hook
- `uninstall-husky` - script for removing husky from repository

#### enjoy

- [Running Babel on the generated code](https://github.com/rollup/plugins/blob/master/packages/babel/README.md#running-babel-on-the-generated-code)
