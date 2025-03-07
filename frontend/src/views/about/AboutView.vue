<template>
  <div class="about-container">
    <el-row :gutter="20">
      <!-- 左侧主要内容 -->
      <el-col :span="16">
        <!-- 关于博主 -->
        <el-card class="about-section">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">关于博主</h2>
            </div>
          </template>
          
          <div class="author-profile">
            <div class="profile-header">
              <el-avatar :size="100" src="https://placeholder.co/200">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <div class="profile-info">
                <h3 class="author-name">博主昵称</h3>
                <p class="author-bio">热爱技术，热爱生活</p>
                <div class="social-links">
                  <el-button
                    v-for="social in socialLinks"
                    :key="social.name"
                    :type="social.type"
                    size="small"
                    circle
                    @click="openSocialLink(social.url)"
                  >
                    <el-icon><component :is="social.icon" /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>

            <div class="profile-content">
              <div class="content-section">
                <h4>个人简介</h4>
                <p>这里是一段个人简介，介绍自己的专业背景、技术栈、工作经历等。</p>
              </div>

              <div class="content-section">
                <h4>技术栈</h4>
                <div class="skill-tags">
                  <el-tag
                    v-for="skill in skills"
                    :key="skill.name"
                    :type="skill.type"
                    class="skill-tag"
                  >
                    {{ skill.name }}
                  </el-tag>
                </div>
              </div>

              <div class="content-section">
                <h4>联系方式</h4>
                <ul class="contact-list">
                  <li>
                    <el-icon><Message /></el-icon>
                    邮箱：example@example.com
                  </li>
                  <li>
                    <el-icon><Location /></el-icon>
                    坐标：城市名称
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 关于博客 -->
        <el-card class="about-section">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">关于博客</h2>
            </div>
          </template>

          <div class="blog-info">
            <div class="content-section">
              <h4>建站初衷</h4>
              <p>分享技术经验，记录学习过程，与大家一起进步。</p>
            </div>

            <div class="content-section">
              <h4>博客技术栈</h4>
              <ul class="tech-stack">
                <li>
                  <strong>前端：</strong>Vue3 + Element Plus + TypeScript
                </li>
                <li>
                  <strong>后端：</strong>Spring Boot + MyBatis + MySQL
                </li>
                <li>
                  <strong>部署：</strong>Docker + Nginx
                </li>
              </ul>
            </div>

            <div class="content-section">
              <h4>特别鸣谢</h4>
              <div class="thanks-list">
                <el-tag
                  v-for="(tech, index) in techThanks"
                  :key="index"
                  :type="tech.type"
                  class="thanks-item"
                >
                  {{ tech.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 更新日志 -->
        <el-card class="about-section">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">更新日志</h2>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="log in updateLogs"
              :key="log.date"
              :timestamp="log.date"
              :type="log.type"
            >
              <h4>{{ log.version }}</h4>
              <ul class="update-list">
                <li v-for="(item, index) in log.content" :key="index">
                  {{ item }}
                </li>
              </ul>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧边栏 -->
      <el-col :span="8">
        <!-- 博客统计 -->
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>博客统计</span>
            </div>
          </template>
          <ul class="stat-list">
            <li v-for="stat in blogStats" :key="stat.label">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </li>
          </ul>
        </el-card>

        <!-- 网站信息 -->
        <el-card class="site-info-card">
          <template #header>
            <div class="card-header">
              <span>网站信息</span>
            </div>
          </template>
          <ul class="site-info-list">
            <li>
              <span class="info-label">运行时间</span>
              <span class="info-value">365 天</span>
            </li>
            <li>
              <span class="info-label">建站日期</span>
              <span class="info-value">2024-03-06</span>
            </li>
            <li>
              <span class="info-label">最后更新</span>
              <span class="info-value">2025-03-06</span>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  UserFilled,
  Message,
  Location,
  Platform,
  Share,
  Link
} from '@element-plus/icons-vue'

const socialLinks = [
  { name: 'GitHub', icon: 'Platform', type: '', url: 'https://github.com' },
  { name: '微博', icon: 'Share', type: 'danger', url: 'https://weibo.com' },
  { name: '个人主页', icon: 'Link', type: 'primary', url: 'https://example.com' }
]

const skills = [
  { name: 'Vue3', type: 'success' },
  { name: 'TypeScript', type: 'info' },
  { name: 'Node.js', type: '' },
  { name: 'Java', type: 'danger' },
  { name: 'Spring Boot', type: 'success' },
  { name: 'MySQL', type: 'warning' },
  { name: 'Redis', type: 'danger' },
  { name: 'Docker', type: 'info' }
]

const techThanks = [
  { name: 'Vue.js', type: 'success' },
  { name: 'Element Plus', type: 'primary' },
  { name: 'Spring Boot', type: 'danger' },
  { name: 'MyBatis', type: 'warning' },
  { name: 'MySQL', type: 'info' }
]

const updateLogs = [
  {
    date: '2025-03-06',
    version: 'v1.0.0',
    type: 'primary',
    content: [
      '博客正式上线',
      '支持文章发布、评论功能',
      '实现用户注册登录功能'
    ]
  },
  {
    date: '2025-02-25',
    version: 'v0.9.0',
    type: 'info',
    content: [
      '完成前端页面开发',
      '集成 Markdown 编辑器',
      '优化移动端显示效果'
    ]
  }
]

const blogStats = [
  { label: '文章数量', value: '100+' },
  { label: '总访问量', value: '10000+' },
  { label: '评论数量', value: '500+' },
  { label: '注册用户', value: '200+' }
]

const openSocialLink = (url) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.about-container {
  padding: 20px;
}

.about-section {
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

.profile-header {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.profile-info {
  flex: 1;
}

.author-name {
  margin: 0 0 8px;
  font-size: 24px;
}

.author-bio {
  margin: 0 0 16px;
  color: #606266;
}

.social-links {
  display: flex;
  gap: 12px;
}

.profile-content {
  color: #606266;
  line-height: 1.6;
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #303133;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tech-stack {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-stack li {
  margin-bottom: 8px;
}

.thanks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.update-list {
  margin: 8px 0 0;
  padding-left: 20px;
  color: #606266;
}

.update-list li {
  margin-bottom: 4px;
}

.stat-card,
.site-info-card {
  margin-bottom: 20px;
}

.stat-list,
.site-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stat-list li,
.site-info-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
}

.stat-list li:last-child,
.site-info-list li:last-child {
  border-bottom: none;
}

.stat-label,
.info-label {
  color: #606266;
}

.stat-value,
.info-value {
  color: #303133;
  font-weight: 500;
}
</style>
