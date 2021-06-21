const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const dist = path.resolve(__dirname, 'dist');

const config = {

    entry: {
        report: './src/report/report.tsx',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: dist,
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/**/*.html', to: dist, flatten: true },
            { from: 'src/**/*.css', to: dist, flatten: true },
            { from: 'node_modules/react/umd/react.production.min.js', to: dist + '/lib/react.js', type: 'file' },
            { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: dist + '/lib/react-dom.js', type: 'file' },
            { from: 'node_modules/chart.js/dist/Chart.min.js', to: dist + '/lib/Chart.min.js', type: 'file' },
            { from: 'node_modules/chart.js/dist/Chart.min.css', to: dist + '/lib/Chart.min.css', type: 'file' },
            { from: 'node_modules/milligram/dist/milligram.min.css', to: dist + '/lib/milligram.min.css', type: 'file' },
            { from: 'node_modules/normalize.css/normalize.css', to: dist + '/lib/normalize.css', type: 'file' },
        ]),
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "chart.js": "Chart",

        // when OpenLayers would come with a distribution library
        // in the npm package, we could map these prefixes... and
        // the build would be probably faster
        // "ol": "ol",
        // "ol/format": "ol.format",
        // "ol/layer": "ol.layer",
        // "ol/source": "ol.source",
        // "ol/style": "ol.style",

    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }
    return config;
};
