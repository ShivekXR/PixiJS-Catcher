const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Path = require("path")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = (env, argv) => {
    return ({
        entry: Path.resolve(__dirname, "scripts/main.ts"),

        // Resolving imports in scripts
        resolve: {
            extensions: [
                ".ts",
                ".js",
            ],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: Path.resolve(__dirname, "tsconfig.json")
                }),
            ],
        },

        // Process assets
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: [Path.resolve(__dirname, "scripts")],
                    loader: "ts-loader",
                },
            ],
        },

        plugins: [
            // Process html template
            new HtmlWebpackPlugin({
                template: Path.resolve(__dirname, "templates/index.ejs"),
                hash: true,
                minify: true,
            }),

            // Copy asset bundles 
            new CopyPlugin({
                patterns: [{
                    from: Path.resolve(__dirname, "assets"),
                    to: Path.resolve(__dirname, "_compiled/assets"),
                }],
            }),

            // Bundle graph
            env.analyze ? new BundleAnalyzerPlugin() : undefined,
        ],

        output: {
            clean: true,
            path: Path.resolve(__dirname, "_compiled"),
            filename: "main.js",
        },

        // No matter what, the bundled script will be big - so disable the annoying tips.
        // TODO: 1. Check possibility to change performance.maxAssetSize and performance.hints
        // per tested file type (.js, .png, etc) in performance.assetFilter function.
        performance: { hints: false },

        stats: argv.mode === "development" ? "minimal" : "normal",
        devtool: argv.mode === "development" ? "eval-source-map" : undefined,

        devServer: {
            host: "0.0.0.0",
            port: 8080,
            client: {
                logging: "warn",
                overlay: {
                    errors: true,
                    runtimeErrors: true,
                    warnings: true,
                },
            },
            static: false,
        },
    })
}
