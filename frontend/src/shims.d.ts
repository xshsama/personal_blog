/// <reference types="element-plus/global" />

// Element Plus 组件类型
declare global {
  type Size = 'default' | 'small' | 'large'
  type Type = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text'
  type Effect = 'dark' | 'light' | 'plain'

  interface ElementPlusProps {
    size?: Size
    type?: Type
    effect?: Effect
  }

  interface ElementPlusButtonProps extends ElementPlusProps {
    circle?: boolean
    disabled?: boolean
    loading?: boolean
  }

  interface ElementPlusTagProps extends ElementPlusProps {
    closable?: boolean
    hit?: boolean
  }
}

// Vue 单文件组件的类型声明
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Element Plus 组件的类型声明
declare module 'element-plus' {
  export interface ElButtonProps extends ElementPlusButtonProps {}
  export interface ElTagProps extends ElementPlusTagProps {}
}

// Element Plus 提供的类型
declare namespace ElementPlusNamespace {
  export type ButtonType = Type
  export type ButtonSize = Size
  export type TagType = Type
  export type TagEffect = Effect
}

export {}
