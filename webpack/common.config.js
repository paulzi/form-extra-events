const path = require('path');

module.exports = () => { return {
    entry: {
        'form-extra-events': './standard.js',
        'form-extra-events-with-shims': './with-shims.js',
        'form-extra-events-register': './register.js',
        'form-extra-events-register-with-shims': './register-with-shims.js',
    },
    stats: {
        children: false,
        modules: false,
        entrypoints: false,
        hash: false,
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        library: 'FormExtraEvents',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }
                ]
            }
        ]
    },
}};