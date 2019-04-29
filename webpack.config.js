const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = function (dir) {
  return path.join(__dirname, dir)
}

const config = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
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

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'More Select',
        favicon: './public/favicon.ico',
        template: './public/index.html'
      })
    )
  } else if (argv.mode === 'production') {
    config.entry = {
      'more-select': './src/components/select/index.js'
    }
    config.externals = 'vue'
  }
  return config
}
