<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2 class="title">登录</h2>
        <p class="subtitle">欢迎回来！请登录您的账号</p>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="login-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item
          label="用户名/邮箱"
          prop="username"
        >
          <el-input
            v-model="loginForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名或邮箱"
            size="large"
            clearable
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <router-link to="/forgot-password" class="forgot-link">
            忘记密码？
          </router-link>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ loading ? '登录中...' : '登录' }}
        </el-button>

        <div class="divider">
          <span class="divider-text">或使用其他方式登录</span>
        </div>

        <div class="social-login">
          <el-button
            v-for="item in socialLogins"
            :key="item.name"
            :type="item.type"
            size="large"
            class="social-btn"
            @click="handleSocialLogin(item.name)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            {{ item.label }}
          </el-button>
        </div>

        <div class="register-hint">
          还没有账号？
          <router-link to="/register" class="register-link">
            立即注册
          </router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  User,
  Lock,
  Platform,
  Share,
  Link
} from '@element-plus/icons-vue'

interface LoginForm {
  username: string
  password: string
}

const router = useRouter()
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})
const loginRules = {
  username: [
    { required: true, message: '请输入用户名/邮箱', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
}

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

interface SocialLogin {
  name: string
  label: string
  icon: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
}

const socialLogins: SocialLogin[] = [
  { name: 'github', label: 'GitHub登录', icon: 'Platform', type: 'default' },
  { name: 'weibo', label: '微博登录', icon: 'Share', type: 'danger' },
  { name: 'website', label: '个人网站', icon: 'Link', type: 'primary' }
]

const userStore = useUserStore()

const handleSubmit = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    const success = await userStore.login(loginForm.value.username, loginForm.value.password)
    
    if (success) {
      // 登录成功后重定向
      const redirect = router.currentRoute.value.query.redirect as string || '/'
      router.push(redirect)
    }

  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = (platform: string) => {
  // TODO: 处理第三方登录
  console.log('社交登录:', platform)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  :deep(.el-form-item__label) {
    line-height: 1;
    padding-bottom: 8px;
    font-weight: 500;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.forgot-link:hover {
  color: #79bbff;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 60px);
    height: 1px;
    background-color: #DCDFE6;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

.divider-text {
  background: #fff;
  padding: 0 16px;
  color: #909399;
  font-size: 14px;
}

.social-login {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-hint {
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.register-link {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  color: #79bbff;
}

:deep(.el-input__wrapper) {
  padding: 4px 11px;
}

:deep(.el-input__inner) {
  height: 40px;
}
</style>
