module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:process.env.VUE_APP_SERVICE_URL,
                changeOrigin:true,
                pathRewrite:{
                    '^/api': ''
                }
            },
        }
    }
}
