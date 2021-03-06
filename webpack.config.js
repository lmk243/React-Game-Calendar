module.exports = {
    entry: './App.js',
    output: {
        path: './',
        filename: 'index.js'
    },
    
    devServer: {
        inline: true,
        port: 3333
    },
    
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}