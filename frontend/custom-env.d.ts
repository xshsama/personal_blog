/// <reference types="@types/node" />

// Vue SFC
declare module '*.vue' {
  const component: any
  export default component
}

// Vite and plugins
declare module 'vite' {
  const content: any
  export { content as defineConfig }
}
declare module '@vitejs/plugin-vue' {
  const plugin: any
  export default plugin
}
declare module '@vitejs/plugin-vue-jsx' {
  const plugin: any
  export default plugin
}
declare module 'unplugin-auto-import/vite' {
  const plugin: any
  export default plugin
}
declare module 'unplugin-vue-components/vite' {
  const plugin: any
  export default plugin
}
declare module 'unplugin-vue-components/resolvers' {
  export const ElementPlusResolver: () => any
}

// Marked module
declare module 'marked' {
  export function marked(text: string): string
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Element Plus types
declare global {
  type ElementSize = 'default' | 'small' | 'large'
  type ElementType = 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text'
  type ElementEffect = 'dark' | 'light' | 'plain'

  interface ElementProps {
    size?: ElementSize
    type?: ElementType
    effect?: ElementEffect
  }

  interface Window {
    __APP_CONFIG__: {
      apiBaseUrl: string
      baseUrl: string
    }
  }
}

export {}
