<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useThemeStore } from '../../stores/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()

// 用户统计数据
const userStats = ref({
  totalNotes: 15,
  publishedNotes: 12,
  totalLikes: 156,
  followers: 23,
  following: 45
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'note',
    title: '发布了新笔记',
    content: '《三体》读书笔记',
    time: '2024-02-20 14:30'
  },
  {
    id: 2,
    type: 'like',
    title: '获得点赞',
    content: '《人类简史》思考',
    time: '2024-02-19 16:30'
  },
  {
    id: 3,
    type: 'follow',
    title: '新增关注者',
    content: '张三',
    time: '2024-02-18 09:15'
  }
])

// 编辑个人信息
const showEditDialog = ref(false)
const userForm = ref({
  username: userStore.userInfo.username,
  email: userStore.userInfo.email,
  bio: '热爱阅读，分享生活'
})

const saveUserInfo = () => {
  // 这里应该调用API保存用户信息
  showEditDialog.value = false
}
</script>

<template>
  <div class="profile-container glass-effect">
    <!-- 个人信息卡片 -->
    <div class="profile-header">
      <div class="user-info">
        <el-avatar :size="100" :src="userStore.userInfo.avatar" />
        <div class="user-details">
          <h1 class="username">{{ userStore.userInfo.username }}</h1>
          <p class="email">{{ userStore.userInfo.email }}</p>
          <p class="bio">热爱阅读，分享生活</p>
        </div>
      </div>
      <div class="actions">
        <el-button type="primary" @click="showEditDialog = true">
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <el-button @click="themeStore.toggleTheme">
          <el-icon>
            <component :is="themeStore.isDark ? 'Sunny' : 'Moon'" />
          </el-icon>
          {{ themeStore.isDark ? '日间模式' : '夜间模式' }}
        </el-button>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-grid">
      <el-card class="stat-card hover-scale">
        <template #header>
          <div class="stat-header">
            <el-icon><Document /></el-icon>
            <span>笔记总数</span>
          </div>
        </template>
        <div class="stat-value">{{ userStats.totalNotes }}</div>
      </el-card>

      <el-card class="stat-card hover-scale">
        <template #header>
          <div class="stat-header">
            <el-icon><Upload /></el-icon>
            <span>已发布</span>
          </div>
        </template>
        <div class="stat-value">{{ userStats.publishedNotes }}</div>
      </el-card>

      <el-card class="stat-card hover-scale">
        <template #header>
          <div class="stat-header">
            <el-icon><Star /></el-icon>
            <span>获赞数</span>
          </div>
        </template>
        <div class="stat-value">{{ userStats.totalLikes }}</div>
      </el-card>

      <el-card class="stat-card hover-scale">
        <template #header>
          <div class="stat-header">
            <el-icon><User /></el-icon>
            <span>关注者</span>
          </div>
        </template>
        <div class="stat-value">{{ userStats.followers }}</div>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activities">
      <h2 class="section-title">最近活动</h2>
      <el-timeline>
        <el-timeline-item
          v-for="activity in recentActivities"
          :key="activity.id"
          :timestamp="activity.time"
          placement="top"
        >
          <el-card class="activity-card">
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 编辑个人信息对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑个人资料"
      width="500px"
      class="edit-dialog"
    >
      <el-form :model="userForm" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" disabled />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="userForm.bio"
            type="textarea"
            :rows="3"
            placeholder="介绍一下自己吧"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 32px;
  margin: 24px;
  border-radius: var(--border-radius);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
}

.user-info {
  display: flex;
  gap: 24px;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.email {
  color: var(--text-secondary);
  font-size: 1rem;
}

.bio {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 400px;
}

.actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  text-align: center;
  background: var(--card-background);
  backdrop-filter: blur(10px);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-primary);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.recent-activities {
  margin-top: 48px;
}

.activity-card {
  background: var(--card-background);
  backdrop-filter: blur(10px);
}

.activity-card h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.activity-card p {
  color: var(--text-secondary);
}

:deep(.el-timeline-item__node) {
  background-color: var(--primary-color);
}

:deep(.el-timeline-item__timestamp) {
  color: var(--text-secondary);
}

.edit-dialog {
  :deep(.el-dialog__body) {
    padding: 32px;
  }
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
}
</style>