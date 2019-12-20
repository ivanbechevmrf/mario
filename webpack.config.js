const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const path = require("path");
const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const devtool = devMode ? "cheap-module-eval-source-map" : "none";

const postcssLoaderPlugins = devMode
  ? [autoprefixer]
  : [
      autoprefixer,
      cssnano({
        preset: ["default", { normalizeUrl: false }]
      })
    ];

const config = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
    sourceMapFilename: "[name].[hash].map.js",
    publicPath: "/"
  },
  mode,
  devtool,
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: mode === "development"
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: "body"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: devMode ? "style-loader" : ExtractTextPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              indent: "postcss",
              plugins: postcssLoaderPlugins
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractTextPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.(eot|otf|woff|woff2|ttf)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "url-loader",
        options: {
          limit: 50000,
          prefix: "font",
          name: "[hash].[ext]",
          outputPath: "app/assets/fonts/"
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        exclude: /(node_modules|bower_components)/,
        loader: "url-loader",
        options: {
          limit: 50000,
          prefix: "image",
          name: "[hash].[ext]",
          outputPath: "app/assets/images/"
        }
      },
      {
        test: /\.svg$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      }
    ]
  },
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, "public"),
    port: 3000,
    historyApiFallback: true
  }
};

module.exports = config;
