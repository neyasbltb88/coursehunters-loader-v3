const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const CustomHotUpdateStrategy = require('webpack-custom-hot-update-strategy');
const updateFetchEval = require('webpack-custom-hot-update-strategy/strategies/update/hotDownloadUpdateChunkFetchEval');

const NODE_ENV = process.env.NODE_ENV || 'development';

const clientConfig = require('./client.config');
const https = clientConfig.https === true ? true : false;
const host = clientConfig.host ? clientConfig.host : 'localhost';
const port = clientConfig.port ? clientConfig.port : 3000;
const publicPath = `${https ? 'https' : 'http'}://${host}:${port}/`;
const hot = clientConfig.hot === true ? true : false;
const hotOnly = clientConfig.hotOnly === true ? true : false;

config = {
    mode: NODE_ENV,
    context: path.resolve(__dirname, 'src'),

    entry: {
        'lessons-collector': './scripts/lessons-collector',
        'lessons-loader': './scripts/lessons-loader'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath
    },

    watch: NODE_ENV === 'development',
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port,
        https,
        hot: NODE_ENV === 'development' ? hot : false,
        hotOnly: NODE_ENV === 'development' ? hotOnly : false,

        writeToDisk: false,

        // clientLogLevel: 'warn',
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        },
        overlay: {
            warnings: true,
            errors: true
        },
        index: '',
        transportMode: {
            client: require.resolve('./hot/HotWebsocketClient'),
            server: 'ws'
        }
    },

    // devtool: NODE_ENV === 'development' ? 'eval-inline-source-map' : false,
    devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new CustomHotUpdateStrategy({
            update: updateFetchEval
        }),
        new VueLoaderPlugin(),
        new CopyPlugin([
            {
                from: './index.html',
                to: '../dist'
            },
            {
                from: './scripts/lessons-loader/fonts',
                to: '../dist/fonts'
            }
        ])
    ],

    module: {
        rules: [
            {
                test: /\.js$|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ['@babel/plugin-syntax-jsx'],
                            ['@babel/plugin-transform-react-jsx', { 'pragma': 'dom' }],
                            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                            ['@babel/plugin-proposal-private-methods', { loose: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            ['@babel/plugin-proposal-optional-chaining'],
                            ['@babel/plugin-proposal-nullish-coalescing-operator'],
                            ['@babel/plugin-proposal-logical-assignment-operators'],
                            ['@babel/plugin-proposal-numeric-separator']
                        ]
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    hotReload: true,
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                        // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentWidth=4' // <style lang="sass">
                    }
                }
            },
            {
                test: /\.txt$|\.png$|\.jpg$|\.jpeg$|\.svg$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['index.js', '.js', '*'],
        alias: {
            '^': path.resolve(__dirname, 'src/scripts/'),
            '@': path.resolve(__dirname)
        }
    }
};

module.exports = config;
