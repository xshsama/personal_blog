<template>
  <div class="tag-list-container">
    <!-- 标签云区域 -->
    <el-card class="tag-cloud-section">
      <template #header>
        <div class="section-header">
          <h2 class="section-title">标签云</h2>
          <span class="tag-count">共 {{ tags.length }} 个标签</span>
        </div>
      </template>
      <div class="tag-cloud">
        <router-link
          v-for="tag in tags"
          :key="tag.id"
          :to="`/tags/${tag.id}`"
          class="tag-item"
          :style="getTagStyle(tag.count)"
        >
          <el-tag
            :size="getTagSize(tag.count)"
            :effect="currentTag === tag.id.toString() ? 'dark' : 'light'"
          >
            {{ tag.name }}
            <span class="tag-count-label">({{ tag.count }})</span>
          </el-tag>
        </router-link>
      </div>
    </el-card>

    <!-- 标签下的文章列表 -->
    <el-card v-if="currentTag" class="article-list-section">
      <template #header>
        <div class="section-header">
          <h3 class="section-title">
            标签：{{ currentTagName }}
            <span class="article-count">共 {{ currentTagCount }} 篇文章</span>
          </h3>
          <el-radio-group v-model="sortBy" size="large">
            <el-radio-button label="newest">最新发布</el-radio-button>
            <el-radio-button label="popular">最多阅读</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="article-list">
        <el-timeline>
          <el-timeline-item
            v-for="i in 10"
            :key="i"
            :timestamp="'2025-03-' + i"
            placement="top"
          >
            <el-card class="article-card">
              <h4 class="article-title">
                <router-link :to="`/articles/${i}`">
                  标签下的文章标题 {{ i }}
                </router-link>
              </h4>
              <div class="article-meta">
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ 100 * i }} 阅读
                </span>
                <span class="meta-item">
                  <el-icon><ChatRound /></el-icon>
                  {{ 10 * i }} 评论
                </span>
              </div>
              <p class="article-summary">
                这是文章 {{ i }} 的摘要内容。在这里可以展示文章的主要内容概述，
                帮助读者快速了解文章的主题...
              </p>
              <div class="article-tags">
                <el-tag
                  v-for="j in 3"
                  :key="j"
                  size="small"
                  :type="['', 'success', 'warning'][j-1]"
                >
                  相关标签 {{ j }}
                </el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { View, ChatRound } from '@element-plus/icons-vue'

const route = useRoute()

// 模拟标签数据
const tags = [
  { id: 1, name: 'JavaScript', count: 45 },
  { id: 2, name: 'Vue3', count: 38 },
  { id: 3, name: 'React', count: 25 },
  { id: 4, name: 'TypeScript', count: 32 },
  { id: 5, name: 'Node.js', count: 28 },
  { id: 6, name: 'Python', count: 20 },
  { id: 7, name: 'Java', count: 18 },
  { id: 8, name: 'Spring Boot', count: 15 },
  { id: 9, name: 'Docker', count: 12 },
  { id: 10, name: 'Kubernetes', count: 8 },
  { id: 11, name: 'MySQL', count: 22 },
  { id: 12, name: 'MongoDB', count: 16 },
  { id: 13, name: 'Redis', count: 14 },
  { id: 14, name: 'Git', count: 30 },
  { id: 15, name: 'Linux', count: 25 },
]

const currentTag = ref(route.params.id || '')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(10)

const currentTagName = computed(() => {
  const tag = tags.find(t => t.id.toString() === currentTag.value)
  return tag ? tag.name : ''
})

const currentTagCount = computed(() => {
  const tag = tags.find(t => t.id.toString() === currentTag.value)
  return tag ? tag.count : 0
})

// 根据文章数量计算标签大小
const getTagSize = (count) => {
  if (count >= 30) return 'large'
  if (count >= 20) return 'default'
  return 'small'
}

// 根据文章数量计算标签样式
const getTagStyle = (count) => {
  const maxCount = Math.max(...tags.map(t => t.count))
  const minCount = Math.min(...tags.map(t => t.count))
  const fontSize = 14 + ((count - minCount) / (maxCount - minCount)) * 10

  return {
    margin: '8px',
    display: 'inline-block',
    fontSize: `${fontSize}px`
  }
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
.tag-list-container {
  padding: 20px;
}

.tag-cloud-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.tag-count {
  color: #909399;
  font-size: 14px;
}

.tag-cloud {
  padding: 20px;
  text-align: center;
}

.tag-item {
  text-decoration: none;
  transition: transform 0.2s;
}

.tag-item:hover {
  transform: scale(1.1);
}

.tag-count-label {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.8;
}

.article-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
  margin-left: 12px;
}

.article-list {
  margin-top: 20px;
}

.article-card {
  margin-bottom: 4px;
}

.article-title {
  margin: 0 0 12px;
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
  margin-bottom: 12px;
  color: #909399;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-summary {
  margin: 0 0 12px;
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

:deep(.el-timeline-item__node) {
  background-color: #409EFF;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}
</style>
