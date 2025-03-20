<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Note {
  id: number
  title: string
  content: string
  author: string
  likes: number
  tags: string[]
  createTime: string
}

const hotNotes = ref<Note[]>([
  {
    id: 1,
    title: '《百年孤独》读后感',
    content: '魔幻现实主义的经典之作，马尔克斯通过布恩迪亚家族的百年历史，展现了拉丁美洲的神奇与现实。书中的时间是循环的，故事是魔幻的，但人性是真实的...',
    author: '张三',
    likes: 156,
    tags: ['文学', '小说', '经典'],
    createTime: '2024-02-20'
  },
  {
    id: 2,
    title: '《三体》科幻元素分析',
    content: '刘慈欣的科幻世界观独树一帜，通过三体文明与地球文明的交互，探讨了宇宙社会学的深层命题。黑暗森林法则的提出，让我们重新思考文明的本质...',
    author: '李四',
    likes: 142,
    tags: ['科幻', '物理', '哲学'],
    createTime: '2024-02-19'
  }
])

const recommendedNotes = ref<Note[]>([
  {
    id: 3,
    title: '《人类简史》读书笔记',
    content: '从认知革命到人工智能，尤瓦尔·赫拉利带我们回顾了人类历史的关键节点。书中对于虚构故事如何塑造人类社会的分析特别精彩...',
    author: '王五',
    likes: 98,
    tags: ['历史', '人类学', '科普'],
    createTime: '2024-02-18'
  },
  {
    id: 4,
    title: '《金字塔原理》思维导图',
    content: '麦肯锡的思维方法论经典之作，通过自上而下的逻辑框架，帮助我们更好地组织思维和表达。这本笔记整理了书中核心的结构化思维技巧...',
    author: '赵六',
    likes: 87,
    tags: ['思维方法', '管理', '学习'],
    createTime: '2024-02-17'
  }
])

const goToNoteDetail = (noteId: number) => {
  router.push(`/user/note/${noteId}`)
}
</script>

<template>
  <div class="home-container glass-effect">
    <div class="hero-section">
      <h1 class="hero-title">探索知识的海洋</h1>
      <p class="hero-subtitle">分享你的读书心得，发现更多精彩观点</p>
      <div class="hero-actions">
        <el-button type="primary" size="large" class="action-button">
          <el-icon><Edit /></el-icon>写笔记
        </el-button>
        <el-button size="large" class="action-button">
          <el-icon><Compass /></el-icon>发现更多
        </el-button>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">热门笔记</h2>
      <el-row :gutter="24">
        <el-col :span="12" v-for="note in hotNotes" :key="note.id">
          <el-card 
            class="note-card hover-scale" 
            shadow="hover"
            @click="goToNoteDetail(note.id)"
          >
            <div class="note-header">
              <h3 class="note-title">{{ note.title }}</h3>
              <el-tag effect="dark" type="danger" class="hot-tag">HOT</el-tag>
            </div>
            <p class="note-excerpt">{{ note.content }}</p>
            <div class="note-tags">
              <el-tag
                v-for="tag in note.tags"
                :key="tag"
                class="tag"
                effect="plain"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="note-footer">
              <div class="author-info">
                <el-avatar :size="24" src="https://placeholder.co/100" />
                <span>{{ note.author }}</span>
              </div>
              <div class="note-stats">
                <span class="likes">
                  <el-icon><ThumbsUp /></el-icon>
                  {{ note.likes }}
                </span>
                <span class="date">{{ note.createTime }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <h2 class="section-title recommended-title">推荐笔记</h2>
      <el-row :gutter="24">
        <el-col :span="12" v-for="note in recommendedNotes" :key="note.id">
          <el-card 
            class="note-card hover-scale" 
            shadow="hover"
            @click="goToNoteDetail(note.id)"
          >
            <div class="note-header">
              <h3 class="note-title">{{ note.title }}</h3>
              <el-tag effect="dark" type="success" class="recommend-tag">推荐</el-tag>
            </div>
            <p class="note-excerpt">{{ note.content }}</p>
            <div class="note-tags">
              <el-tag
                v-for="tag in note.tags"
                :key="tag"
                class="tag"
                effect="plain"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="note-footer">
              <div class="author-info">
                <el-avatar :size="24" src="https://placeholder.co/100" />
                <span>{{ note.author }}</span>
              </div>
              <div class="note-stats">
                <span class="likes">
                  <el-icon><ThumbsUp /></el-icon>
                  {{ note.likes }}
                </span>
                <span class="date">{{ note.createTime }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 40px;
  margin: 24px;
  border-radius: var(--border-radius);
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 0;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  border-radius: var(--border-radius);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.action-button {
  padding: 12px 32px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(0, 122, 255, 0.1);
}

.recommended-title {
  margin-top: 48px;
}

.note-card {
  margin-bottom: 24px;
  background: var(--card-background);
  backdrop-filter: blur(10px);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.note-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.note-excerpt {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  margin: 0;
  transition: all 0.3s ease;
}

.tag:hover {
  transform: scale(1.05);
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.note-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
}

.likes {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hot-tag, .recommend-tag {
  font-weight: 500;
  border: none;
  padding: 4px 12px;
  border-radius: 20px;
}

.date {
  font-size: 0.9rem;
}

:deep(.el-card__body) {
  padding: 24px;
}

.dark {
  .note-card {
    background: rgba(28, 28, 30, 0.8);
  }

  .note-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .hero-section {
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.05), rgba(88, 86, 214, 0.05));
  }
}
</style>