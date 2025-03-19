<template>
  <div class="article-editor">
    <Editor :value="modelValue" :plugins="config.plugins" :locale="locale" :mode="editorMode" :placeholder="placeholder"
      :previewDebounce="300" :maxLength="maxLength" @change="handleChange" />
    <el-image-viewer v-if="previewImage" :url-list="[previewImage]" :initial-index="0" @close="previewImage = ''" />
  </div>
</template>

<script lang="ts">
import { Editor } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import zh from 'bytemd/locales/zh_Hans.json'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { createMarkdownConfig } from '../utils/markdown'

export default defineComponent({
  name: 'ArticleEditor',
  components: {
    Editor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'split',
      validator: (value: string) => ['split', 'tab', 'auto'].includes(value)
    },
    placeholder: {
      type: String,
      default: '请输入文章内容...'
    },
    maxLength: {
      type: Number,
      default: 50000
    }
  },
  emits: ['update:modelValue', 'preview-image'],
  setup(props, { emit }) {
    const locale = ref(zh)
    const previewImage = ref('')
    const editorMode = ref(props.mode)

    onMounted(() => {
      document.addEventListener('preview-image', ((e: CustomEvent) => {
        previewImage.value = e.detail.url
      }) as EventListener)
    })

    watch(() => props.mode, (newMode) => {
      editorMode.value = newMode
    })

    const handleChange = (v: string) => {
      emit('update:modelValue', v)
    }

    const config = createMarkdownConfig({
      editorConfig: {
        mode: editorMode.value as 'split' | 'tab',
        previewTheme: 'github',
        editorTheme: 'default'
      }
    })

    return {
      config,
      locale,
      previewImage,
      editorMode,
      handleChange
    }
  }
})
</script>

<style scoped>
.article-editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.article-editor :deep(.bytemd) {
  flex: 1;
  min-height: 600px;
  width: 100%;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
  font-family: var(--el-font-family);
}

.article-editor :deep(.bytemd-toolbar) {
  border-top-left-radius: var(--el-border-radius-base);
  border-top-right-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-light);
  padding: 8px;
  border-bottom: 1px solid var(--el-border-color);
}

.article-editor :deep(.bytemd-toolbar-icon) {
  padding: 6px;
  margin: 0 2px;
}

.article-editor :deep(.bytemd-toolbar-icon:hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.article-editor :deep(.bytemd-toolbar-icon.active) {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

.article-editor :deep(.bytemd-status) {
  border-bottom-left-radius: var(--el-border-radius-base);
  border-bottom-right-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-light);
  padding: 4px 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.article-editor :deep(.bytemd-editor) {
  background-color: var(--el-bg-color);
}

.article-editor :deep(.bytemd-preview) {
  background-color: var(--el-bg-color-page);
  padding: 16px 24px;
}

.article-editor :deep(.markdown-body) {
  font-size: 15px;
  line-height: 1.75;
  color: var(--el-text-color-primary);
}

.article-editor :deep(.markdown-body h1),
.article-editor :deep(.markdown-body h2) {
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 0.3em;
  margin-top: 1.5em;
}

.article-editor :deep(.markdown-body pre) {
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  margin: 16px 0;
}

.article-editor :deep(.markdown-body code) {
  background-color: var(--el-fill-color-lighter);
  padding: 0.2em 0.4em;
  border-radius: var(--el-border-radius-small);
  font-size: 0.9em;
}

.article-editor :deep(.markdown-body blockquote) {
  border-left: 4px solid var(--el-color-primary-light-3);
  color: var(--el-text-color-regular);
  padding: 0 1em;
  margin: 16px 0;
}

.article-editor :deep(.markdown-body table) {
  border-collapse: collapse;
  margin: 16px 0;
  display: block;
  overflow: auto;
  width: 100%;
}

.article-editor :deep(.markdown-body table th),
.article-editor :deep(.markdown-body table td) {
  border: 1px solid var(--el-border-color);
  padding: 8px 13px;
}

.article-editor :deep(.markdown-body table tr:nth-child(2n)) {
  background-color: var(--el-fill-color-light);
}

.article-editor :deep(.markdown-body img) {
  max-width: 100%;
  border-radius: var(--el-border-radius-base);
  margin: 16px 0;
}

.article-editor :deep(.markdown-body ul),
.article-editor :deep(.markdown-body ol) {
  padding-left: 2em;
  margin: 16px 0;
}

.article-editor :deep(.markdown-body hr) {
  height: 1px;
  background-color: var(--el-border-color);
  border: none;
  margin: 24px 0;
}
</style>
