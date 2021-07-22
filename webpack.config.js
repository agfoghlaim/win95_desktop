const HtmlWebpackPlugin = require('html-webpack-plugin'); 


module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: __dirname + '/.netlify/build'
  },
  mode: "development",
  module: {
    
    rules: [
      {
      test: /\.html$/,
      use: [ {
        loader: 'html-loader',
        options: {minimize: true}
      }],
      },
      {
        test: /\.css$/i,
        use: ['style-loader','css-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.(png|ico|svg|jpg)$/,
        use: [ 
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash].[ext]',
              esModule:false
            },
          },
        ],
        
      },
      
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', 
      filename: './index.html',
      scriptLoading: 'blocking'
    })
  ]
}

