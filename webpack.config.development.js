const { merge } = require('webpack-merge');
const path = require('path');

const config = require('./webpack.config');

module.exports = merge(config, {
    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        writeToDisk: true,
        disableHostCheck: true,
        https: false,
        public: '0.0.0.0:8080',
        port: '8080',
        host: '0.0.0.0',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
});
