<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatar: string
  }
  createTime: string
  likes: number
}

interface Note {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
    avatar: string
    followers: number
  }
  tags: string[]
  likes: number
  comments: Comment[]
  createTime: string
  updateTime: string
  isCollected: boolean
}

// 笔记数据
const note = ref<Note>({
  id: 1,
  title: '《百年孤独》读后感：魔幻现实主义的艺术巅峰',
  content: `马尔克斯的《百年孤独》是一部震撼人心的杰作。通过布恩迪亚家族的百年历史，展现了拉丁美洲的神奇与现实。

书中的时间是循环的，故事是魔幻的，但人性是真实的。作者通过独特的叙事方式，将现实与幻想完美融合，创造出了一个令人难忘的文学世界。

## 魔幻现实主义的叙事特色

马尔克斯在《百年孤独》中运用了大量魔幻现实主义的手法：

1. 时间的循环性：布恩迪亚家族的故事呈现出周而复始的特点
2. 现实与幻想的交织：黄蝴蝶群、飞升天堂的少女等情节
3. 寓言式的表达：通过家族史折射拉美历史

## 人物形象分析

每个角色都具有鲜明的个性特征：

- 何塞·阿尔卡蒂奥·布恩迪亚：理想主义者的代表
- 乌尔苏拉：家族的精神支柱
- 梅尔基亚德斯：神秘智者的化身

## 主题探讨

1. 孤独主题
2. 命运与宿命
3. 历史的循环
4. 人性的复杂性

## 个人感悟

阅读《百年孤独》是一次奇妙的阅读体验，它不仅展现了拉美文学的独特魅力，也让我们思考人类永恒的命题：爱情、生命、死亡与永恒。`,
  author: {
    id: 1,
    name: '文学爱好者',
    avatar: 'https://placeholder.co/100',
    followers: 1234
  },
  tags: ['文学', '魔幻现实主义', '经典', '读后感'],
  likes: 328,
  comments: [
    {
      id: 1,
      content: '写得真好，对魔幻现实主义的理解很深刻！',
      author: {
        name: '阅读达人',
        avatar: 'https://placeholder.co/100'
      },
      createTime: '2024-02-20 14:30',
      likes: 12
    },
    {
      id: 2,
      content: '分析很到位，特别是对人物形象的解读很有见地。',
      author: {
        name: '文学研究者',
        avatar: 'https://placeholder.co/100'
      },
      createTime: '2024-02-20 15:45',
      likes: 8
    }
  ],
  createTime: '2024-02-15 10:30',
  updateTime: '2024-02-15 11:45',
  isCollected: false
})

// 新评论
const newComment = ref('')

// 添加评论
const addComment = () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  note.value.comments.unshift({
    id: Date.now(),
    content: newComment.value,
    author: {
      name: userStore.userInfo.username,
      avatar: userStore.userInfo.avatar
    },
    createTime: new Date().toLocaleString(),
    likes: 0
  })

  newComment.value = ''
  ElMessage.success('评论成功')
}

// 点赞笔记
const likeNote = () => {
  note.value.likes++
  ElMessage.success('点赞成功')
}

// 收藏笔记
const toggleCollect = () => {
  note.value.isCollected = !note.value.isCollected
  ElMessage.success(note.value.isCollected ? '收藏成功' : '已取消收藏')
}

// 关注作者
const followAuthor = () => {
  ElMessage.success('关注成功')
}

// 点赞评论
const likeComment = (comment: Comment) => {
  comment.likes++
  ElMessage.success('点赞成功')
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  // 这里应该根据路由参数获取笔记详情
  console.log('Note ID:', route.params.id)
})
</script>

<template>
  <div class="note-detail-container glass-effect">
    <!-- 返回按钮 -->
    <el-button
      class="back-button"
      text
      @click="goBack"
    >
      <el-icon><ArrowLeft /></el-icon>
      返回
    </el-button>

    <div class="note-content-wrapper">
      <!-- 笔记内容 -->
      <div class="note-content">
        <h1 class="note-title">{{ note.title }}</h1>
        
        <div class="meta-info">
          <div class="author-info">
            <el-avatar :size="40" :src="note.author.avatar" />
            <div class="author-details">
              <div class="author-name-follow">
                <span class="author-name">{{ note.author.name }}</span>
                <el-button
                  size="small"
                  type="primary"
                  plain
                  @click="followAuthor"
                >
                  关注
                </el-button>
              </div>
              <span class="followers">{{ note.author.followers }} 关注者</span>
            </div>
          </div>
          
          <div class="publish-info">
            <span>发布于 {{ note.createTime }}</span>
            <span v-if="note.updateTime !== note.createTime">
              · 更新于 {{ note.updateTime }}
            </span>
          </div>
        </div>

        <div class="tags">
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

        <div class="note-text" v-html="note.content.replace(/\n/g, '<br>')"></div>
        
        <div class="note-actions">
          <div class="action-buttons">
            <el-button
              type="primary"
              :icon="note.isCollected ? 'Star' : 'StarFilled'"
              @click="toggleCollect"
            >
              {{ note.isCollected ? '已收藏' : '收藏' }}
            </el-button>
            <el-button
              type="primary"
              plain
              @click="likeNote"
            >
              <el-icon><ThumbsUp /></el-icon>
              {{ note.likes }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <h2 class="comments-title">评论 ({{ note.comments.length }})</h2>
        
        <!-- 评论输入框 -->
        <div class="comment-input">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
          />
          <el-button
            type="primary"
            @click="addComment"
            :disabled="!newComment.trim()"
          >
            发表评论
          </el-button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <el-card
            v-for="comment in note.comments"
            :key="comment.id"
            class="comment-card"
          >
            <div class="comment-header">
              <div class="commenter-info">
                <el-avatar :size="32" :src="comment.author.avatar" />
                <span class="commenter-name">{{ comment.author.name }}</span>
              </div>
              <span class="comment-time">{{ comment.createTime }}</span>
            </div>
            
            <p class="comment-content">{{ comment.content }}</p>
            
            <div class="comment-actions">
              <el-button
                type="primary"
                text
                @click="likeComment(comment)"
              >
                <el-icon><ThumbsUp /></el-icon>
                {{ comment.likes }}
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-detail-container {
  padding: 32px;
  margin: 24px;
  border-radius: var(--border-radius);
  position: relative;
}

.back-button {
  position: absolute;
  top: 24px;
  left: 24px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.note-content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 24px;
}

.note-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: 1.3;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name-follow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.followers {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.publish-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.note-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 32px;
}

.note-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.comments-section {
  margin-top: 48px;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.comment-input {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-card {
  background: var(--card-background);
  backdrop-filter: blur(10px);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.commenter-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.commenter-name {
  font-weight: 500;
  color: var(--text-primary);
}

.comment-time {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.comment-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-card__body) {
  padding: 20px;
}

.dark {
  .note-actions {
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>