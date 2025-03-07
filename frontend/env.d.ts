/// <reference types="vite/client" />
/// <reference types="@types/node" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'marked' {
  export function marked(text: string): string
}

// 确保 NodeJS 类型可用
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VITE_BASE_URL: string
    VITE_API_URL: string
  }
}

// 扩展 Window 接口以包含潜在的全局变量
declare interface Window {
  // 添加任何全局变量
}
