const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const resolve = function (dir) {
  return path.join(__dirname, dir)
}

module.exports = (env) => {
  const config = {
    entry: {
      app: './src/main.js'
    },
    output: {
      path: resolve('dist'),
      filename: '[name].min.js',
      library: 'more-select',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      modules: [
        resolve('node_modules'),
        resolve('src')
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: resolve('src'),
          use: 'vue-loader'
        },
        {
          test: /\.js$/,
          include: resolve('src'),
          use: 'babel-loader'
        },
        {
          test: /\.(css|scss)$/,
          use: [env.dev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    devServer: {
      compress: true,
      overlay: {
        warnings: true,
        errors: true
      },
      port: 9000,
      stats: 'errors-only'
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }

  if (env.dev) {
    config.mode = 'development'
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'More Select',
        favicon: './public/favicon.ico',
        template: './public/index.html'
      })
    )
  } else if (env.prod) {
    config.mode = 'production'
    config.entry = {
      'more-select': './src/components/select/index.js'
    }
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'more-select.css',
        chunkFilename: '[id].css',
      })
    )
    config.externals = 'vue'
  }

  return config
}
