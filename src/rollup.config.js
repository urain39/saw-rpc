import { uglify } from 'rollup-plugin-uglify';

export default {
    input: 'test.js',
    output: {
        file: '../dist/test.bundle.js',
        format: 'umd',
        name: 'SAWRPC'
    },
    plugins: [
        uglify()
    ]
};
