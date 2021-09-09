const path = require('path');

var config = {
    entry: './src/scripts/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.resolve(__dirname, 'src')],
                use: 'ts-loader',
            }
        ]
    },
    output: {
        publicPath: 'public',
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'eval-source-map'
};

module.exports = (env, argv) => {

    if( argv.mode === 'development' ) {
      config.devtool = 'eval-source-map';
    }
    else if( argv.mode === 'production' ) {
        config.devtool = 'source-map';
    }

    return config;
};