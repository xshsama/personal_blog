<template>
  <div class="auth-page">
    <!-- 左侧装饰区域 -->
    <div class="auth-decoration">
      <div class="decoration-content">
        <div class="logo">
          <el-icon class="logo-icon"><Edit /></el-icon>
          <span class="logo-text">个人博客</span>
        </div>
        <h2 class="decoration-title">分享知识,<br>连接世界!</h2>
        <p class="decoration-desc">随时随地记录和分享您的想法、经验和见解</p>
        <div class="decoration-features">
          <div class="feature-item">
            <el-icon><Document /></el-icon>
            <span>撰写技术文章</span>
          </div>
          <div class="feature-item">
            <el-icon><Collection /></el-icon>
            <span>知识归档整理</span>
          </div>
          <div class="feature-item">
            <el-icon><Share /></el-icon>
            <span>社区互动交流</span>
          </div>
        </div>
      </div>
      <div class="decoration-footer">
        <p>© 2025 个人博客. 保留所有权利</p>
      </div>
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="auth-form">
      <div class="form-wrapper">
        <div class="form-header">
          <h1 class="form-title">
            <el-icon><Key /></el-icon>
            欢迎回来
          </h1>
          <p class="form-subtitle">请登录您的账户</p>
        </div>
        
        <transition name="fade-slide" appear>
          <el-form 
            ref="formRef" 
            :model="loginForm" 
            :rules="rules" 
            @submit.prevent="handleSubmit"
            label-position="top"
            class="login-form"
          >
            <el-form-item label="用户名/电子邮箱" prop="username">
              <el-input 
                v-model="loginForm.username" 
                prefix-icon="User" 
                placeholder="请输入用户名或电子邮箱"
                :class="{ 'input-focus': activeField === 'username' }"
                autofocus
                @focus="activeField = 'username'"
                @blur="activeField = ''"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="loginForm.password" 
                prefix-icon="Lock" 
                type="password" 
                placeholder="请输入密码"
                show-password
                :class="{ 'input-focus': activeField === 'password' }"
                @focus="activeField = 'password'"
                @blur="activeField = ''"
                @keyup.enter="handleSubmit"
              ></el-input>
            </el-form-item>
            
            <div class="form-options">
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <el-button link type="primary" @click="forgotPassword" class="forgot-btn">忘记密码?</el-button>
            </div>
            
            <el-form-item>
              <el-button 
                type="primary" 
                native-type="submit" 
                :loading="loading" 
                :disabled="loading"
                class="login-button"
              >
                <span v-if="!loading">登录</span>
                <span v-else class="loading-text">
                  正在登录
                  <span class="dot-animation">...</span>
                </span>
              </el-button>
            </el-form-item>
          </el-form>
        </transition>
        
        <!-- 第三方登录 -->
        <div class="third-party-login">
          <p class="divider"><span>其他登录方式</span></p>
          <div class="third-party-buttons">
            <el-tooltip content="微信登录" placement="top" :show-after="300">
              <el-button type="success" circle class="social-button">
                <el-icon><ChatDotRound /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="QQ登录" placement="top" :show-after="300">
              <el-button type="primary" circle class="social-button">
                <el-icon><MessageBox /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="微博登录" placement="top" :show-after="300">
              <el-button type="danger" circle class="social-button">
                <el-icon><Platform /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
        
        <div class="register-link">
          还没有账号? <el-button link type="primary" @click="navigateToRegister" class="register-btn">立即注册</el-button>
        </div>
      </div>
      
      <div class="form-footer">
        <p>登录即表示您同意我们的 <el-link>服务条款</el-link> 和 <el-link>隐私政策</el-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatDotRound,
  Collection,
  Document,
  Edit,
  Key,
  Lock,
  MessageBox,
  Platform,
  Share,
  User
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginView',
  components: {
    User, 
    Lock, 
    Key, 
    ChatDotRound, 
    Platform, 
    MessageBox, 
    Edit, 
    Document, 
    Collection, 
    Share
  },
  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const activeField = ref('');
    const loginStatus = ref('idle'); // idle, loading, success, error
    const errorMessage = ref('');
    
    const loginForm = reactive({
      username: '',
      password: '',
      rememberMe: false
    });
    
    const loading = ref(false);
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名或电子邮箱', trigger: 'blur' },
        { min: 3, message: '用户名长度不能少于3个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
      ]
    };
    
    const handleSubmit = async () => {
      if (!formRef.value) return;
      
      try {
        await formRef.value.validate();
        loading.value = true;
        loginStatus.value = 'loading';
        
        // 真实API调用
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginForm)
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            loginStatus.value = 'success';
            ElMessage.success({
              message: '登录成功!',
              duration: 2000
            });

            // 延迟跳转,给用户一个视觉反馈的时间
            setTimeout(() => {
              router.push({ name: 'Home' });
            }, 500);
          } else {
            const errorData = await response.json();
            loginStatus.value = 'error';
            errorMessage.value = errorData.message || '登录失败,请稍后再试';
            ElMessage.error(errorMessage.value);
          }
        } catch (error) {
          console.error('登录请求失败:', error);
          loginStatus.value = 'error';
          errorMessage.value = '登录失败,请稍后再试';
          ElMessage.error(errorMessage.value);
        } finally {
          loading.value = false;
        }
      } catch (error) {
        console.error('验证失败:', error);
      }
    };
    
    const forgotPassword = () => {
      ElMessage({
        message: '忘记密码功能尚未实现,请联系管理员',
        type: 'info',
        duration: 3000
      });
    };
    
    const navigateToRegister = () => {
      router.push({ name: 'Register' });
    };
    
    return {
      formRef,
      loginForm,
      rules,
      loading,
      activeField,
      loginStatus,
      errorMessage,
      handleSubmit,
      forgotPassword,
      navigateToRegister
    };
  }
});
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧装饰区域样式 */
.auth-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
}

.auth-decoration::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('#') center/cover no-repeat;
  opacity: 0.1;
  z-index: 0;
}

.decoration-content {
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 80px;
}

.logo-icon {
  font-size: 2rem;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
}

.decoration-title {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 20px;
  animation: fadeInUp 1s ease;
}

.decoration-desc {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
  animation: fadeInUp 1.2s ease;
}

.decoration-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 1.4s ease;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.feature-item .el-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 50%;
}

.decoration-footer {
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 右侧表单区域样式 */
.auth-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.form-wrapper {
  width: 100%;
  max-width: 450px;
  margin-bottom: 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;
  padding: 10px 0;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

.form-subtitle {
  color: #606266;
  font-size: 1.1rem;
  margin-top: 5px;
}

.login-form {
  animation: fadeIn 0.8s ease;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.forgot-btn {
  font-size: 0.9rem;
}

.login-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.loading-text {
  position: relative;
}

.dot-animation {
  display: inline-block;
  animation: dotAnimation 1.5s infinite;
}

/* 第三方登录样式 */
.third-party-login {
  margin-top: 30px;
  text-align: center;
}

.divider {
  display: flex;
  align-items: center;
  color: #909399;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #dcdfe6;
}

.divider span {
  padding: 0 15px;
  font-size: 0.9rem;
}

.third-party-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.social-button {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 40px;
  height: 40px;
}

.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 注册链接样式 */
.register-link {
  text-align: center;
  margin-top: 30px;
  color: #606266;
  font-size: 0.95rem;
}

.register-btn {
  font-weight: 600;
  font-size: 0.95rem;
}

.form-footer {
  text-align: center;
  color: #909399;
  font-size: 0.8rem;
  margin-top: auto;
}

/* 输入框获得焦点时的样式 */
.input-focus :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset !important;
  transition: box-shadow 0.3s ease;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotAnimation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .auth-decoration {
    padding: 40px 30px;
  }
  
  .decoration-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  
  .auth-decoration {
    padding: 30px 20px;
    min-height: 250px;
  }
  
  .decoration-title {
    font-size: 2rem;
  }
  
  .decoration-desc {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  
  .logo {
    margin-bottom: 30px;
  }
  
  .decoration-features {
    display: none;
  }
  
  .decoration-footer {
    display: none;
  }
  
  .auth-form {
    padding: 30px 20px;
  }
}

@media (max-width: 576px) {
  .login-card {
    max-width: 100%;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .form-title {
    font-size: 1.8rem;
  }
  
  .decoration-title {
    font-size: 1.8rem;
  }
}
</style>
