import breaks from '@bytemd/plugin-breaks'
import highlight from '@bytemd/plugin-highlight'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import { BytemdPlugin } from 'bytemd'
import zh from 'bytemd/locales/zh_Hans.json'
import 'github-markdown-css/github-markdown-light.css'
import 'highlight.js/styles/github.css'

export interface MarkdownConfig {
    plugins: BytemdPlugin[]
    uploadImages?: (files: File[]) => Promise<string[]>
    locale?: any
    sanitize?: (schema: any) => any
    editorConfig?: {
        mode?: 'split' | 'tab'
        previewTheme?: string
        editorTheme?: string
    }
}

// 代码高亮配置
const highlightOptions = {
    detect: true,
    init: (hljs: any) => {
        // 可以在这里注册更多的语言高亮支持
    }
}

// 自定义链接处理插件
const linkPlugin = (): BytemdPlugin => ({
    name: 'custom-link',
    viewerEffect({ markdownBody }) {
        const links = markdownBody.querySelectorAll('a')
        links.forEach(link => {
            if (link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank')
                link.setAttribute('rel', 'noopener noreferrer')
            }
        })
    }
})

// 添加自定义样式插件
const customStylePlugin = (): BytemdPlugin => ({
    name: 'custom-style',
    viewerEffect({ markdownBody }) {
        // 调整封面图片位置的样式
        const style = document.createElement('style')
        style.textContent = `
            .markdown-body img:first-of-type {
                margin-top: 2rem !important;
            }
        `
        markdownBody.appendChild(style)
    }
})

export function createMarkdownConfig(options?: Partial<MarkdownConfig>): MarkdownConfig {
    return {
        plugins: [
            highlight(highlightOptions),
            breaks(),
            mediumZoom(),
            linkPlugin(),
            customStylePlugin(),
            ...(options?.plugins || [])
        ],
        locale: zh,
        uploadImages: options?.uploadImages,
        editorConfig: {
            mode: 'split',
            previewTheme: 'github',
            ...options?.editorConfig
        }
    }
}