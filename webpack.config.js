const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
const dirAssets = path.join(__dirname, 'assets');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';

module.exports = {
    entry: [
        path.join(dirApp, 'App.js'),
        path.join(dirStyles, 'main.scss'),
    ],

    resolve: {
        modules: [
            dirApp,
            dirAssets,
            dirStyles,
            dirNode,
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT,
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),

        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 8 }],
                ],
            },
        }),

        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets/images', to: 'images' },
            ],
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },

            {
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp|otf|ttf|ico)$/,
                loader: 'file-loader',
                options: {
                    name() {
                        return '[hash].[ext]';
                    },
                },
            },

            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                    },
                ],
            },
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
