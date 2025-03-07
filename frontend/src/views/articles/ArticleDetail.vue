<template>
  <div class="article-detail-container">
    <el-row :gutter="20">
      <!-- 左侧文章内容 -->
      <el-col :span="18">
        <el-card class="article-content">
          <!-- 文章标题区 -->
          <div class="article-header">
            <h1 class="article-title">这是一个示例文章标题</h1>
            <div class="article-meta">
              <div class="meta-left">
                <span class="meta-item">
                  <el-icon><UserFilled /></el-icon>
                  作者名称
                </span>
                <span class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  2025-03-06
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  1024
                </span>
                <span class="meta-item">
                  <el-icon><ChatRound /></el-icon>
                  100
                </span>
              </div>
              <div class="meta-right">
                <el-button type="primary" plain size="small" @click="handleLike">
                  <el-icon><Promotion /></el-icon>
                  点赞 (88)
                </el-button>
                <el-button type="success" plain size="small" @click="handleShare">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
              </div>
            </div>
          </div>

          <!-- 文章主体内容 -->
          <div class="article-body markdown-body" v-html="renderedContent"></div>

          <!-- 文章底部 -->
          <div class="article-footer">
            <div class="article-tags">
              <el-tag v-for="tag in ['Vue3', 'JavaScript', 'Web开发']" 
                :key="tag" 
                class="tag-item"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="article-copyright">
              <p>
                <strong>本文作者：</strong>作者名称<br>
                <strong>本文链接：</strong>{{ currentUrl }}<br>
                <strong>版权声明：</strong>本博客所有文章除特别声明外，均采用 
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
                  target="_blank" rel="noopener">
                  CC BY-NC-SA 4.0
                </a> 许可协议。
              </p>
            </div>
          </div>

          <!-- 上一篇/下一篇导航 -->
          <div class="article-navigation">
            <div class="nav-item prev">
              <router-link to="/articles/prev" class="nav-link">
                <el-icon><ArrowLeft /></el-icon>
                上一篇：上一篇文章的标题
              </router-link>
            </div>
            <div class="nav-item next">
              <router-link to="/articles/next" class="nav-link">
                下一篇：下一篇文章的标题
                <el-icon><ArrowRight /></el-icon>
              </router-link>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h3 class="section-title">评论</h3>
            
            <!-- 评论输入框 -->
            <div class="comment-editor">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="4"
                placeholder="说点什么吧..."
              />
              <div class="editor-footer">
                <el-button type="primary" @click="submitComment">
                  发表评论
                </el-button>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="comments-list">
              <div v-for="i in 5" :key="i" class="comment-item">
                <div class="comment-avatar">
                  <el-avatar :size="40">用户{{ i }}</el-avatar>
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">用户{{ i }}</span>
                    <span class="comment-time">2025-03-0{{ i }}</span>
                  </div>
                  <div class="comment-body">
                    这是第 {{ i }} 条评论的内容。评论可以包含用户对文章的想法、建议或者疑问等。
                  </div>
                  <div class="comment-actions">
                    <el-button type="primary" link @click="handleReply(i)">
                      回复
                    </el-button>
                  </div>

                  <!-- 评论回复 -->
                  <div v-if="i === 1" class="reply-list">
                    <div v-for="j in 2" :key="j" class="reply-item">
                      <div class="comment-avatar">
                        <el-avatar :size="32">回复{{ j }}</el-avatar>
                      </div>
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-author">回复者{{ j }}</span>
                          <span class="comment-time">2025-03-0{{ j }}</span>
                        </div>
                        <div class="comment-body">
                          这是对评论的回复内容示例。
                        </div>
                        <div class="comment-actions">
                          <el-button type="primary" link @click="handleReply(i, j)">
                            回复
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论分页 -->
            <div class="comments-pagination">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="10"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧边栏 -->
      <el-col :span="6">
        <div class="sidebar">
          <!-- 作者信息 -->
          <el-card class="author-card">
            <div class="author-info">
              <el-avatar :size="64" src="https://placeholder.co/100">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <h3>作者名称</h3>
              <p>这里是作者的个人简介，可以写一些关于自己的介绍。</p>
            </div>
            <div class="author-stats">
              <div class="stat-item">
                <div class="stat-value">100</div>
                <div class="stat-label">文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">1.2k</div>
                <div class="stat-label">访问</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">500</div>
                <div class="stat-label">评论</div>
              </div>
            </div>
          </el-card>

          <!-- 目录导航 -->
          <el-card class="toc-card">
            <template #header>
              <div class="card-header">
                <span>文章目录</span>
              </div>
            </template>
            <div class="toc-content">
              <div v-for="i in 5" :key="i" :class="['toc-item', `level-${i % 3}`]">
                <router-link :to="'#header-' + i" class="toc-link">
                  标题 {{ i }}
                </router-link>
              </div>
            </div>
          </el-card>

          <!-- 相关文章 -->
          <el-card class="related-card">
            <template #header>
              <div class="card-header">
                <span>相关文章</span>
              </div>
            </template>
            <ul class="related-list">
              <li v-for="i in 5" :key="i">
                <router-link :to="`/articles/${i}`" class="related-link">
                  相关文章标题 {{ i }}
                </router-link>
              </li>
            </ul>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import {
  UserFilled,
  Calendar,
  View,
  ChatRound,
  Promotion,
  Share,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'

// 示例 Markdown 内容
const markdownContent = `
# 示例文章内容

这是一篇示例文章，展示 Markdown 渲染效果。

## 二级标题

### 三级标题

- 列表项 1
- 列表项 2
- 列表项 3

\`\`\`javascript
// 代码示例
const example = () => {
  console.log('Hello, World!')
}
\`\`\`

> 这是一段引用文本

**加粗文本** *斜体文本*

[链接文本](https://example.com)

![图片描述](https://placeholder.co/600x400)
`

const renderedContent = computed(() => {
  return marked(markdownContent)
})

const commentContent = ref('')
const currentUrl = window.location.href

const handleLike = () => {
  // 处理点赞逻辑
}

const handleShare = () => {
  // 处理分享逻辑
}

const handleReply = (commentId, replyId) => {
  // 处理回复逻辑
}

const submitComment = () => {
  // 处理提交评论逻辑
}
</script>

<style scoped>
.article-detail-container {
  padding: 20px;
}

.article-content {
  margin-bottom: 20px;
}

.article-header {
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.article-title {
  font-size: 2em;
  color: #303133;
  margin: 0 0 16px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-left {
  display: flex;
  gap: 16px;
}

.meta-item {
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-body {
  margin: 20px 0;
  line-height: 1.8;
}

.article-footer {
  border-top: 1px solid #EBEEF5;
  padding-top: 20px;
  margin-top: 40px;
}

.article-tags {
  margin-bottom: 20px;
}

.tag-item {
  margin-right: 8px;
}

.article-copyright {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  border-top: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  padding: 20px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #606266;
}

.nav-link:hover {
  color: #409EFF;
}

/* 评论区样式 */
.comments-section {
  margin-top: 40px;
}

.section-title {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.comment-editor {
  margin-bottom: 30px;
}

.editor-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.comment-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  margin-right: 8px;
}

.comment-time {
  color: #909399;
  font-size: 12px;
}

.comment-body {
  line-height: 1.6;
  color: #606266;
}

.comment-actions {
  margin-top: 8px;
}

.reply-list {
  margin-top: 16px;
  margin-left: 20px;
}

.reply-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.comments-pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 右侧边栏样式 */
.author-card,
.toc-card,
.related-card {
  margin-bottom: 20px;
}

.author-info {
  text-align: center;
  margin-bottom: 20px;
}

.author-info h3 {
  margin: 12px 0 8px;
}

.author-info p {
  color: #606266;
  font-size: 14px;
  margin: 0;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #EBEEF5;
  padding-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.toc-content {
  padding-left: 10px;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-item.level-1 { margin-left: 0; }
.toc-item.level-2 { margin-left: 16px; }
.toc-item.level-3 { margin-left: 32px; }

.toc-link {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
}

.toc-link:hover {
  color: #409EFF;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-list li {
  margin-bottom: 12px;
}

.related-link {
  text-decoration: none;
  color: #606266;
  font-size: 14px;
}

.related-link:hover {
  color: #409EFF;
}

/* Markdown 样式 */
:deep(.markdown-body) {
  color: #2c3e50;
  line-height: 1.7;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.markdown-body h1) {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

:deep(.markdown-body h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

:deep(.markdown-body h3) {
  font-size: 1.25em;
}

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

:deep(.markdown-body pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

:deep(.markdown-body img) {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}
</style>
