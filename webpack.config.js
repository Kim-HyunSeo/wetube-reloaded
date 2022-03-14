const path = require("path");

module.exports = {
    // entry: source code
    entry: "./src/client/js/main.js",
    mode: "development", // <-> "production"
    output: {
        filename: "main.js",
        // __dirname: JS에서 제공하는 폴더까지의 절대 경로
        path: path.resolve(__dirname, "statics", "js"),
    },
    module: {
        rules: [
            {
                // 모든 JS 파일에 적용
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
        ],
    },
};
