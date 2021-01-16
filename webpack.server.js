const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");
const LoadablePlugin = require('@loadable/webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//when webpack command is invoked, the unused bundles are automatically deleted

const config = {
    //tell webpack the about the entry point js file
    entry: "./src/ssr/index-server.js",

    //tell webpack where to put the generated bundle
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "build"), //__dirname is the directory where webpack exists which is the project's root folder
    },

  module: {
    rules: [
      {
        test: /\.js?$/i,
        loader: "babel-loader", //installed in package.json
        exclude: /node_modules/, //do not run babel over those directories
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      }
    ],
  },

  //inform webpack that the generated bundle will target Node and not the default which is the browser; the generated bundle will run on Node
  //when we generate the client bundle, we'll keep the default target=browser because it'll run in the browser
  target: "node",

  //whenever any source file is changed, automatically regenerate the bundle
  watch: true, //or in package.json add --watch to the webpack command in the script

  //if "production" => bundle size is much smaller than if development (277Kb vs. 1.9 M.B.)
  //when in development, the larger files provide better debugging
  mode: "production",

  externals: [ webpackNodeExternals()], //order webpack not to bundle any library existing in node_modules in our server bundle

  //@lodable/component
  plugins: [new LoadablePlugin(), new CleanWebpackPlugin()],
};

module.exports = config;