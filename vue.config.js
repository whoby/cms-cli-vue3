const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const ElementPlus = require('unplugin-element-plus/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// mock服务
const MOCK = 'http://rap2api.taobao.org/app/mock/14718'

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/', // js引用路径
    outputDir: './dist', // 打包路径
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    // 自定义主题
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@use "@/assets/style/theme.scss" as *;`
            }
        }
    },
    chainWebpack: (config) => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')

        // 设置路径别名
        const resolve = (dir) => require('path').join(__dirname, dir)
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('libs', resolve('src/libs'))
            .set('store', resolve('src/store'))
            .set('views', resolve('src/views'))

        // Element-plus按需加载组件
        config.plugin('AutoImport').use(
            AutoImport({
                resolvers: [ElementPlusResolver()]
            })
        )
        config.plugin('Components').use(
            Components({
                resolvers: [ElementPlusResolver()]
            })
        )
        // 自定义主题
        config.plugin('ElementPlus').use(
            ElementPlus({
                useSource: true
            })
        )
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hot: false,
        open: false,
        proxy: {
            '/api': {
                // logLevel: 'debug',
                target: '' || MOCK, // ''中可代理任意服务，包括本地服务
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
