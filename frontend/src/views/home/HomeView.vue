<template>
  <div :class="$style.homePage">
    <el-row :gutter="20" class="row">
      <!-- 左侧主要内容区 -->
      <el-col :span="16">
        <!-- 最新文章列表 -->
        <div :class="$style.latestArticles">
          <h2 :class="$style.sectionTitle">最新文章</h2>
          <div :class="$style.articleList">
            <el-card v-for="i in 5" :key="i" :class="$style.articleCard">
              <div :class="$style.articleMeta">
                <span :class="$style.category">前端开发</span>
                <span class="date">2025-03-{{ i }}</span>
              </div>
              <h3 class="article-title">示例文章标题 {{ i }}</h3>
              <p class="article-summary">
                这是一段示例文章摘要，展示文章的主要内容。这里可以包含一些关键信息，以帮助读者快速了解文章的主要内容...
              </p>
              <div class="article-footer">
                <div class="article-tags">
                  <el-tag size="small">Vue3</el-tag>
                  <el-tag size="small" type="success">JavaScript</el-tag>
                </div>
                <div class="article-stats">
                  <span><el-icon>
                      <View />
                    </el-icon> 100</span>
                  <span><el-icon>
                      <ChatRound />
                    </el-icon> 10</span>
                </div>
              </div>
            </el-card>
          </div>
          <div class="pagination-container">
            <el-pagination background layout="prev, pager, next" :total="100" :page-size="10" />
          </div>
        </div>
      </el-col>

      <!-- 右侧边栏 -->
      <el-col :span="8">
        <!-- 博主信息 -->
        <el-card class="author-card">
          <div class="author-info">
            <el-avatar :size="64" src="https://placeholder.co/100">
              <el-icon>
                <UserFilled />
              </el-icon>
            </el-avatar>
            <h3>博主昵称</h3>
            <p>这里是博主的个人简介，可以写一些关于自己的介绍。</p>
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

        <!-- 热门文章 -->
        <el-card class="popular-articles">
          <template #header>
            <div class="card-header">
              <span>热门文章</span>
            </div>
          </template>
          <ul class="article-list-simple">
            <li v-for="i in 5" :key="i">
              <router-link to="/" class="article-link">
                热门文章标题 {{ i }}
              </router-link>
              <div class="article-meta-simple">
                <span><el-icon>
                    <View />
                  </el-icon> {{ 100 * i }}</span>
              </div>
            </li>
          </ul>
        </el-card>

        <!-- 分类标签 -->
        <el-card class="categories-card">
          <template #header>
            <div class="card-header">
              <span>分类标签</span>
            </div>
          </template>
          <div class="tag-cloud">
            <router-link v-for="i in 10" :key="i" :to="'/tags/' + i" class="tag-item">
              <el-tag :size="['mini', 'small', 'default'][i % 3]">
                标签 {{ i }}
              </el-tag>
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ChatRound, UserFilled, View } from '@element-plus/icons-vue';
</script>

<style lang="scss" module>
@use '../../assets/styles/mixins' as *;
@use '../../assets/styles/page';

.home-page {
  composes: page-container from global;

  :global(.el-card) {
    @extend .custom-card;

    .article-meta {
      margin-bottom: 12px;
      font-size: var(--el-font-size-small);
      color: var(--el-text-color-secondary);
    }

    .category {
      color: var(--el-color-primary);
      margin-right: 10px;
    }

    .article-title {
      margin: 0 0 12px;
      font-size: var(--el-font-size-large);
      font-weight: 600;
      color: var(--el-text-color-primary);
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .article-summary {
      margin: 0 0 16px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }

    .article-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .article-tags {
      .el-tag {
        margin-right: 8px;
      }
    }

    .article-stats {
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-small);

      span {
        margin-left: 16px;
        display: inline-flex;
        align-items: center;
      }

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.section-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

// 右侧边栏样式
.author-card,
.popular-articles,
.categories-card {
  margin-bottom: 20px;

  .author-info {
    text-align: center;
    margin-bottom: 20px;

    h3 {
      margin: 12px 0 8px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    p {
      color: var(--el-text-color-regular);
      font-size: var(--el-font-size-base);
      margin: 0;
    }
  }

  .author-stats {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid var(--el-border-color-lighter);
    padding-top: 20px;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .stat-label {
        font-size: var(--el-font-size-small);
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }
  }
}

.article-list-simple {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }
  }

  .article-link {
    text-decoration: none;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-base);
    @include text-truncate;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .article-meta-simple {
    margin-top: 4px;
    font-size: var(--el-font-size-small);
    color: var(--el-text-color-secondary);
  }
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tag-item {
    text-decoration: none;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.pagination-container {
  margin-top: 30px;
  @include flex-center;
}
</style>
