import babel from 'rollup-plugin-babel'
import string from 'rollup-plugin-string'

console.log()

export default {
  entry: 'modules/index.js',
  format: 'umd',
  moduleName: 'ChromeBridge',
  dest: process.env.BUILD_TYPE === 'es5'
    ? 'dist/chrome-bridge.es5.js'
    : 'dist/chrome-bridge.es6.js',
  plugins: [
    string({
      include: 'modules/runtime.js',
    }),
    ...(
      process.env.BUILD_TYPE === 'es5'
      ? [babel()]
      : []
    ),
  ],
}
