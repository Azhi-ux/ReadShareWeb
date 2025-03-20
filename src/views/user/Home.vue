<script setup lang="ts">
import { ref } from 'vue'

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
    content: '魔幻现实主义的经典之作...',
    author: '张三',
    likes: 156,
    tags: ['文学', '小说', '经典'],
    createTime: '2024-02-20'
  },
  {
    id: 2,
    title: '《三体》科幻元素分析',
    content: '刘慈欣的科幻世界观...',
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
    content: '从认知革命到人工智能...',
    author: '王五',
    likes: 98,
    tags: ['历史', '人类学', '科普'],
    createTime: '2024-02-18'
  },
  {
    id: 4,
    title: '《金字塔原理》思维导图',
    content: '结构化思维方法论...',
    author: '赵六',
    likes: 87,
    tags: ['思维方法', '管理', '学习'],
    createTime: '2024-02-17'
  }
])
</script>

<template>
  <div class="home-container glass-effect">
    <div class="hero-section">
      <h1 class="hero-title">探索知识的海洋</h1>
      <p class="hero-subtitle">分享你的读书心得，发现更多精彩观点</p>
    </div>

    <div class="content-section">
      <h2 class="section-title">热门笔记</h2>
      <el-row :gutter="24">
        <el-col :span="12" v-for="note in hotNotes" :key="note.id">
          <el-card class="note-card hover-scale" shadow="hover">
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
          <el-card class="note-card hover-scale" shadow="hover">
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
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
}

.recommended-title {
  margin-top: 48px;
}

.note-card {
  margin-bottom: 24px;
  background: var(--card-background);
  backdrop-filter: blur(10px);
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
}

.note-tags {
  margin-bottom: 16px;
}

.tag {
  margin-right: 8px;
  margin-bottom: 8px;
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
}

.date {
  font-size: 0.9rem;
}
</style>