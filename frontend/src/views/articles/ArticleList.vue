<template>
  <div class="article-list-container">
    <el-row :gutter="20">
      <!-- 文章列表区域 -->
      <el-col :span="18">
        <div class="articles-wrapper">
          <div class="filter-bar">
            <el-select v-model="sortBy" placeholder="排序方式" size="large">
              <el-option label="最新发布" value="newest" />
              <el-option label="最多阅读" value="most-read" />
              <el-option label="最多评论" value="most-comments" />
            </el-select>
            
            <el-select v-model="category" placeholder="选择分类" size="large">
              <el-option label="全部分类" value="" />
              <el-option label="前端开发" value="frontend" />
              <el-option label="后端开发" value="backend" />
              <el-option label="开发工具" value="tools" />
            </el-select>
          </div>

          <div class="articles">
            <el-card v-for="i in 10" :key="i" class="article-item">
              <div class="article-header">
                <router-link :to="`/articles/${i}`" class="article-title">
                  文章标题 {{ i }} - 这是一个示例文章标题
                </router-link>
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
              </div>

              <div class="article-content">
                <div class="article-cover" v-if="i % 3 === 0">
                  <el-image 
                    :src="`https://placeholder.co/400x300?text=文章封面${i}`"
                    fit="cover"
                  />
                </div>
                <p class="article-summary">
                  这是文章 {{ i }} 的摘要内容。在这里可以展示文章的主要内容概述，帮助读者快速了解文章的主题。
                  文章摘要通常包含文章中最重要的信息，可以帮助读者决定是否需要阅读全文...
                </p>
              </div>

              <div class="article-footer">
                <div class="article-tags">
                  <el-tag size="small" type="info">JavaScript</el-tag>
                  <el-tag size="small" type="success">Vue3</el-tag>
                  <el-tag size="small" type="warning">Web开发</el-tag>
                </div>
                <el-button type="primary" link :icon="ArrowRight">
                  阅读全文
                </el-button>
              </div>
            </el-card>
          </div>

          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 50]"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="100"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :span="6">
        <div class="sidebar">
          <!-- 分类统计 -->
          <el-card class="side-card category-card">
            <template #header>
              <div class="card-header">
                <span>分类统计</span>
              </div>
            </template>
            <ul class="category-list">
              <li v-for="i in 5" :key="i" class="category-item">
                <router-link :to="`/categories/${i}`" class="category-link">
                  分类 {{ i }}
                  <el-tag size="small" type="info">{{ 10 * i }}</el-tag>
                </router-link>
              </li>
            </ul>
          </el-card>

          <!-- 标签云 -->
          <el-card class="side-card tag-card">
            <template #header>
              <div class="card-header">
                <span>标签云</span>
              </div>
            </template>
            <div class="tag-cloud">
              <router-link
                v-for="i in 20"
                :key="i"
                :to="`/tags/${i}`"
                class="tag-item"
              >
                <el-tag :size="['small', 'default', 'large'][i % 3]">
                  标签 {{ i }}
                </el-tag>
              </router-link>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, View, ChatRound, ArrowRight } from '@element-plus/icons-vue'

const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('newest')
const category = ref('')

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
}

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
}
</script>

<style scoped>
.article-list-container {
  padding: 20px;
}

.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
}

.article-item {
  margin-bottom: 20px;
}

.article-header {
  margin-bottom: 16px;
}

.article-title {
  display: block;
  font-size: 1.5em;
  font-weight: 600;
  color: #303133;
  text-decoration: none;
  margin-bottom: 8px;
}

.article-title:hover {
  color: #409EFF;
}

.article-meta {
  font-size: 14px;
  color: #909399;
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-content {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.article-cover {
  flex: 0 0 200px;
}

.article-cover .el-image {
  width: 200px;
  height: 150px;
  border-radius: 4px;
}

.article-summary {
  flex: 1;
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-tags {
  display: flex;
  gap: 8px;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.side-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 12px;
}

.category-item:last-child {
  margin-bottom: 0;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #606266;
  padding: 4px 0;
}

.category-link:hover {
  color: #409EFF;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  text-decoration: none;
}
</style>
