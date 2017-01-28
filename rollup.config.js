import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'src/index.js',
  dest: 'lib/burette.js',
  format: 'cjs',
  sourceMap: 'inline',
  plugins: [
    eslint(),
     babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ],
};