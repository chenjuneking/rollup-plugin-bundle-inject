[npm]: https://img.shields.io/npm/v/rollup-plugin-bundle-inject
[npm-url]: https://www.npmjs.com/package/rollup-plugin-bundle-inject
[size]: https://packagephobia.now.sh/badge?p=rollup-plugin-bundle-inject
[size-url]: https://packagephobia.now.sh/result?p=rollup-plugin-bundle-inject

[![npm][npm]][npm-url]
[![size][size]][size-url]

# rollup-plugin-bundle-inject

🍣 Inject JS or CSS bundle into a template where necessary

## Install

Using npm:

```bash
npm install rollup-plugin-bundle-inject --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
const bundleInject = require("rollup-plugin-bundle-inject");

module.exports = {
  input: "./src/index.js",
  output: {
    dir: "./public/dist",
    format: "cjs",
  },
  plugins: [
    bundleInject({
      // specify the template
      target: "./public/index.html",
    }),
  ],
};
```

Once build successfully, an HTML file should be written to the bundle output destination.

## Options

### `target`

Type: `String`<br>
Default: `''`

Specifies the template.

\_Note: This field is required, it will throw an error if you don't specify a valid value.

## Example

By default, CSS bundle will inject into the end of the `<head>`, JS bundle will inject into the end of the `<body>`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Rollup bundle inject example</title>
    <meta charset="utf-8" />
    <style>
      /* Content of bundle.css will goes here */
    </style>
  </head>
  <body>
    <h1>Hello World!</h1>
    <script>
      /* Content of bundle.js will goes here */
    </script>
  </body>
</html>
```

you could decide where should be the bundle injected, by using the tag `<!-- inject:css -->` and `<!-- inject:js -->`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Rollup bundle inject example</title>
    <meta charset="utf-8" />
    <!-- inject:css -->
    <link type="text/css" rel="stylesheet" href="bootstrap.css" />
    <script src="jquery.js"></script>
    <!-- inject:js -->
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```
