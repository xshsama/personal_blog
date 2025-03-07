<template>
  <div class="search-result-container">
    <el-row :gutter="20">
      <!-- 左侧搜索结果 -->
      <el-col :span="18">
        <el-card class="search-card">
          <!-- 搜索框 -->
          <div class="search-header">
            <el-input v-model="searchQuery" placeholder="搜索文章..." :prefix-icon="Search" size="large" clearable
              @keyup.enter="handleSearch" class="search-input" />
            <el-button type="primary" size="large" @click="handleSearch">
              搜索
            </el-button>
          </div>

          <!-- 搜索结果统计 -->
          <div class="result-stats" v-if="searchQuery">
            <p>
              关于 "<span class="keyword">{{ searchQuery }}</span>" 的搜索结果，
              共找到 <span class="count">{{ totalResults }}</span> 篇文章
            </p>
          </div>

          <!-- 搜索结果过滤器 -->
          <div class="result-filter">
            <el-radio-group v-model="sortBy" size="large">
              <el-radio-button label="relevance">相关度</el-radio-button>
              <el-radio-button label="newest">最新发布</el-radio-button>
              <el-radio-button label="popular">最多阅读</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 搜索结果列表 -->
          <div class="search-results" v-if="hasResults">
            <el-card v-for="result in searchResults" :key="result.id" class="result-item" shadow="hover">
              <div class="result-header">
                <router-link :to="`/articles/${result.id}`" class="result-title">
                  <span v-html="highlightKeyword(result.title)"></span>
                </router-link>
                <div class="result-meta">
                  <span class="meta-item">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    {{ result.date }}
                  </span>
                  <span class="meta-item">
                    <el-icon>
                      <View />
                    </el-icon>
                    {{ result.views }}
                  </span>
                  <span class="meta-item">
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ result.comments }}
                  </span>
                </div>
              </div>

              <p class="result-summary" v-html="highlightKeyword(result.summary)"></p>

              <div class="result-footer">
                <div class="result-tags">
                  <el-tag v-for="tag in result.tags" :key="tag" size="small" class="tag-item">
                    {{ tag }}
                  </el-tag>
                </div>
                <router-link :to="`/articles/${result.id}`" class="read-more">
                  阅读全文
                  <el-icon>
                    <ArrowRight />
                  </el-icon>
                </router-link>
              </div>
            </el-card>
          </div>

          <!-- 无搜索结果 -->
          <div v-else-if="searchQuery" class="no-results">
            <el-empty :description="'未找到与 ' + searchQuery + ' 相关的文章'">
              <template #extra>
                <p class="suggestion">建议：</p>
                <ul class="suggestion-list">
                  <li>检查输入的关键词是否正确</li>
                  <li>尝试使用不同的关键词</li>
                  <li>使用更简单的关键词</li>
                </ul>
              </template>
            </el-empty>
          </div>

          <!-- 分页 -->
          <div class="pagination" v-if="hasResults">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 50]" :total="totalResults" background
              layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </el-card>
      </el-col>

      <!-- 右侧边栏 -->
      <el-col :span="6">
        <!-- 热门搜索 -->
        <el-card class="hot-searches">
          <template #header>
            <div class="card-header">
              <span>热门搜索</span>
            </div>
          </template>
          <div class="hot-search-list">
            <router-link v-for="(keyword, index) in hotSearches" :key="index"
              :to="`/search?q=${encodeURIComponent(keyword)}`" class="hot-search-item">
              <span class="rank" :class="{ 'top-3': index < 3 }">
                {{ index + 1 }}
              </span>
              <span class="keyword">{{ keyword }}</span>
              <el-icon class="trend-icon">
                <CaretTop />
              </el-icon>
            </router-link>
          </div>
        </el-card>

        <!-- 搜索历史 -->
        <el-card class="search-history">
          <template #header>
            <div class="card-header">
              <span>搜索历史</span>
              <el-button link type="danger" @click="clearHistory">
                清空历史
              </el-button>
            </div>
          </template>
          <div class="history-list" v-if="searchHistory.length">
            <div v-for="(item, index) in searchHistory" :key="index" class="history-item">
              <el-icon>
                <Timer />
              </el-icon>
              <router-link :to="`/search?q=${encodeURIComponent(item)}`" class="history-keyword">
                {{ item }}
              </router-link>
              <el-icon class="delete-icon" @click="removeHistory(index)">
                <Close />
              </el-icon>
            </div>
          </div>
          <el-empty v-else description="暂无搜索历史" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  Calendar,
  CaretTop,
  ChatRound,
  Close,
  Search,
  Timer,
  View
} from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface SearchResult {
  id: number
  title: string
  summary: string
  date: string
  views: number
  comments: number
  tags: string[]
}

const route = useRoute()
const router = useRouter()

// 搜索相关
const searchQuery = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟搜索结果
const searchResults: SearchResult[] = [
  {
    id: 1,
    title: '这是一个示例文章标题，包含搜索关键词',
    summary: '这是文章摘要，可能包含搜索关键词。这里展示文章的主要内容概述，帮助用户快速了解文章的主题...',
    date: '2025-03-06',
    views: 1280,
    comments: 32,
    tags: ['前端开发', 'Vue3', 'JavaScript']
  },
  {
    id: 2,
    title: '另一个包含关键词的文章标题',
    summary: '另一篇文章的摘要内容，同样可能包含用户搜索的关键词，帮助用户判断文章是否相关...',
    date: '2025-03-05',
    views: 960,
    comments: 24,
    tags: ['后端开发', 'Java', 'Spring Boot']
  }
]

const totalResults = computed(() => searchResults.length * 10)
const hasResults = computed(() => searchResults.length > 0)

// 热门搜索
const hotSearches = [
  'Vue3 组件开发',
  'Spring Boot 实战',
  'Docker 部署',
  'Redis 缓存',
  'Nginx 配置',
  'TypeScript 教程',
  'React Hooks',
  'MySQL 优化'
]

// 搜索历史
const searchHistory = ref<string[]>([
  'Vue.js',
  'Spring Boot',
  'Docker',
  'TypeScript'
])

// 高亮搜索关键词
const highlightKeyword = (text: string): string => {
  if (!searchQuery.value) return text
  const escapedQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 处理搜索
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  currentPage.value = 1
  // TODO: 执行搜索
  // 添加到搜索历史
  addToHistory(searchQuery.value)
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 重新加载数据
}

// 搜索历史处理
const addToHistory = (keyword: string) => {
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(keyword)
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  // TODO: 保存到本地存储
}

const removeHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  // TODO: 更新本地存储
}

const clearHistory = () => {
  searchHistory.value = []
  // TODO: 清除本地存储
}

// 初始化
onMounted(() => {
  const query = route.query.q
  if (typeof query === 'string') {
    searchQuery.value = query
    handleSearch()
  }
})
</script>

<style scoped>
.search-result-container {
  padding: 20px;
}

.search-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
}

.result-stats {
  margin-bottom: 20px;
  color: #606266;
}

.keyword {
  color: #409EFF;
  font-weight: 600;
}

.count {
  color: #F56C6C;
  font-weight: 600;
}

.result-filter {
  margin-bottom: 20px;
}

.result-item {
  margin-bottom: 16px;
}

.result-header {
  margin-bottom: 12px;
}

.result-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  text-decoration: none;
  margin-bottom: 8px;
}

.result-title:hover {
  color: #409EFF;
}

.result-meta {
  display: flex;
  gap: 16px;
  color: #909399;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-summary {
  color: #606266;
  margin: 0 0 12px;
  line-height: 1.6;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-tags {
  display: flex;
  gap: 8px;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.hot-searches,
.search-history {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hot-search-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-search-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  text-decoration: none;
  padding: 4px 0;
}

.hot-search-item:hover {
  color: #409EFF;
}

.rank {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EBEEF5;
  border-radius: 4px;
  font-size: 12px;
}

.rank.top-3 {
  background: #F56C6C;
  color: white;
}

.trend-icon {
  margin-left: auto;
  color: #F56C6C;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.history-keyword {
  flex: 1;
  color: inherit;
  text-decoration: none;
}

.history-keyword:hover {
  color: #409EFF;
}

.delete-icon {
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .delete-icon {
  opacity: 1;
}

.no-results {
  padding: 40px 0;
}

.suggestion {
  color: #909399;
  text-align: left;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

:deep(.highlight) {
  color: #F56C6C;
  font-weight: 600;
}
</style>
