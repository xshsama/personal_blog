<template>
  <div class="auth-page">
    <!-- 左侧装饰区域 -->
    <div class="auth-decoration">
      <div class="decoration-content">
        <div class="logo">
          <el-icon class="logo-icon">
            <Edit />
          </el-icon>
          <span class="logo-text">个人博客</span>
        </div>
        <h2 class="decoration-title">加入我们,<br>分享您的见解!</h2>
        <p class="decoration-desc">创建账号,开启您的写作之旅</p>
        <div class="decoration-features">
          <div class="feature-item">
            <el-icon>
              <Edit />
            </el-icon>
            <span>发表您的文章</span>
          </div>
          <div class="feature-item">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>参与热门讨论</span>
          </div>
          <div class="feature-item">
            <el-icon>
              <Star />
            </el-icon>
            <span>收藏喜爱内容</span>
          </div>
        </div>
      </div>
      <div class="decoration-footer">
        <p>© 2025 个人博客. 保留所有权利</p>
      </div>
    </div>

    <!-- 右侧注册表单区域 -->
    <div class="auth-form">
      <div class="form-wrapper">
        <div class="form-header">
          <h1 class="form-title">
            <el-icon>
              <User />
            </el-icon>
            创建账户
          </h1>
          <p class="form-subtitle">填写以下信息完成注册</p>
        </div>

        <transition name="fade-slide" appear>
          <el-form ref="formRef" :model="registerForm" :rules="rules" @submit.prevent="handleSubmit"
            label-position="top" class="register-form" status-icon>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" prefix-icon="User" placeholder="请输入用户名"
                :class="{ 'input-focus': activeField === 'username' }" autofocus @focus="activeField = 'username'"
                @blur="activeField = ''"></el-input>
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="registerForm.email" prefix-icon="Message" placeholder="请输入电子邮箱"
                :class="{ 'input-focus': activeField === 'email' }" @focus="activeField = 'email'"
                @blur="activeField = ''"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input v-model="registerForm.password" prefix-icon="Lock" type="password" placeholder="请输入密码"
                show-password :class="{ 'input-focus': activeField === 'password' }" @focus="activeField = 'password'"
                @blur="activeField = ''">
                <template #append>
                  <el-tooltip content="密码至少需要6个字符" placement="top">
                    <el-icon>
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="registerForm.confirmPassword" prefix-icon="Lock" type="password" placeholder="请再次输入密码"
                show-password :class="{ 'input-focus': activeField === 'confirmPassword' }"
                @focus="activeField = 'confirmPassword'" @blur="activeField = ''"
                @keyup.enter="handleSubmit"></el-input>
            </el-form-item>

            <el-form-item class="agree-terms">
              <el-checkbox v-model="registerForm.agreeTerms">
                我已阅读并同意 <el-link type="primary">用户协议</el-link> 和 <el-link type="primary">隐私政策</el-link>
              </el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" native-type="submit" :loading="loading"
                :disabled="loading || !registerForm.agreeTerms" class="register-button">
                <span v-if="!loading">创建账户</span>
                <span v-else class="loading-text">
                  正在注册
                  <span class="dot-animation">...</span>
                </span>
              </el-button>
            </el-form-item>
          </el-form>
        </transition>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账号? <el-button link type="primary" @click="navigateToLogin" class="login-btn">立即登录</el-button>
        </div>
      </div>

      <div class="form-footer">
        <p>注册即表示您同意我们的 <el-link>服务条款</el-link> 和 <el-link>隐私政策</el-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatDotRound,
  Edit,
  InfoFilled,
  Lock,
  Message,
  Star,
  User
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'RegisterView',
  components: {
    User,
    Lock,
    Message,
    Edit,
    ChatDotRound,
    Star,
    InfoFilled
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const formRef = ref(null);
    const activeField = ref('');
    const registerStatus = ref('idle'); // idle, loading, success, error
    const errorMessage = ref('');

    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    });

    const loading = ref(false);

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能少于3个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入电子邮箱', trigger: 'blur' },
        { type: 'email', message: '电子邮箱格式不正确', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
        { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, message: '密码必须包含字母和数字', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== registerForm.password) {
              callback(new Error('两次输入的密码不一致!'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      agreeTerms: [
        {
          validator: (rule, value, callback) => {
            if (value === false) {
              callback(new Error('请阅读并同意用户协议和隐私政策'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ]
    };

    const handleSubmit = async () => {
      if (!formRef.value) return;

      if (!registerForm.agreeTerms) {
        ElMessage.warning('请阅读并同意用户协议和隐私政策');
        return;
      }

      try {
        await formRef.value.validate();
        loading.value = true;
        registerStatus.value = 'loading';

        await store.dispatch('auth/register', {
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        });

        registerStatus.value = 'success';
        ElMessage.success({
          message: '注册成功! 欢迎加入我们',
          duration: 2000
        });

        // 延迟跳转,给用户一个视觉反馈的时间
        setTimeout(() => {
          router.push({
            name: 'Login',
            query: {
              registered: 'true',
              username: registerForm.username
            }
          });
        }, 500);
      } catch (error) {
        console.error('注册失败:', error);
        registerStatus.value = 'error';
        errorMessage.value = error.response?.data?.message || '注册失败，请稍后再试';
        ElMessage.error(errorMessage.value);
      } finally {
        loading.value = false;
      }
    };

    const navigateToLogin = () => {
      router.push({ name: 'Login' });
    };

    return {
      formRef,
      registerForm,
      rules,
      loading,
      activeField,
      registerStatus,
      errorMessage,
      handleSubmit,
      navigateToLogin
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
  background: linear-gradient(135deg, #42b983 0%, #2f9768 100%);
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

.register-form {
  animation: fadeIn 0.8s ease;
}

.agree-terms {
  margin-top: 10px;
}

.register-button {
  width: 100%;
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.register-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
}

.register-button:not(:disabled):active {
  transform: translateY(0);
}

.loading-text {
  position: relative;
}

.dot-animation {
  display: inline-block;
  animation: dotAnimation 1.5s infinite;
}

/* 登录链接样式 */
.login-link {
  text-align: center;
  margin-top: 30px;
  color: #606266;
  font-size: 0.95rem;
}

.login-btn {
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
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
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
  .form-title {
    font-size: 1.8rem;
  }

  .decoration-title {
    font-size: 1.8rem;
  }
}
</style>
