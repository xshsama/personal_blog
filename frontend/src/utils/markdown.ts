import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
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

// 扩展的 GFM 功能配置
const gfmOptions = {
    locale: {
        'Table': '表格',
        'Strikethrough': '删除线',
        'Task List': '任务列表',
        'Update Table': '更新表格'
    }
}

// 代码高亮配置
const highlightOptions = {
    detect: true,
    init: (hljs: any) => {
        // 可以在这里注册更多的语言高亮
    }
}

// 自定义链接处理插件
const linkPlugin = (): BytemdPlugin => ({
    name: 'custom-link',
    viewerEffect({ markdownBody }) {
        const links = markdownBody.querySelectorAll('a')
        links.forEach(link => {
            // 为外部链接添加新窗口打开和安全属性
            if (link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank')
                link.setAttribute('rel', 'noopener noreferrer')
            }
        })
    }
})

// 自定义图片处理插件
const imagePlugin = (): BytemdPlugin => ({
    name: 'custom-image',
    viewerEffect({ markdownBody }) {
        const images = markdownBody.querySelectorAll('img')
        images.forEach(img => {
            // 添加加载失败时的默认图片
            img.addEventListener('error', () => {
                img.src = 'https://via.placeholder.com/800x400?text=Image+Load+Failed'
            })
            // 添加图片点击预览功能
            img.style.cursor = 'pointer'
            img.addEventListener('click', (e) => {
                e.preventDefault()
                const viewer = document.querySelector('.el-image-viewer__wrapper')
                if (!viewer) {
                    const event = new CustomEvent('preview-image', {
                        detail: { url: img.src }
                    })
                    document.dispatchEvent(event)
                }
            })
        })
    }
})

export function createMarkdownConfig(options?: Partial<MarkdownConfig>): MarkdownConfig {
    return {
        plugins: [
            gfm(gfmOptions),
            highlight(highlightOptions),
            linkPlugin(),
            imagePlugin()
        ],
        locale: zh,
        uploadImages: options?.uploadImages,
        editorConfig: {
            mode: 'split',
            ...options?.editorConfig
        }
    }
}