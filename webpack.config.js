var path = require('path');
 var webpack = require('webpack');

 module.exports = {
     entry: 'public/appQuiz.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'appQuiz.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };