const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const DIST = path.resolve(__dirname, "dist");
const SRC = path.resolve(__dirname, "src");
const ROOT = path.resolve(__dirname);
const SET = process.env.SET || "A";

console.info("[INFO] SET IS", SET);

const threadLoader = {
  loader: "thread-loader",
  options: {
    workers: 1
  }
};
const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: [
      ["@babel/preset-env", {modules: false}]
    ]
  }
};
const htmlLoader = {
  loader: 'html-loader',
  options: {
    minimize: true
  }
};
const tsLoader = {
  loader: "ts-loader",
  options: {
    transpileOnly: true,
    happyPackMode: true
  }
};

const isAOT = SET === "A";
const commonRules = [
  {
    test: /\.less$/,
    exclude: /node_modules/,
    use: [
      "style-loader",
      MiniCssExtractPlugin.loader,
      "css-loader",
      "less-loader"
    ]
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [threadLoader, babelLoader]
  },
  {
    test: /\.html$/,
    use: [htmlLoader]
  }
];
const commonPlugins = [
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css"
  }),
  new HtmlWebpackPlugin({"template": "index.html"}),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ContextReplacementPlugin(
    /@angular(\\|\/)core(\\|\/)esm5/,
    SRC,
  ),
];
const tsRulesMap = {
  A: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        babelLoader,
        '@ngtools/webpack'
      ]
    }
  ],
  B: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: ["awesome-typescript-loader", "angular2-template-loader"]
    }
  ],
  C: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [threadLoader, tsLoader, "angular2-template-loader"]
    }
  ]
};
const tsPluginsMap = {
  A: [
    new AotPlugin({
      tsConfigPath: "./tsconfig-aot.json",
      entryModule: "src/app.module#AppModule"
    })
  ],
  B: [],
  C: []
};

const tsRules = tsRulesMap[SET];
const tsPlugins = tsPluginsMap[SET];

module.exports = {
  mode: "development",

  context: SRC,

  entry: {
    "polyfills": "./polyfills.ts",
    "app": isAOT ? "./main-aot.ts" : "./main.ts",
  },

  output: {
    path: DIST,
    publicPath: "/"
  },

  resolve: {
    extensions: ['.ts', '.js', '.html'],
  },

  module: {
    rules: commonRules.concat(tsRules)
  },

  plugins: commonPlugins.concat(tsPlugins),

  devServer: {
    contentBase: DIST,
    port: 9000,
    hot: true,
    inline: true,
    compress: true
  }
}
