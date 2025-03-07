/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
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

declare module '@element-plus/icons-vue'
declare module 'marked'
declare module 'element-plus/dist/locale/zh-cn.mjs'

// Vue 类型声明
declare module 'vue' {
  interface GlobalComponents {
    ElButton: (typeof import('element-plus'))['ElButton']
    ElInput: (typeof import('element-plus'))['ElInput']
    ElForm: (typeof import('element-plus'))['ElForm']
    ElFormItem: (typeof import('element-plus'))['ElFormItem']
    ElSelect: (typeof import('element-plus'))['ElSelect']
    ElOption: (typeof import('element-plus'))['ElOption']
    ElTag: (typeof import('element-plus'))['ElTag']
    ElDialog: (typeof import('element-plus'))['ElDialog']
    ElMenu: (typeof import('element-plus'))['ElMenu']
    ElMenuItem: (typeof import('element-plus'))['ElMenuItem']
    ElIcon: (typeof import('element-plus'))['ElIcon']
    ElPagination: (typeof import('element-plus'))['ElPagination']
    ElCard: (typeof import('element-plus'))['ElCard']
    ElAvatar: (typeof import('element-plus'))['ElAvatar']
    ElBadge: (typeof import('element-plus'))['ElBadge']
    ElUpload: (typeof import('element-plus'))['ElUpload']
    ElSwitch: (typeof import('element-plus'))['ElSwitch']
    ElDescriptions: (typeof import('element-plus'))['ElDescriptions']
    ElDescriptionsItem: (typeof import('element-plus'))['ElDescriptionsItem']
    ElTimeline: (typeof import('element-plus'))['ElTimeline']
    ElTimelineItem: (typeof import('element-plus'))['ElTimelineItem']
    ElTabs: (typeof import('element-plus'))['ElTabs']
    ElTabPane: (typeof import('element-plus'))['ElTabPane']
    ElRow: (typeof import('element-plus'))['ElRow']
    ElCol: (typeof import('element-plus'))['ElCol']
    ElCheckbox: (typeof import('element-plus'))['ElCheckbox']
    ElLink: (typeof import('element-plus'))['ElLink']
    ElEmpty: (typeof import('element-plus'))['ElEmpty']
    ElRadioButton: (typeof import('element-plus'))['ElRadioButton']
    ElRadioGroup: (typeof import('element-plus'))['ElRadioGroup']
    ElButtonGroup: (typeof import('element-plus'))['ElButtonGroup']
  }

  export interface ComponentCustomProperties {
    $filters: {
      formatDate: (value: string | Date) => string
      truncate: (text: string, length: number, suffix?: string) => string
    }
  }
}

// Element Plus 类型扩展
type ElementPlusSize = 'default' | 'small' | 'large'
type ElementPlusType = 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text'
type ElementPlusEffect = 'dark' | 'light' | 'plain'

declare global {
  interface ElementPlusProps {
    size?: ElementPlusSize
    type?: ElementPlusType
    effect?: ElementPlusEffect
  }
}

// Vue exports
declare module 'vue' {
  export * from '@vue/runtime-dom'
  export {
    createApp,
    ref,
    computed,
    onMounted,
    watch,
    watchEffect,
    nextTick,
    defineComponent,
    toRefs,
    reactive,
    PropType,
    inject,
    provide,
    defineEmits,
    defineProps,
    withDefaults,
    getCurrentInstance
  } from '@vue/runtime-dom'
}

// 扩展 Window 接口
declare interface Window {
  // 添加需要的全局变量
  ElMessage: typeof import('element-plus')['ElMessage']
  ElMessageBox: typeof import('element-plus')['ElMessageBox']
  ElNotification: typeof import('element-plus')['ElNotification']
}

export {}
