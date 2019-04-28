// import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {file: 'dist/index-cjs.js', format: 'cjs'},
    {file: 'dist/index.mjs', format: 'es'}
  ],
  plugins: [
    babel({
      // exclude: 'node_modules/**'
    })
  ]
}