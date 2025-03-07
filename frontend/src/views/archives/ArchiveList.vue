<template>
  <div class="archive-container">
    <el-row :gutter="20">
      <!-- 主要内容区 -->
      <el-col :span="18">
        <el-card class="archive-card">
          <template #header>
            <div class="archive-header">
              <h2 class="archive-title">文章归档</h2>
              <div class="archive-stats">
                共 {{ totalArticles }} 篇文章，{{ totalArchives }} 个归档
              </div>
            </div>
          </template>

          <!-- 归档时间线 -->
          <el-timeline>
            <el-timeline-item
              v-for="year in archives"
              :key="year.year"
              :timestamp="year.year + '年'"
              placement="top"
              type="primary"
            >
              <el-collapse v-model="expandedYears">
                <el-collapse-item :name="year.year">
                  <template #title>
                    <span class="year-title">{{ year.year }}年 ({{ year.count }}篇)</span>
                  </template>

                  <div
                    v-for="month in year.months"
                    :key="`${year.year}-${month.month}`"
                    class="month-section"
                  >
                    <h4 class="month-title">{{ month.month }}月</h4>
                    <ul class="article-list">
                      <li
                        v-for="article in month.articles"
                        :key="article.id"
                        class="article-item"
                      >
                        <div class="article-date">
                          {{ article.date }}
                        </div>
                        <div class="article-info">
                          <router-link
                            :to="`/articles/${article.id}`"
                            class="article-title"
                          >
                            {{ article.title }}
                          </router-link>
                          <div class="article-meta">
                            <span class="meta-item">
                              <el-icon><View /></el-icon>
                              {{ article.views }}
                            </span>
                            <span class="meta-item">
                              <el-icon><ChatRound /></el-icon>
                              {{ article.comments }}
                            </span>
                            <span class="meta-item category">
                              <el-tag size="small" type="info">
                                {{ article.category }}
                              </el-tag>
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :span="6">
        <el-card class="calendar-card">
          <template #header>
            <div class="card-header">
              <span>日历视图</span>
            </div>
          </template>
          <el-calendar v-model="currentDate">
            <template #dateCell="{ data }">
              <div class="calendar-cell">
                {{ data.day.split('-')[2] }}
                <div
                  v-if="hasArticles(data.day)"
                  class="article-indicator"
                ></div>
              </div>
            </template>
          </el-calendar>
        </el-card>

        <el-card class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>统计信息</span>
            </div>
          </template>
          <ul class="statistics-list">
            <li class="statistics-item">
              <div class="stat-label">文章总数</div>
              <div class="stat-value">{{ totalArticles }}</div>
            </li>
            <li class="statistics-item">
              <div class="stat-label">分类总数</div>
              <div class="stat-value">12</div>
            </li>
            <li class="statistics-item">
              <div class="stat-label">标签总数</div>
              <div class="stat-value">45</div>
            </li>
            <li class="statistics-item">
              <div class="stat-label">最后更新</div>
              <div class="stat-value">2025-03-06</div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { View, ChatRound } from '@element-plus/icons-vue'

// 模拟归档数据
const archives = [
  {
    year: 2025,
    count: 15,
    months: [
      {
        month: 3,
        articles: [
          {
            id: 1,
            title: '示例文章标题 1',
            date: '03-05',
            views: 256,
            comments: 12,
            category: '前端开发'
          },
          {
            id: 2,
            title: '示例文章标题 2',
            date: '03-03',
            views: 180,
            comments: 8,
            category: '后端开发'
          }
        ]
      },
      {
        month: 2,
        articles: [
          {
            id: 3,
            title: '示例文章标题 3',
            date: '02-28',
            views: 320,
            comments: 15,
            category: '开发工具'
          }
        ]
      }
    ]
  },
  {
    year: 2024,
    count: 28,
    months: [
      {
        month: 12,
        articles: [
          {
            id: 4,
            title: '示例文章标题 4',
            date: '12-25',
            views: 420,
            comments: 18,
            category: '前端开发'
          }
        ]
      }
    ]
  }
]

const expandedYears = ref([2025]) // 默认展开最新年份
const currentDate = ref(new Date())

// 计算总文章数
const totalArticles = computed(() => {
  return archives.reduce((total, year) => total + year.count, 0)
})

// 计算总归档数（年份数）
const totalArchives = computed(() => archives.length)

// 判断某一天是否有文章
const hasArticles = (day) => {
  // 这里可以实现实际的逻辑，判断某一天是否有文章发布
  // 示例实现：随机返回，实际应该根据真实数据判断
  return Math.random() > 0.8
}
</script>

<style scoped>
.archive-container {
  padding: 20px;
}

.archive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.archive-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.archive-stats {
  color: #909399;
  font-size: 14px;
}

.year-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.month-section {
  padding-left: 20px;
  margin-bottom: 20px;
}

.month-title {
  margin: 16px 0;
  color: #606266;
  font-size: 15px;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px dashed #EBEEF5;
}

.article-item:last-child {
  border-bottom: none;
}

.article-date {
  flex: 0 0 60px;
  color: #909399;
  font-size: 14px;
}

.article-info {
  flex: 1;
}

.article-title {
  display: block;
  color: #303133;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 15px;
}

.article-title:hover {
  color: #409EFF;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #909399;
  font-size: 13px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.calendar-card,
.statistics-card {
  margin-bottom: 20px;
}

.calendar-cell {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #409EFF;
}

.statistics-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.statistics-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
}

.statistics-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #606266;
}

.stat-value {
  color: #303133;
  font-weight: 600;
}

:deep(.el-timeline-item__node--large) {
  width: 16px;
  height: 16px;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 24px;
}

:deep(.el-collapse-item__header) {
  font-size: inherit;
}

:deep(.el-calendar-day) {
  height: 40px;
  padding: 4px;
}
</style>
