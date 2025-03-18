import { defineConfig } from '@vue/cli-service'

export default defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        entry: './src/main.ts',
    }
})