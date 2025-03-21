<template>
    <div class="article-create">
        <el-card class="editor-card">
            <template #header>
                <div class="card-header">
                    <h2>发布文章</h2>
                </div>
            </template>

            <el-form ref="formRef" :model="articleForm" :rules="rules" label-position="top">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="articleForm.title" placeholder="请输入文章标题" maxlength="100" show-word-limit />
                </el-form-item>

                <div class="form-row">
                    <el-form-item label="文章分类" prop="category" class="category-select">
                        <el-select v-model="articleForm.category" placeholder="请选择文章分类" clearable>
                            <el-option v-for="item in categories" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文章标签" prop="tags" class="tags-select">
                        <el-select v-model="articleForm.tags" multiple filterable allow-create default-first-option
                            placeholder="请选择或输入标签">
                            <el-option v-for="item in tags" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item label="文章摘要" prop="summary">
                    <el-input v-model="articleForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要"
                        maxlength="200" show-word-limit />
                </el-form-item>

                <el-form-item label="文章内容" prop="content" class="content-editor">
                    <article-editor v-model="articleForm.content" />
                </el-form-item>

                <div class="bottom-section">
                    <el-form-item label="封面图片" prop="coverImage" class="cover-section">
                        <image-upload v-model:value="articleForm.coverImage" @upload-success="handleCoverSuccess"
                            @upload-error="handleCoverError" />
                    </el-form-item>

                    <div class="form-actions">
                        <el-button type="info" @click="saveDraft">保存草稿</el-button>
                        <el-button type="primary" @click="publishArticle" :loading="publishing">
                            {{ publishing ? '发布中...' : '发布文章' }}
                        </el-button>
                    </div>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="ts">
import ArticleEditor from '@/components/ArticleEditor.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import articleService from '@/services/article.service'
import type { ArticleDTO } from '@/types/article'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

interface CategoryOption {
    value: string
    label: string
}

interface TagOption {
    value: string
    label: string
}

export default defineComponent({
    name: 'ArticleCreate',
    components: {
        ArticleEditor,
        ImageUpload
    },
    setup() {
        const router = useRouter()
        const formRef = ref<FormInstance>()
        const publishing = ref(false)

        const articleForm = reactive<ArticleDTO>({
            title: '',
            category: '',
            tags: [],
            summary: '',
            content: '',
            coverImage: '',
            isDraft: false
        })

        const rules = reactive<FormRules>({
            title: [
                { required: true, message: '请输入文章标题', trigger: 'blur' },
                { min: 2, max: 100, message: '标题长度必须在2-100字符之间', trigger: 'blur' }
            ],
            category: [
                { required: true, message: '请选择文章分类', trigger: 'change' }
            ],
            tags: [
                { required: true, message: '请至少选择一个标签', trigger: 'change' }
            ],
            summary: [
                { required: true, message: '请输入文章摘要', trigger: 'blur' },
                { max: 200, message: '摘要不能超过200字符', trigger: 'blur' }
            ],
            content: [
                { required: true, message: '请输入文章内容', trigger: 'blur' }
            ]
        })

        const categories: CategoryOption[] = [
            { value: 'tech', label: '技术' },
            { value: 'life', label: '生活' },
            { value: 'thoughts', label: '随想' }
        ]

        const tags: TagOption[] = [
            { value: 'vue', label: 'Vue.js' },
            { value: 'react', label: 'React' },
            { value: 'javascript', label: 'JavaScript' }
        ]

        // 处理封面图片上传成功
        const handleCoverSuccess = (url: string) => {
            articleForm.coverImage = url
        }

        // 处理封面图片上传失败
        const handleCoverError = (error: Error) => {
            console.error('封面上传失败:', error)
            ElMessage.error('封面上传失败：' + error.message)
        }

        // 保存草稿
        const saveDraft = async () => {
            try {
                await formRef.value?.validate()
                articleForm.isDraft = true
                const response = await articleService.createArticle(articleForm)
                ElMessage.success('草稿保存成功')
                router.push(`/article/${response.id}`)
            } catch (error) {
                console.error('保存草稿失败:', error)
                ElMessage.error('保存失败，请检查表单并重试')
            }
        }

        // 发布文章
        const publishArticle = async () => {
            try {
                await formRef.value?.validate()
                publishing.value = true
                articleForm.isDraft = false
                const response = await articleService.createArticle(articleForm)
                ElMessage.success('文章发布成功！')
                router.push(`/article/${response.id}`)
            } catch (error) {
                console.error('发布失败:', error)
                ElMessage.error('发布失败，请检查表单并重试')
            } finally {
                publishing.value = false
            }
        }

        return {
            formRef,
            articleForm,
            rules,
            categories,
            tags,
            publishing,
            handleCoverSuccess,
            handleCoverError,
            saveDraft,
            publishArticle
        }
    }
})
</script>

<style scoped>
.article-create {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 100px;
    /* 添加底部padding，为固定按钮留出空间 */
}

.editor-card {
    margin-bottom: 30px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.category-select {
    flex: 1;
}

.tags-select {
    flex: 2;
}

.content-editor {
    height: 600px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.content-editor :deep(.el-form-item__content) {
    height: calc(100% - 22px);
    display: flex;
    flex-direction: column;
    width: 100%;
}

.content-editor :deep(.article-editor),
.content-editor :deep(.bytemd) {
    width: 100%;
    max-width: 100%;
}

.bottom-section {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cover-section {
    margin-bottom: 20px;
    width: 300px;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 15px 20px;
}

/* 添加响应式调整 */
@media (max-width: 1040px) {
    .form-actions {
        right: 20px;
        /* 在较窄屏幕上固定到右侧 */
    }
}

@media (max-width: 768px) {
    .article-create {
        padding: 10px;
        padding-bottom: 100px;
    }

    .form-actions {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
