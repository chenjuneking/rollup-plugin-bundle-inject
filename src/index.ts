const fs: any = require('fs');
const path: any = require('path');

interface Options {
  target?: string,
}

export default function bundleInject(options: Options): object {
  console.log(options);
  let target: string = options.target
  target = path.resolve(__dirname, target)

  return {
    name: "rollup-plugin-bundle-inject",
    generateBundle(options: object = {}, bundle: object = {}) {
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
