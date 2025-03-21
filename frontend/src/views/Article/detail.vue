<template>
  <div class="article-detail">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-content">
          <el-skeleton-item variant="h1" style="width: 80%" />
          <div class="skeleton-meta">
            <el-skeleton-item variant="text" style="width: 120px" />
            <el-skeleton-item variant="text" style="width: 120px" />
            <el-skeleton-item variant="text" style="width: 120px" />
          </div>
          <el-skeleton-item variant="text" style="width: 100%; height: 600px" />
        </div>
      </template>
      <template #default>
        <h1 class="article-title">{{ article?.title }}</h1>
        <div class="article-meta">
          <span class="meta-item">
            <el-icon>
              <Calendar />
            </el-icon>
            <span>{{ formatDate(article?.createdAt) }}</span>
          </span>
          <span class="meta-item">
            <el-icon>
              <View />
            </el-icon>
            <span>{{ formatNumber(article?.viewCount || 0) }} 阅读</span>
          </span>
          <span class="meta-item">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>{{ formatNumber(article?.commentCount || 0) }} 评论</span>
          </span>
          <span class="meta-item category">
            <el-icon>
              <Folder />
            </el-icon>
            <span>{{ article?.category }}</span>
          </span>
          <span v-if="isAuthor" class="meta-item actions">
            <el-button-group>
              <el-button size="small" type="primary" @click="editArticle">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteArticle">删除</el-button>
            </el-button-group>
          </span>
        </div>
        <div class="article-tags">
          <el-tag v-for="tag in article?.tags" :key="tag" size="small">{{ tag }}</el-tag>
        </div>
        <div class="article-content" v-if="article">
          <viewer :value="article.content" :plugins="config.plugins" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts">
import articleService from '@/services/article.service'
import { Article } from '@/types/article'
import { createMarkdownConfig } from '@/utils/markdown'
import { Viewer } from '@bytemd/vue-next'
import { Calendar, ChatDotRound, Folder, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ArticleDetail',
  components: {
    Viewer,
    Calendar,
    View,
    ChatDotRound,
    Folder
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const article = ref<Article | null>(null)
    const loading = ref(true)
    const config = createMarkdownConfig()

    const currentUser = computed(() => store.getters['auth/currentUser'])
    const isAuthor = computed(() =>
      currentUser.value?.id === article.value?.userId
    )

    const loadArticle = async () => {
      try {
        loading.value = true
        const id = parseInt(route.params.id as string)
        const response = await articleService.getArticle(id)
        article.value = response
      } catch (error) {
        console.error('获取文章详情失败:', error)
        ElMessage.error('获取文章详情失败')
        router.push('/articles')
      } finally {
        loading.value = false
      }
    }

    const deleteArticle = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要删除这篇文章吗？此操作不可恢复。',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const id = parseInt(route.params.id as string)
        await articleService.deleteArticle(id)
        ElMessage.success('文章已删除')
        router.push('/articles')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除文章失败:', error)
          ElMessage.error('删除文章失败')
        }
      }
    }

    const editArticle = () => {
      router.push(`/article/edit/${article.value?.id}`)
    }

    const formatDate = (dateString?: string) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const formatNumber = (num: number): string => {
      return num > 999 ? (num / 1000).toFixed(1) + 'k' : String(num)
    }

    onMounted(loadArticle)

    return {
      article,
      loading,
      config,
      isAuthor,
      formatDate,
      formatNumber,
      deleteArticle,
      editArticle
    }
  }
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-meta {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

.article-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 1rem;
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item .el-icon {
  font-size: 1.1em;
}

.category {
  color: var(--el-color-success);
}

.actions {
  margin-left: auto;
}

.article-tags {
  margin-bottom: 2rem;
}

.article-tags .el-tag {
  margin-right: 8px;
}

.article-content {
  line-height: 1.8;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

:deep(.markdown-body) {
  background-color: transparent;
}

:deep(.markdown-body pre) {
  background-color: var(--el-fill-color-light);
}

@media (max-width: 768px) {
  .article-detail {
    padding: 15px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 10px;
  }

  .actions {
    margin-left: 0;
    width: 100%;
  }
}
</style>
