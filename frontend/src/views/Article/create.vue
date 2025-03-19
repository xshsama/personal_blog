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
                        <el-upload class="cover-uploader" action="/api/upload" :show-file-list="false"
                            :on-success="handleCoverSuccess" :before-upload="beforeCoverUpload">
                            <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="cover-image" />
                            <el-icon v-else class="cover-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleEditor from '../../components/ArticleEditor.vue'

export default defineComponent({
    name: 'ArticleCreate',
    components: {
        Plus,
        ArticleEditor
    },
    setup() {
        const router = useRouter()
        const formRef = ref<any>(null)
        const publishing = ref(false)

        // 表单数据
        const articleForm = reactive({
            title: '',
            category: '',
            tags: [] as string[],
            summary: '',
            content: '',
            coverImage: ''
        })

        // 表单验证规则
        const rules = {
            title: [
                { required: true, message: '请输入文章标题', trigger: 'blur' },
                { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
            ],
            category: [
                { required: true, message: '请选择文章分类', trigger: 'change' }
            ],
            content: [
                { required: true, message: '请输入文章内容', trigger: 'blur' },
                { min: 100, message: '文章内容不能少于 100 个字符', trigger: 'blur' }
            ]
        }

        // 分类数据
        const categories = [
            { value: 'tech', label: '技术' },
            { value: 'life', label: '生活' },
            { value: 'thoughts', label: '随想' }
        ]

        // 标签数据
        const tags = [
            { value: 'vue', label: 'Vue.js' },
            { value: 'react', label: 'React' },
            { value: 'javascript', label: 'JavaScript' }
        ]

        // 处理封面图片上传
        const handleCoverSuccess = (res: any) => {
            articleForm.coverImage = res.url
            ElMessage.success('封面上传成功')
        }

        const beforeCoverUpload = (file: File) => {
            const isImage = file.type.startsWith('image/')
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isImage) {
                ElMessage.error('封面图片只能是图片格式!')
                return false
            }
            if (!isLt2M) {
                ElMessage.error('封面图片大小不能超过 2MB!')
                return false
            }
            return true
        }

        // 保存草稿
        const saveDraft = async () => {
            try {
                await formRef.value?.validate()
                ElMessage.success('草稿保存成功')
            } catch (error) {
                console.error('表单验证失败:', error)
            }
        }

        // 发布文章
        const publishArticle = async () => {
            try {
                await formRef.value?.validate()
                publishing.value = true

                // 模拟发布请求
                setTimeout(() => {
                    publishing.value = false
                    ElMessage.success('文章发布成功！')
                    router.push('/articles')
                }, 1500)
            } catch (error) {
                console.error('表单验证失败:', error)
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
            beforeCoverUpload,
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
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 30px;
    gap: 20px;
}

.cover-section {
    margin-bottom: 0;
}

.cover-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
}

.cover-uploader:hover {
    border-color: #409EFF;
}

.cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    line-height: 178px;
}

.cover-image {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    align-self: flex-end;
}

:deep(.el-upload) {
    width: 178px;
    height: 178px;
}
</style>
