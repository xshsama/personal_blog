declare module '@bytemd/vue-next' {
    import { Component } from 'vue'

    export interface EditorProps {
        value: string
        plugins?: BytemdPlugin[]
        uploadImages?: (files: File[]) => Promise<string[]>
        mode?: 'split' | 'tab'
        previewTheme?: string
        editorTheme?: string
        locale?: any
        placeholder?: string
        maxLength?: number
        sanitize?: (schema: any) => any
        containerClass?: string
        editorClass?: string
        previewClass?: string
    }

    export interface ViewerProps {
        value: string
        plugins?: BytemdPlugin[]
        sanitize?: (schema: any) => any
    }

    export const Editor: Component<EditorProps>
    export const Viewer: Component<ViewerProps>
}

declare module '@bytemd/plugin-gfm' {
    import { BytemdPlugin } from 'bytemd'
    interface GfmOptions {
        locale?: Record<string, string>
    }
    export default function gfm(options?: GfmOptions): BytemdPlugin
}

declare module '@bytemd/plugin-highlight' {
    import { BytemdPlugin } from 'bytemd'
    interface HighlightOptions {
        init?(hljs: any): void
        detect?: boolean
    }
    export default function highlight(options?: HighlightOptions): BytemdPlugin
}

declare module '@bytemd/plugin-mermaid' {
    import { BytemdPlugin } from 'bytemd'
    interface BytemdPluginMermaidOptions {
        mermaid?: any
    }
    export default function mermaid(options?: BytemdPluginMermaidOptions): BytemdPlugin
}

declare module '@bytemd/plugin-medium-zoom' {
    import { BytemdPlugin } from 'bytemd'
    export default function mediumZoom(): BytemdPlugin
}

declare module '@bytemd/plugin-breaks' {
    import { BytemdPlugin } from 'bytemd'
    export default function breaks(): BytemdPlugin
}

declare module 'bytemd' {
    export interface BytemdPlugin {
        name?: string
        viewerEffect?(ctx: ViewerContext): void | (() => void)
        editorEffect?(ctx: EditorContext): void | (() => void)
        actions?: Action[]
        handleDOMEvents?: Record<string, Function>
    }

    export interface ViewerContext {
        file: any
        markdownBody: HTMLElement
    }

    export interface EditorContext {
        editor: any
        appendBlock(content: string): void
        codemirror: any
    }

    export interface Action {
        title: string
        icon?: string
        handler(): void
        active?(): boolean
    }
}