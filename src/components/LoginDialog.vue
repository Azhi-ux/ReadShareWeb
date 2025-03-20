<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const showRegister = ref(false)
const visible = ref(false)

const emit = defineEmits<{
  (e: 'login-success'): void
}>()

const userStore = useUserStore()

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(loginForm.value.email, loginForm.value.password)
    emit('login-success')
    visible.value = false
    loginForm.value = {
      email: '',
      password: ''
    }
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
    await userStore.register(
      registerForm.value.email,
      registerForm.value.username,
      registerForm.value.password
    )
    showRegister.value = false
    ElMessage.success('注册成功，请登录')
    registerForm.value = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  } finally {
    loading.value = false
  }
}

const switchToRegister = () => {
  showRegister.value = true
}

const switchToLogin = () => {
  showRegister.value = false
}
</script>

<template>
  <el-dialog
    :title="showRegister ? '开启阅读之旅' : '欢迎回来'"
    v-model="visible"
    width="400px"
    class="login-dialog"
    :close-on-click-modal="false"
  >
    <template v-if="!showRegister">
      <el-form :model="loginForm" label-position="top">
        <el-form-item label="邮箱">
          <el-input 
            v-model="loginForm.email" 
            placeholder="请输入邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button @click="visible = false" plain>取消</el-button>
        <el-button type="primary" @click="handleLogin" :loading="loading">
          登录
        </el-button>
      </div>
      <div class="switch-form">
        <p>还没有账号？</p>
        <el-button type="text" @click="switchToRegister" class="switch-button">
          立即注册
        </el-button>
      </div>
    </template>

    <template v-else>
      <el-form :model="registerForm" label-position="top">
        <el-form-item label="邮箱">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            prefix-icon="Lock"
          />
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button @click="visible = false" plain>取消</el-button>
        <el-button type="primary" @click="handleRegister" :loading="loading">
          注册
        </el-button>
      </div>
      <div class="switch-form">
        <p>已有账号？</p>
        <el-button type="text" @click="switchToLogin" class="switch-button">
          立即登录
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.login-dialog {
  border-radius: var(--border-radius);
}

:deep(.el-dialog) {
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

:deep(.el-dialog__body) {
  padding: 32px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.switch-form {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
}

.switch-form p {
  margin-bottom: 8px;
}

.switch-button {
  font-weight: 600;
  font-size: 1rem;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 8px;
}
</style>