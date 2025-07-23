const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './demo/demo.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/index.html',
            title: 'ThreatLoom - CTI Fusion Hub Demo',
        }),
    ],
    devServer: {
        port: 8080,
        hot: true,
        open: false,
        historyApiFallback: true,
        client: {
            logging: 'none',
            overlay: {
                errors: true,
                warnings: false,
            },
            webSocketTransport: 'ws',
        },
        devMiddleware: {
            stats: 'none',
        },
        setupMiddlewares: (middlewares, devServer) => {
            // Override console methods to prevent object logging
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;

            console.log = (...args) => {
                const cleanArgs = args.filter((arg) => {
                    if (typeof arg === 'object' && arg !== null) {
                        const str = String(arg);
                        return !str.includes('[object Event]') && !str.includes('[object Object]');
                    }
                    return true;
                });
                if (cleanArgs.length > 0) originalLog(...cleanArgs);
            };

            console.warn = (...args) => {
                const cleanArgs = args.filter((arg) => {
                    if (typeof arg === 'object' && arg !== null) {
                        const str = String(arg);
                        return !str.includes('[object Event]') && !str.includes('[object Object]');
                    }
                    return true;
                });
                if (cleanArgs.length > 0) originalWarn(...cleanArgs);
            };

            console.error = (...args) => {
                const cleanArgs = args.filter((arg) => {
                    if (typeof arg === 'object' && arg !== null) {
                        const str = String(arg);
                        return !str.includes('[object Event]') && !str.includes('[object Object]');
                    }
                    return true;
                });
                if (cleanArgs.length > 0) originalError(...cleanArgs);
            };

            return middlewares;
        },
    },
};
