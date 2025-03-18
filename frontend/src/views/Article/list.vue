<template>
  <div class="articles-page">
    <h1 class="page-title">文章列表</h1>
    <!-- Filters Section -->
    <div class="filters">
      <div class="filter-item">
        <el-select v-model="filters.category" placeholder="选择分类" clearable @change="filterArticles">
          <el-option label="全部分类" value="" />
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="filters.tag" placeholder="选择标签" clearable @change="filterArticles">
          <el-option label="全部标签" value="" />
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="filters.sortBy" @change="filterArticles">
          <el-option label="最新发布" value="date_desc" />
          <el-option label="最早发布" value="date_asc" />
          <el-option label="最多浏览" value="views" />
          <el-option label="最多评论" value="comments" />
        </el-select>
      </div>
      <div class="filter-search">
        <el-input v-model="filters.search" placeholder="搜索文章..." @keyup.enter="filterArticles" clearable>
          <template #append>
            <el-button @click="filterArticles">
              <el-icon>
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="articles-container">
      <el-empty v-if="loading" :description="false">
        <template #image>
          <el-icon class="loading-icon">
            <Loading />
          </el-icon>
        </template>
        <span>加载中...</span>
      </el-empty>

      <el-empty v-else-if="filteredArticles.length === 0" description="没有找到符合条件的文章">
        <el-button @click="resetFilters">重置筛选</el-button>
      </el-empty>

      <div v-else class="articles-grid">
        <article-card v-for="article in filteredArticles" :key="article.id" :article="article"
          @click="showArticlePreview(article)" />
      </div>
    </div>

    <!-- Preview Dialog -->
    <el-dialog v-model="previewVisible" :title="selectedArticle?.title" width="80%" destroy-on-close>
      <div class="preview-content">
        <viewer v-if="selectedArticle" :value="selectedArticle.content" :plugins="markdownConfig.plugins" />
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="viewFullArticle">
          查看全文
        </el-button>
      </template>
    </el-dialog>

    <!-- Pagination -->
    <el-pagination v-if="filteredArticles.length > 0" v-model:current-page="currentPage" :page-size="articlesPerPage"
      :total="totalFilteredArticles" layout="prev, pager, next" @current-change="changePage" background />
  </div>
</template>

<script lang="ts">
import { createMarkdownConfig } from '@/utils/markdown'
import { Viewer } from '@bytemd/vue-next'
import { Loading, Search } from '@element-plus/icons-vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleCard from '../../components/ArticleCard.vue'

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  summary: string
  content: string
  cover: string
  createdAt: string
  author: string
  category: string
  tags: string[]
  views: number
  commentsCount: number
}

interface Filters {
  category: string
  tag: string
  sortBy: string
  search: string
}

export default defineComponent({
  name: 'ArticlesList',
  components: {
    ArticleCard,
    Viewer,
    Search,
    Loading
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const articles = ref<Article[]>([])
    const loading = ref(true)
    const currentPage = ref(1)
    const articlesPerPage = ref(8)
    const previewVisible = ref(false)
    const selectedArticle = ref<Article | null>(null)

    const filters = ref<Filters>({
      category: '',
      tag: '',
      sortBy: 'date_desc',
      search: ''
    })

    const categories = ref<Category[]>([
      { id: 1, name: '前端' },
      { id: 2, name: '后端' },
      { id: 3, name: 'DevOps' },
      { id: 4, name: '数据库' },
      { id: 5, name: '移动开发' },
      { id: 6, name: '机器学习' }
    ])

    const tags = ref<Tag[]>([
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Vue' },
      { id: 3, name: 'React' },
      { id: 4, name: 'Node.js' },
      { id: 5, name: 'TypeScript' },
      { id: 6, name: 'CSS' }
    ])

    const markdownConfig = createMarkdownConfig()

    const filteredArticles = computed(() => {
      let result = [...articles.value]

      if (filters.value.category) {
        result = result.filter(article => {
          const categoryId = getCategoryId(article.category)
          return categoryId === parseInt(filters.value.category)
        })
      }

      if (filters.value.tag) {
        result = result.filter(article => {
          return article.tags.some(tag => {
            const tagId = getTagId(tag)
            return tagId === parseInt(filters.value.tag)
          })
        })
      }

      if (filters.value.search.trim()) {
        const searchTerm = filters.value.search.toLowerCase()
        result = result.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary.toLowerCase().includes(searchTerm)
        )
      }

      switch (filters.value.sortBy) {
        case 'date_asc':
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'date_desc':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'views':
          result.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        case 'comments':
          result.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
          break
      }

      const startIndex = (currentPage.value - 1) * articlesPerPage.value
      return result.slice(startIndex, startIndex + articlesPerPage.value)
    })

    const totalFilteredArticles = computed(() => {
      let result = [...articles.value]

      if (filters.value.category) {
        result = result.filter(article => {
          const categoryId = getCategoryId(article.category)
          return categoryId === parseInt(filters.value.category)
        })
      }

      if (filters.value.tag) {
        result = result.filter(article => {
          return article.tags.some(tag => {
            const tagId = getTagId(tag)
            return tagId === parseInt(filters.value.tag)
          })
        })
      }

      if (filters.value.search.trim()) {
        const searchTerm = filters.value.search.toLowerCase()
        result = result.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.summary.toLowerCase().includes(searchTerm)
        )
      }

      return result.length
    })

    const filterArticles = () => {
      currentPage.value = 1
      updateUrlParams()
    }

    const resetFilters = () => {
      filters.value = {
        category: '',
        tag: '',
        sortBy: 'date_desc',
        search: ''
      }
      filterArticles()
    }

    const changePage = (page: number) => {
      currentPage.value = page
      updateUrlParams()
    }

    const getCategoryId = (categoryName: string): number | null => {
      const category = categories.value.find(cat => cat.name === categoryName)
      return category ? category.id : null
    }

    const getTagId = (tagName: string): number | null => {
      const tag = tags.value.find(t => t.name === tagName)
      return tag ? tag.id : null
    }

    const showArticlePreview = (article: Article) => {
      selectedArticle.value = article
      previewVisible.value = true
    }

    const viewFullArticle = () => {
      if (selectedArticle.value) {
        router.push(`/article/${selectedArticle.value.id}`)
      }
    }

    const updateUrlParams = () => {
      router.push({
        query: {
          ...(filters.value.category && { category: filters.value.category }),
          ...(filters.value.tag && { tag: filters.value.tag }),
          ...(filters.value.search && { search: filters.value.search }),
          ...(currentPage.value > 1 && { page: currentPage.value.toString() })
        }
      })
    }

    const fetchArticles = () => {
      loading.value = true
      // 模拟 API 调用
      setTimeout(() => {
        articles.value = [
          {
            id: 1,
            title: '开始使用 Vue 3',
            summary: '学习如何设置你的第一个 Vue 3 项目并探索新的组合式 API。',
            content: `# 开始使用 Vue 3
## 简介
Vue 3 是一个革命性的升级版本，带来了许多激动人心的新特性。

## 主要特性
1. 组合式 API
2. Teleport
3. Fragments
4. 更好的 TypeScript 支持

## 代码示例
\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    return {
      count,
      double
    }
  }
}
\`\`\``,
            cover: 'https://via.placeholder.com/800x400',
            createdAt: '2023-05-15T10:00:00',
            author: '张三',
            category: '前端',
            tags: ['Vue', 'JavaScript'],
            views: 1250,
            commentsCount: 8
          },
          // ... 其他文章
        ]
        loading.value = false
      }, 1000)
    }

    onMounted(() => {
      fetchArticles()
      // 检查 URL 参数中的过滤条件
      const { category, tag, search, page } = route.query
      if (category) filters.value.category = category as string
      if (tag) filters.value.tag = tag as string
      if (search) filters.value.search = search as string
      if (page) currentPage.value = parseInt(page as string)
    })

    return {
      articles,
      categories,
      tags,
      filters,
      loading,
      currentPage,
      articlesPerPage,
      filteredArticles,
      totalFilteredArticles,
      previewVisible,
      selectedArticle,
      markdownConfig,
      filterArticles,
      resetFilters,
      changePage,
      showArticlePreview,
      viewFullArticle
    }
  }
})
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
  color: var(--el-text-color-primary);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.filter-item {
  min-width: 200px;
}

.filter-search {
  flex: 1;
  min-width: 200px;
}

.articles-container {
  min-height: 400px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.loading-icon {
  font-size: 32px;
  animation: rotate 2s linear infinite;
}

.preview-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .filter-item,
  .filter-search {
    width: 100%;
  }
}
</style>