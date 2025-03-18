<template>
  <div class="article-editor">
    <Editor :value="modelValue" :plugins="config.plugins" :uploadImages="handleImageUpload" :locale="locale"
      @change="handleChange" />
    <el-image-viewer v-if="previewImage" :url-list="[previewImage]" :initial-index="0" @close="previewImage = ''" />
  </div>
</template>

<script lang="ts">
import { Editor } from '@bytemd/vue-next'
import axios from 'axios'
import zh from 'bytemd/locales/zh_Hans.json'
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { compressImage, validateImage } from '../utils/image'
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const locale = ref(zh)
    const previewImage = ref('')

    const handleImageUpload = async (files: File[]): Promise<string[]> => {
      const urls: string[] = []

      for (const file of files) {
        try {
          // 验证图片
          validateImage(file)

          // 压缩图片
          const compressed = await compressImage(file)
          const formData = new FormData()
          formData.append('image', new File([compressed], file.name, { type: 'image/jpeg' }))

          // 上传图片
          const response = await axios.post<{ url: string }>('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

          urls.push(response.data.url)
          ElMessage.success('图片上传成功')
        } catch (error) {
          if (error instanceof Error) {
            ElMessage.error(error.message)
          } else {
            ElMessage.error('图片上传失败')
          }
        }
      }

      return urls
    }

    const config = createMarkdownConfig({
      uploadImages: handleImageUpload
    })

    const handleChange = (v: string) => {
      emit('update:modelValue', v)
    }

    return {
      config,
      locale,
      previewImage,
      handleChange,
      handleImageUpload
    }
  }
})
</script>

<style scoped>
.article-editor {
  height: 100%;
}

.article-editor :deep(.bytemd) {
  height: 100%;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
}

.article-editor :deep(.bytemd-toolbar) {
  border-top-left-radius: var(--el-border-radius-base);
  border-top-right-radius: var(--el-border-radius-base);
}

.article-editor :deep(.bytemd-status) {
  border-bottom-left-radius: var(--el-border-radius-base);
  border-bottom-right-radius: var(--el-border-radius-base);
}
</style>
