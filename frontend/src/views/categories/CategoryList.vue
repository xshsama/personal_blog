<template>
  <div class="category-list-container">
    <el-row :gutter="20">
      <!-- 左侧分类列表 -->
      <el-col :span="6">
        <el-card class="category-sidebar">
          <template #header>
            <div class="card-header">
              <span>文章分类</span>
              <span class="total-count">共 {{ categories.length }} 个分类</span>
            </div>
          </template>
          <el-menu
            :default-active="currentCategory"
            class="category-menu"
            @select="handleCategorySelect"
          >
            <el-menu-item
              v-for="category in categories"
              :key="category.id"
              :index="category.id.toString()"
            >
              <template #title>
                <span>{{ category.name }}</span>
                <span class="category-count">({{ category.count }})</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧文章列表 -->
      <el-col :span="18">
        <div class="category-content">
          <div class="category-header">
            <h2 class="category-title">
              {{ currentCategoryName }}
              <small class="category-subtitle">共 {{ currentCategoryCount }} 篇文章</small>
            </h2>
            <div class="category-actions">
              <el-radio-group v-model="sortBy" size="large">
                <el-radio-button label="newest">最新发布</el-radio-button>
                <el-radio-button label="popular">最多阅读</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="article-list">
            <el-card v-for="i in 10" :key="i" class="article-item">
              <div class="article-info">
                <h3 class="article-title">
                  <router-link :to="`/articles/${i}`">
                    分类下的文章标题 {{ i }}
                  </router-link>
                </h3>
                <div class="article-meta">
                  <span class="meta-item">
                    <el-icon><Calendar /></el-icon>
                    2025-03-{{ i }}
                  </span>
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ 100 * i }}
                  </span>
                  <span class="meta-item">
                    <el-icon><ChatRound /></el-icon>
                    {{ 10 * i }}
                  </span>
                </div>
                <p class="article-summary">
                  这是文章 {{ i }} 的摘要内容。在这里可以展示文章的主要内容概述，
                  帮助读者快速了解文章的主题。文章摘要通常包含文章中最重要的信息...
                </p>
                <div class="article-tags">
                  <el-tag size="small" type="info">标签1</el-tag>
                  <el-tag size="small" type="success">标签2</el-tag>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 50]"
              :total="100"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, View, ChatRound } from '@element-plus/icons-vue'

// 模拟分类数据
const categories = [
  { id: 1, name: '前端开发', count: 25 },
  { id: 2, name: '后端开发', count: 18 },
  { id: 3, name: '移动开发', count: 12 },
  { id: 4, name: '开发工具', count: 8 },
  { id: 5, name: '数据库', count: 15 },
  { id: 6, name: '运维部署', count: 10 },
  { id: 7, name: '编程语言', count: 20 },
  { id: 8, name: '设计模式', count: 6 },
]

const currentCategory = ref('1')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(10)

const currentCategoryName = computed(() => {
  const category = categories.find(c => c.id.toString() === currentCategory.value)
  return category ? category.name : '全部分类'
})

const currentCategoryCount = computed(() => {
  const category = categories.find(c => c.id.toString() === currentCategory.value)
  return category ? category.count : 0
})

const handleCategorySelect = (index) => {
  currentCategory.value = index
  currentPage.value = 1 // 重置页码
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.category-list-container {
  padding: 20px;
}

.category-sidebar {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-count {
  font-size: 14px;
  color: #909399;
}

.category-menu {
  border-right: none;
}

.category-count {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.category-content {
  min-height: calc(100vh - 200px);
}

.category-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.category-subtitle {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
  margin-left: 12px;
}

.article-item {
  margin-bottom: 20px;
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-title {
  margin: 0;
  font-size: 18px;
}

.article-title a {
  color: #303133;
  text-decoration: none;
}

.article-title a:hover {
  color: #409EFF;
}

.article-meta {
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

.article-summary {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.article-tags {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
