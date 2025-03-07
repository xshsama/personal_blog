<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2 class="title">注册账号</h2>
        <p class="subtitle">欢迎加入我们！创建您的账号</p>
      </div>

      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
        class="register-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="registerForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="registerForm.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱地址"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="registerForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model="registerForm.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
            size="large"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item class="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意
            <el-link type="primary" @click="showAgreement">
              用户协议
            </el-link>
            和
            <el-link type="primary" @click="showPrivacy">
              隐私政策
            </el-link>
          </el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </el-button>

        <div class="divider">
          <span class="divider-text">或使用其他方式注册</span>
        </div>

        <div class="social-register">
          <el-button
            v-for="item in socialLogins"
            :key="item.name"
            :type="item.type"
            size="large"
            class="social-btn"
            @click="handleSocialRegister(item.name)"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            {{ item.label }}
          </el-button>
        </div>

        <div class="login-hint">
          已有账号？
          <router-link to="/login" class="login-link">
            立即登录
          </router-link>
        </div>
      </el-form>
    </div>

    <!-- 用户协议对话框 -->
    <el-dialog
      v-model="agreementVisible"
      title="用户协议"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="agreement-content">
        <h3>用户协议内容</h3>
        <p>这里是用户协议的详细内容...</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="agreementVisible = false">关闭</el-button>
          <el-button type="primary" @click="agreementVisible = false">
            我已阅读
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 隐私政策对话框 -->
    <el-dialog
      v-model="privacyVisible"
      title="隐私政策"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="privacy-content">
        <h3>隐私政策内容</h3>
        <p>这里是隐私政策的详细内容...</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="privacyVisible = false">关闭</el-button>
          <el-button type="primary" @click="privacyVisible = false">
            我已阅读
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import {
  User,
  Message,
  Lock,
  Platform,
  Share,
  Link
} from '@element-plus/icons-vue'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreement: boolean
}

const router = useRouter()
const registerForm = ref<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ],
  agreement: [
    {
      validator: (_: any, value: boolean, callback: any) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const agreementVisible = ref(false)
const privacyVisible = ref(false)

const socialLogins = [
  { name: 'github', label: 'GitHub注册', icon: 'Platform', type: '' },
  { name: 'weibo', label: '微博注册', icon: 'Share', type: 'danger' },
  { name: 'website', label: '个人网站', icon: 'Link', type: 'primary' }
]

const handleSubmit = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true

    // TODO: 调用注册API
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 注册成功后跳转到登录页
    router.push('/login')

  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSocialRegister = (platform: string) => {
  // TODO: 处理第三方注册
  console.log('社交注册:', platform)
}

const showAgreement = () => {
  agreementVisible.value = true
}

const showPrivacy = () => {
  privacyVisible.value = true
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.register-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.register-header {
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

.register-form {
  :deep(.el-form-item__label) {
    line-height: 1;
    padding-bottom: 8px;
    font-weight: 500;
  }
}

.agreement {
  margin-bottom: 24px;
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

.social-register {
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

.login-hint {
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.login-link {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  color: #79bbff;
}

:deep(.el-input__wrapper) {
  padding: 4px 11px;
}

:deep(.el-input__inner) {
  height: 40px;
}

.agreement-content,
.privacy-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
