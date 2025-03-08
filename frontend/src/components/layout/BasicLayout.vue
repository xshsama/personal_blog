<template>
  <div v-if="!isLayoutMounted" class="loading-container">
    <el-loading :fullscreen="true" />
  </div>
  <div v-else class="layout-wrapper">
    <header class="layout-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <h1>个人博客</h1>
        </router-link>
      </div>
      <div class="header-center">
        <el-menu
          mode="horizontal"
          router
          :ellipsis="false"
          class="nav-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/articles">文章</el-menu-item>
          <el-menu-item index="/categories">分类</el-menu-item>
          <el-menu-item index="/tags">标签</el-menu-item>
          <el-menu-item index="/archives">归档</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章..."
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
          class="search-input"
        />
        
        <!-- 未登录状态显示登录按钮 -->
        <template v-if="!userStore.isLoggedIn">
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </template>
        
        <!-- 已登录状态显示用户菜单 -->
        <template v-else>
          <el-button 
            type="success" 
            class="write-btn"
            @click="handleWrite"
          >
            <el-icon><EditPen /></el-icon>
            写文章
          </el-button>
          
          <el-dropdown @command="handleCommand">
            <div class="user-avatar">
              <el-avatar 
                :size="32"
                :src="userStore.getUserInfo.avatar || defaultAvatar"
              />
              <span class="username">{{ userStore.getUserInfo.nickname }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="articles">
                  <el-icon><Document /></el-icon>我的文章
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </header>

    <div class="main-wrapper">
      <main class="main-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <footer class="layout-footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} 个人博客. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Search,
  User,
  Setting,
  Document,
  EditPen,
  SwitchButton
} from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/logo.svg'

const router = useRouter()
const userStore = useUserStore()
const isLayoutMounted = ref(false)

onMounted(() => {
  try {
    console.log('BasicLayout mounted')
    console.log('User store state:', userStore.$state)
    isLayoutMounted.value = true
  } catch (error) {
    console.error('Error in BasicLayout setup:', error)
  }
})
const searchKeyword = ref('')
const currentYear = computed(() => new Date().getFullYear())

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
    searchKeyword.value = ''
  }
}

const handleLogin = () => {
  router.push('/login')
}

const handleWrite = () => {
  router.push('/editor')
}

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user')
      break
    case 'articles':
      router.push('/user/articles')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      await userStore.logout()
      router.push('/')
      break
  }
}
</script>

<style lang="scss" scoped>
.loading-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  flex: 0 0 200px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 0 0 400px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  text-decoration: none;
  color: inherit;
}

.logo h1 {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  background: linear-gradient(45deg, #42b983, #2f9768);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  border-bottom: none;
  min-width: 500px;
  display: flex;
  justify-content: center;
  background-color: transparent;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
}

.search-input {
  max-width: 200px;
}

.write-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main-wrapper {
  flex: 1;
  width: 100%;
  background-color: var(--el-bg-color-page);
  padding: 80px 0 20px;
}

.main-container {
  width: 100%;
  max-width: var(--max-content-width, 1200px);
  margin: 0 auto;
  padding: 0 20px;
  min-height: calc(100vh - 160px);
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.layout-footer {
  flex-shrink: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  text-align: center;
  color: #909399;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;

  .el-menu-item {
    font-size: 15px;

    &.is-active {
      color: var(--el-color-primary) !important;
      border-bottom-color: var(--el-color-primary) !important;
    }
  }
}

:deep(.el-button--primary) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  
  &:hover, &:focus {
    background-color: var(--el-color-primary-light-3);
    border-color: var(--el-color-primary-light-3);
  }
}

:deep(.el-button--success) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
  
  &:hover, &:focus {
    background-color: var(--el-color-success-light-3);
    border-color: var(--el-color-success-light-3);
  }
}
</style>
