<template>
  <div class="articles-page">
    <h1 class="page-title">文章列表</h1>
    <!-- Filters Section -->
    <div class="filters">
      <div class="filter-item">
        <el-select v-model="filters.category" placeholder="选择分类" clearable @change="handleFilterChange">
          <el-option label="全部分类" value="" />
          <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" />
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="filters.tag" placeholder="选择标签" clearable @change="handleFilterChange">
          <el-option label="全部标签" value="" />
          <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="filters.sortBy" @change="handleFilterChange">
          <el-option label="最新发布" value="createdAt_desc" />
          <el-option label="最早发布" value="createdAt_asc" />
          <el-option label="最多浏览" value="viewCount_desc" />
          <el-option label="最多评论" value="commentCount_desc" />
        </el-select>
      </div>
      <div class="filter-search">
        <el-input v-model="filters.search" placeholder="搜索文章..." @keyup.enter="handleFilterChange" clearable>
          <template #append>
            <el-button @click="handleFilterChange">
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

      <el-empty v-else-if="articles.length === 0" description="没有找到符合条件的文章">
        <el-button @click="resetFilters">重置筛选</el-button>
      </el-empty>

      <div v-else class="articles-grid">
        <article-card v-for="article in articles" :key="article.id" :article="article" @click="viewArticle(article)" />
      </div>
    </div>

    <!-- Pagination -->
    <el-pagination v-if="articles.length > 0" v-model:current-page="currentPage" :page-size="pageSize" :total="total"
      layout="prev, pager, next" @current-change="handlePageChange" background />
  </div>
</template>

<script lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'
import articleService from '@/services/article.service'
import type { Article, ArticleResponse } from '@/types/article'
import { createMarkdownConfig } from '@/utils/markdown'
import { Loading, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Category {
  id: number
  name: string
}

interface Tag {
  id: number
  name: string
}

interface Filters {
  category: string
  tag: string
  sortBy: string
  sortDir: string
  search: string
}

export default defineComponent({
  name: 'ArticlesList',
  components: {
    ArticleCard,
    Search,
    Loading
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const articles = ref<Article[]>([])
    const loading = ref(true)
    const currentPage = ref(1)
    const pageSize = ref(8)
    const total = ref(0)

    const filters = ref<Filters>({
      category: '',
      tag: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
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

    // 加载文章列表
    const loadArticles = async () => {
      try {
        loading.value = true
        const [sortField, sortDirection] = filters.value.sortBy.split('_')
        const params = {
          page: currentPage.value - 1,
          size: pageSize.value,
          sortBy: sortField,
          sortDir: sortDirection || filters.value.sortDir
        }

        const response = await articleService.getArticles(params) as ArticleResponse
        articles.value = response.content
        total.value = response.totalElements
      } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('获取文章列表失败')
      } finally {
        loading.value = false
      }
    }

    // 搜索文章
    const searchArticles = async () => {
      try {
        loading.value = true
        const [sortField, sortDirection] = filters.value.sortBy.split('_')
        const params = {
          page: currentPage.value - 1,
          size: pageSize.value,
          sortBy: sortField,
          sortDir: sortDirection || filters.value.sortDir,
          keyword: filters.value.search,
          category: filters.value.category,
          tag: filters.value.tag
        }

        const response = await articleService.searchArticles(params) as ArticleResponse
        articles.value = response.content
        total.value = response.totalElements
      } catch (error) {
        console.error('搜索文章失败:', error)
        ElMessage.error('搜索文章失败')
      } finally {
        loading.value = false
      }
    }

    // 处理页码改变
    const handlePageChange = (page: number) => {
      currentPage.value = page
      if (filters.value.search || filters.value.category || filters.value.tag) {
        searchArticles()
      } else {
        loadArticles()
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 处理过滤条件改变
    const handleFilterChange = () => {
      currentPage.value = 1
      if (filters.value.search || filters.value.category || filters.value.tag) {
        searchArticles()
      } else {
        loadArticles()
      }
    }

    // 重置过滤条件
    const resetFilters = () => {
      filters.value = {
        category: '',
        tag: '',
        sortBy: 'createdAt',
        sortDir: 'desc',
        search: ''
      }
      handleFilterChange()
    }

    // 查看文章详情
    const viewArticle = (article: Article) => {
      router.push(`/article/${article.id}`)
    }

    onMounted(() => {
      // 从 URL 参数中恢复过滤条件
      const { category, tag, search, page } = route.query
      if (category) filters.value.category = category as string
      if (tag) filters.value.tag = tag as string
      if (search) filters.value.search = search as string
      if (page) currentPage.value = parseInt(page as string)

      if (filters.value.search || filters.value.category || filters.value.tag) {
        searchArticles()
      } else {
        loadArticles()
      }
    })

    return {
      articles,
      categories,
      tags,
      filters,
      loading,
      currentPage,
      pageSize,
      total,
      markdownConfig,
      handlePageChange,
      handleFilterChange,
      resetFilters,
      viewArticle
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