/// <reference types="node" />

declare module 'vite' {
  interface UserConfig {
    plugins?: any[]
    resolve?: {
      alias?: Record<string, string>
    }
    server?: {
      port?: number
      proxy?: Record<string, {
        target: string
        changeOrigin?: boolean
        rewrite?: (path: string) => string
      }>
    }
    css?: {
      preprocessorOptions?: {
        scss?: {
          additionalData?: string
        }
      }
    }
    build?: {
      outDir?: string
      assetsDir?: string
      sourcemap?: boolean
      minify?: 'terser' | boolean
      terserOptions?: any
      rollupOptions?: any
    }
    optimizeDeps?: {
      include?: string[]
    }
  }

  export function defineConfig(config: UserConfig): UserConfig
}

declare module '@vitejs/plugin-vue' {
  const plugin: () => any
  export default plugin
}

declare module '@vitejs/plugin-vue-jsx' {
  const plugin: () => any
  export default plugin
}

declare module 'unplugin-auto-import/vite' {
  interface AutoImportConfig {
    resolvers?: any[]
    imports?: string[]
    dts?: string
    eslintrc?: {
      enabled?: boolean
    }
  }
  const plugin: (config: AutoImportConfig) => any
  export default plugin
}

declare module 'unplugin-vue-components/vite' {
  interface ComponentsConfig {
    resolvers?: any[]
    dts?: string
  }
  const plugin: (config: ComponentsConfig) => any
  export default plugin
}

declare module 'unplugin-vue-components/resolvers' {
  export const ElementPlusResolver: () => any
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
