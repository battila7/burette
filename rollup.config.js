import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  dest: 'lib/burette.js',
  format: 'cjs',
  sourceMap: 'inline',
  plugins: [
    eslint(),
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ],
};