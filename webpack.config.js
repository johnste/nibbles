module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/, // include .js files
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
              test: /\.js?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel'
            },
            {
                test: /\.json/,
                loader: "json-loader"
            },
        ]
    },
    resolve: {
        alias: {

        }
    },

    // Enable source maps
    devtool: 'source-map',
    jshint: {
        esnext: true,
        node: true, // Do not warn about activating strict mode globally in files
        browser: true,
        devel: true
    },
    node: {
        fs: "empty"
    },
};