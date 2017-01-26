import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  dest: 'lib/burette.js',
  format: 'cjs',
  sourceMap: 'inline',
  plugins: [
    eslint(),
    uglify()
  ],
};