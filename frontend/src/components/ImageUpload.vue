<template>
    <div class="image-upload">
        <el-upload v-if="!modelValue" class="upload-trigger" :http-request="customUpload" :show-file-list="false"
            accept="image/*" :multiple="false">
            <el-icon class="upload-icon">
                <Plus />
            </el-icon>
            <div class="upload-text">点击上传封面图片</div>
        </el-upload>
        <div v-else class="image-preview">
            <img :src="modelValue" :alt="alt">
            <div class="image-actions">
                <el-button-group>
                    <el-button size="small" type="primary" @click="handleReplace">
                        <el-icon>
                            <RefreshLeft />
                        </el-icon>
                        更换
                    </el-button>
                    <el-button size="small" type="danger" @click="handleRemove">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        移除
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileChange">
    </div>
</template>

<script lang="ts">
import imageService from '@/services/image.service'
import { Delete, Plus, RefreshLeft } from '@element-plus/icons-vue'
import type { UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'ImageUpload',
    components: {
        Plus,
        RefreshLeft,
        Delete
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        alt: {
            type: String,
            default: 'Cover Image'
        }
    },
    emits: ['update:value', 'upload-success', 'upload-error'],
    setup(props, { emit }) {
        const fileInput = ref<HTMLInputElement | null>(null)

        const customUpload = async (options: UploadRequestOptions) => {
            try {
                const file = options.file as File
                const url = await imageService.uploadImage(file)
                emit('update:value', url)
                emit('upload-success', url)
                ElMessage.success('图片上传成功')
            } catch (error) {
                console.error('图片上传失败:', error)
                const err = error instanceof Error ? error : new Error('图片上传失败')
                emit('upload-error', err)
                ElMessage.error('图片上传失败，请重试')
            }
        }

        const handleReplace = () => {
            fileInput.value?.click()
        }

        const handleRemove = () => {
            emit('update:value', '')
        }

        const handleFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement
            if (target.files && target.files[0]) {
                const file = target.files[0]
                customUpload({ file } as UploadRequestOptions)
                target.value = '' // 重置 input 以允许选择相同的文件
            }
        }

        return {
            fileInput,
            customUpload,
            handleReplace,
            handleRemove,
            handleFileChange
        }
    }
})
</script>

<style scoped>
.image-upload {
    width: 100%;
    height: 200px;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    position: relative;
}

.upload-trigger {
    width: 100%;
    height: 100%;
    border: 2px dashed var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s;
}

.upload-trigger:hover {
    border-color: var(--el-color-primary);
}

.upload-icon {
    font-size: 28px;
    color: var(--el-text-color-secondary);
    margin-bottom: 8px;
}

.upload-text {
    color: var(--el-text-color-secondary);
    font-size: 14px;
}

.image-preview {
    width: 100%;
    height: 100%;
    position: relative;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-preview:hover .image-actions {
    opacity: 1;
}
</style>
