import breaks from '@bytemd/plugin-breaks'
import gfm from '@bytemd/plugin-gfm'
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

// GFM 插件配置
const gfmOptions = {
    locale: {
        'Table': '表格',
        'Strikethrough': '删除线',
        'Task List': '任务列表',
        'Update Table': '更新表格',
        'Ordered List': '有序列表',
        'Unordered List': '无序列表',
        'Task': '任务',
        'Link': '链接',
        'Image': '图片'
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

export function createMarkdownConfig(options?: Partial<MarkdownConfig>): MarkdownConfig {
    return {
        plugins: [
            gfm({
                locale: zh
            }),
            highlight(highlightOptions),
            breaks(),
            mediumZoom(),
            linkPlugin(),
            ...(options?.plugins || [])
        ],
        locale: {
            ...zh,
            'Write': '编辑',
            'Preview': '预览',
            'Split': '分屏'
        },
        uploadImages: options?.uploadImages,
        editorConfig: {
            mode: 'split',
            previewTheme: 'github',
            ...options?.editorConfig
        }
    }
}