const fs = require('fs');
const path = require('path');
const MagicString = require( 'magic-string' );

export default function bundleInject(options = {}) {
  console.log(options);
  console.log(MagicString)
  let { target, dist } = options
  target = path.resolve(__dirname, target)
  dist = path.resolve(__dirname, dist)

  return {
    name: "bundle-inject",
    generateBundle(options = {}, bundle = {}) {
      if (fs.statSync(target)) {
        let code = fs.readFileSync(target, { encoding: 'utf-8' })
        Object.keys(bundle).forEach(bundleName => {
          const REGEX = new RegExp(new RegExp("<!--\\s*inject:\\s*" + bundleName + "\\s*-->", "g"))
          const matches = code.match(REGEX)
          if (matches) {
            if (/\.css$/.test(bundleName)) {
              code = code.replace(REGEX, `
                <style>${bundle[bundleName].source}</style>
              `)
            } else if (/\.js/.test(bundleName)) {
              code = code.replace(REGEX, `
                <script>${bundle[bundleName].code}</script>
              `)
            }
          }
        })
        this.emitFile({ type: 'asset', fileName: 'file-injected.html', source: code })
      }
    },
  };
}
