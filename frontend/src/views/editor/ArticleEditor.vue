<template>
  <div class="editor-container">
    <!-- 顶部工具栏 -->
    <div class="editor-header">
      <div class="editor-info">
        <el-input
          v-model="articleForm.title"
          placeholder="请输入文章标题..."
          class="title-input"
          :maxlength="100"
          show-word-limit
          clearable
        />

        <div class="article-meta">
          <el-select
            v-model="articleForm.category"
            placeholder="选择分类"
            class="category-select"
          >
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="articleForm.tags"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择标签"
            class="tag-select"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="action-buttons">
        <el-button @click="handlePreview">
          预览
        </el-button>
        <el-button @click="handleSaveDraft">
          存草稿
        </el-button>
        <el-button type="primary" @click="handlePublish">
          发布文章
        </el-button>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="editor-main">
      <div class="editor-wrapper" :class="{ 'preview-mode': isPreview }">
        <!-- Markdown编辑器 -->
        <div v-show="!isPreview" class="markdown-editor">
          <div class="toolbar">
            <el-button-group>
              <el-button
                v-for="tool in editorTools"
                :key="tool.name"
                :title="tool.title"
                @click="handleToolClick(tool.action)"
              >
                <el-icon><component :is="tool.icon" /></el-icon>
              </el-button>
            </el-button-group>

            <el-upload
              class="image-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
            >
              <el-button>
                <el-icon><Picture /></el-icon>
                插入图片
              </el-button>
            </el-upload>
          </div>

          <el-input
            v-model="articleForm.content"
            type="textarea"
            :rows="20"
            placeholder="开始创作..."
            class="content-textarea"
            @input="handleInput"
          />
        </div>

        <!-- 预览区域 -->
        <div v-show="isPreview" class="preview-area">
          <div class="preview-content markdown-body" v-html="renderedContent" />
        </div>
      </div>

      <!-- 右侧工具栏 -->
      <div class="editor-sidebar">
        <el-card class="setting-card">
          <template #header>
            <div class="card-header">
              <span>文章设置</span>
            </div>
          </template>

          <el-form label-position="top" class="setting-form">
            <el-form-item label="文章描述">
              <el-input
                v-model="articleForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入文章描述..."
                :maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="封面图">
              <el-upload
                class="cover-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeCoverUpload"
              >
                <img
                  v-if="articleForm.cover"
                  :src="articleForm.cover"
                  class="cover-image"
                />
                <el-icon v-else class="cover-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="发布设置">
              <el-switch
                v-model="articleForm.isPublic"
                active-text="公开"
                inactive-text="私密"
              />
            </el-form-item>

            <el-form-item label="评论设置">
              <el-switch
                v-model="articleForm.allowComment"
                active-text="允许评论"
                inactive-text="禁止评论"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="预览文章"
      width="80%"
      fullscreen
    >
      <div class="preview-dialog-content">
        <h1 class="preview-title">{{ articleForm.title || '无标题' }}</h1>
        <div class="preview-meta">
          <span>
            <el-icon><Calendar /></el-icon>
            {{ new Date().toLocaleDateString() }}
          </span>
          <span>
            <el-icon><Collection /></el-icon>
            {{ getCategoryName(articleForm.category) }}
          </span>
          <span v-if="articleForm.tags.length">
            <el-icon><Collection /></el-icon>
            {{ getTagNames(articleForm.tags).join(', ') }}
          </span>
        </div>
        <div class="preview-body markdown-body" v-html="renderedContent" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handlePublish">
            发布文章
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发布确认对话框 -->
    <el-dialog
      v-model="publishDialogVisible"
      title="发布文章"
      width="30%"
    >
      <div class="publish-dialog-content">
        <p>确认要发布这篇文章吗？发布后可以在文章管理中修改。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="publishDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPublish">
            确认发布
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import {
  EditPen,
  Select,
  List,
  Link as LinkIcon,
  Picture,
  Plus,
  Calendar,
  Collection
} from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

interface ArticleForm {
  title: string
  content: string
  category: string
  tags: string[]
  description: string
  cover: string
  isPublic: boolean
  allowComment: boolean
}

const route = useRoute()
const router = useRouter()

const articleForm = ref<ArticleForm>({
  title: '',
  content: '',
  category: '',
  tags: [],
  description: '',
  cover: '',
  isPublic: true,
  allowComment: true
})

// 模拟分类和标签数据
const categories = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'tools', label: '开发工具' }
]

const tags = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' }
]

const isPreview = ref(false)
const previewDialogVisible = ref(false)
const publishDialogVisible = ref(false)

// 编辑器工具栏配置
const editorTools = [
  { name: 'bold', title: '粗体', icon: EditPen, action: () => insertMarkdown('**', '**') },
  { name: 'italic', title: '斜体', icon: Select, action: () => insertMarkdown('*', '*') },
  { name: 'list', title: '列表', icon: List, action: () => insertMarkdown('\n- ', '') },
  { name: 'link', title: '链接', icon: LinkIcon, action: () => insertMarkdown('[', '](url)') }
]

const renderedContent = computed(() => {
  return marked(articleForm.value.content)
})

// 编辑器工具方法
const insertMarkdown = (prefix: string, suffix: string) => {
  const textarea = document.querySelector('.content-textarea textarea') as HTMLTextAreaElement | null
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = articleForm.value.content
  const selectedText = content.substring(start, end)

  articleForm.value.content = 
    content.substring(0, start) +
    prefix +
    selectedText +
    suffix +
    content.substring(end)

  // 恢复选区
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(
      start + prefix.length,
      end + prefix.length
    )
  })
}

const handleInput = (value: string) => {
  articleForm.value.content = value
}

const handleToolClick = (action: () => void) => {
  action()
}

// 图片上传
const beforeImageUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleImageSuccess = (res: any) => {
  // 插入图片链接到编辑器
  const imageUrl = res.url
  insertMarkdown(`![](${imageUrl})`, '')
}

// 封面上传
const beforeCoverUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleCoverSuccess = (res: any) => {
  articleForm.value.cover = res.url
}

// 预览与发布
const handlePreview = () => {
  if (isInDialog()) {
    isPreview.value = !isPreview.value
  } else {
    previewDialogVisible.value = true
  }
}

const handleSaveDraft = async () => {
  try {
    await saveDraft()
    ElMessage.success('草稿保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const handlePublish = () => {
  publishDialogVisible.value = true
}

const confirmPublish = async () => {
  try {
    await publishArticle()
    ElMessage.success('文章发布成功')
    router.push('/articles')
  } catch (error) {
    ElMessage.error('发布失败')
  } finally {
    publishDialogVisible.value = false
  }
}

// 辅助方法
const isInDialog = () => {
  return false // TODO: 根据实际情况判断
}

const getCategoryName = (value: string) => {
  return categories.find(c => c.value === value)?.label || '未分类'
}

const getTagNames = (values: string[]) => {
  return values.map(v => tags.find(t => t.value === v)?.label || v)
}

const saveDraft = async () => {
  // TODO: 实现保存草稿的逻辑
  return Promise.resolve()
}

const publishArticle = async () => {
  // TODO: 实现发布文章的逻辑
  return Promise.resolve()
}
</script>

<style scoped>
.editor-container {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.editor-header {
  padding: 16px;
  border-bottom: 1px solid #EBEEF5;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.editor-info {
  flex: 1;
  margin-right: 20px;
}

.title-input {
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  gap: 16px;
}

.category-select {
  width: 200px;
}

.tag-select {
  width: 300px;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #EBEEF5;
}

.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  padding: 8px 16px;
  border-bottom: 1px solid #EBEEF5;
  display: flex;
  gap: 16px;
}

.content-textarea {
  flex: 1;
  font-family: 'Fira Code', monospace;
}

.content-textarea :deep(.el-textarea__inner) {
  height: 100%;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  border: none;
  resize: none;
}

.preview-area {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.editor-sidebar {
  width: 300px;
  padding: 16px;
  overflow-y: auto;
}

.setting-card {
  position: sticky;
  top: 16px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.preview-dialog-content {
  padding: 20px;
}

.preview-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px;
}

.preview-meta {
  display: flex;
  gap: 16px;
  color: #909399;
  margin-bottom: 24px;
}

.preview-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-body {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.markdown-body) {
  font-size: 16px;
  line-height: 1.8;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.markdown-body h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

:deep(.markdown-body h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

:deep(.markdown-body h3) {
  font-size: 1.25em;
}

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

:deep(.markdown-body pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

:deep(.markdown-body img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}
</style>
