<template>
  <div class="main-layout">
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">个人博客</router-link>
        </div>
        <nav class="nav">
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/articles">文章</router-link></li>
            <li><router-link to="/archives">归档</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
          </ul>
        </nav>
        <div class="header-right">
          <div class="search-box">
            <input type="text" placeholder="搜索..." v-model="searchQuery" @keyup.enter="handleSearch" />
            <button @click="handleSearch">
              <el-icon>
                <Search />
              </el-icon>
            </button>
          </div>
          <div class="user-actions">
            <template v-if="isLoggedIn">
              <el-dropdown trigger="click">
                <div class="user-avatar">
                  <el-avatar :size="40" :src="userAvatar" />
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="goToUserCenter">
                      <el-icon>
                        <User />
                      </el-icon>
                      个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">
                      <el-icon>
                        <SwitchButton />
                      </el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <router-link to="/login" class="login-btn">登录</router-link>
              <router-link to="/register" class="register-btn">注册</router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <h3>个人博客</h3>
            <p>分享思想、创意和知识的地方</p>
          </div>
          <div class="footer-center">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/articles">文章</router-link></li>
              <li><router-link to="/archives">归档</router-link></li>
              <li><router-link to="/about">关于</router-link></li>
            </ul>
          </div>
          <div class="footer-right">
            <h4>联系我</h4>
            <div class="social-links">
              <a href="#" target="_blank"><el-icon>
                  <Location />
                </el-icon></a>
              <a href="#" target="_blank"><el-icon>
                  <Link />
                </el-icon></a>
              <a href="#" target="_blank"><el-icon>
                  <ChatDotRound />
                </el-icon></a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} 个人博客. 保留所有权利.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ChatDotRound, Link, Location, Search, SwitchButton, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getImageUrl } from '../utils/image'

export default {
  name: 'MainLayout',
  components: {
    Search,
    Location,
    Link,
    ChatDotRound,
    User,
    SwitchButton
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const searchQuery = ref('')

    // 使用 computed 属性从 store 获取登录状态
    const isLoggedIn = computed(() => store.getters['auth/isAuthenticated'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const userAvatar = computed(() => currentUser.value?.avatar || getImageUrl(40, 40, 13))

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchQuery.value }
        })
      }
    }

    const goToUserCenter = () => {
      router.push('/user')
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch (error) {
        console.error('退出失败:', error)
        ElMessage.error('退出失败，请稍后重试')
      }
    }

    return {
      searchQuery,
      isLoggedIn,
      userAvatar,
      handleSearch,
      goToUserCenter,
      handleLogout
    }
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  width: 100%;
}

/* Header Styles */
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 15px 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav li {
  margin-left: 20px;
}

.nav a {
  color: #555;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  transition: color 0.3s;
}

.nav a:hover,
.nav a.router-link-active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-box {
  display: flex;
  margin-right: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.search-box input {
  padding: 8px 12px;
  border: none;
  outline: none;
}

.search-box button {
  background-color: #f5f7fa;
  border: none;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-box button:hover {
  background-color: #e6e6e6;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.login-btn,
.register-btn {
  padding: 8px 16px;
  text-decoration: none;
  font-size: 14px;
  border-radius: 4px;
}

.login-btn {
  color: #409EFF;
  margin-right: 10px;
}

.register-btn {
  background-color: #409EFF;
  color: white;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 40px 0;
  background-color: #f5f7fa;
}

/* Footer Styles */
.footer {
  background-color: #2c3e50;
  color: #fff;
  padding: 40px 0 20px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
}

.footer-left,
.footer-center,
.footer-right {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-left h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.footer h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

.footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer li {
  margin-bottom: 10px;
}

.footer a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s;
}

.footer a:hover {
  color: #fff;
}

.social-links {
  display: flex;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.social-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
  }

  .nav {
    margin: 15px 0;
  }

  .header-right {
    flex-direction: column;
    width: 100%;
  }

  .search-box {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .footer-content {
    flex-direction: column;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 5px;
}
</style>
