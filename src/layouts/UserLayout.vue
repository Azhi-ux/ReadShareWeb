<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import LoginDialog from '../components/LoginDialog.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('')
const showLoginDialog = ref(false)

const handleSelect = (key: string) => {
  router.push(key)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/user')
}
</script>

<template>
  <el-container class="layout-container">
    <el-header class="glass-effect">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo-text">ReadShare</h1>
        </div>
        
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          @select="handleSelect"
          class="main-menu"
        >
          <el-menu-item index="/user">
            <el-icon><HomeFilled /></el-icon>首页
          </el-menu-item>
          <el-menu-item index="/user/notes">
            <el-icon><DocumentCopy /></el-icon>我的笔记
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><UserFilled /></el-icon>个人中心
          </el-menu-item>
        </el-menu>

        <div class="user-actions">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleLogout">
              <div class="user-info hover-scale">
                <el-avatar :size="32" :src="userStore.userInfo.avatar" />
                <span class="username">{{ userStore.userInfo.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="showLoginDialog = true" class="login-button">
              登录
            </el-button>
          </template>
        </div>
      </div>
    </el-header>
    
    <el-main>
      <router-view />
    </el-main>

    <LoginDialog
      v-model="showLoginDialog"
      @login-success="router.push('/user/profile')"
    />
  </el-container>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-menu {
  border-bottom: none;
  background: transparent;
}

.el-menu-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-header {
  height: 64px;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: var(--text-primary);
}

.login-button {
  padding: 8px 24px;
  font-weight: 500;
}

.el-main {
  padding: 0;
  background-color: var(--background-color);
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 64px;
  line-height: 64px;
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
}
</style>