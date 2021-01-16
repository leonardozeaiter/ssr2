const path = require("path");
const LoadablePlugin = require('@loadable/webpack-plugin');//@loadable/component
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//when webpack command is invoked, the unused bundles are automatically deleted

const config = {
    //tell webpack about the entry point js file
    entry: "./src/client/index-client.js",

    //tell webpack where to put the generated bundle
    output: {
      //filename: "bundle.js",
      path: path.resolve(__dirname, "public"), //__dirname is the directory where webpack exists which is the project's root folder
      filename: '[name].[chunkhash].js',
    },
      
    //the loaders
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
        },
      ],
    },

    //whenever any source file is changed, automatically regenerate the bundle
    watch: true, //or in package.json add --watch to the webpack command in the script

    //if "production" => bundle size is much smaller than if development (277Kb vs. 1.9 M.B.)
    //when in development, the larger files provide better debugging
    mode: "production",

    //devtool: "source-map",//in development mode, generate a source map to make debugging easier by debugging the original source files rather than the minimized bundle

    //bundle chunking
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks: 'initial',
      },
    },
    
    //@loadable/component
    plugins: [new LoadablePlugin(), new CleanWebpackPlugin()],
};

module.exports = config;