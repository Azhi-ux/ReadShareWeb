<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Note {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
    avatar: string
  }
  tags: string[]
  likes: number
  comments: number
  createTime: string
}

// 笔记列表数据
const notes = ref<Note[]>([
  {
    id: 1,
    title: '《百年孤独》读后感：魔幻现实主义的艺术巅峰',
    content: '马尔克斯的《百年孤独》是一部震撼人心的杰作。通过布恩迪亚家族的百年历史，展现了拉丁美洲的神奇与现实。书中的时间是循环的，故事是魔幻的，但人性是真实的。作者通过独特的叙事方式，将现实与幻想完美融合，创造出了一个令人难忘的文学世界...',
    author: {
      id: 1,
      name: '文学爱好者',
      avatar: 'https://placeholder.co/100'
    },
    tags: ['文学', '魔幻现实主义', '经典'],
    likes: 328,
    comments: 45,
    createTime: '2024-02-15'
  },
  {
    id: 2,
    title: '《三体》中的科学与哲学思考',
    content: '刘慈欣的《三体》不仅是一部优秀的科幻作品，更是一部探讨人性与文明的哲学著作。通过描绘地球文明与三体文明的交互，深入探讨了宇宙社会学的深层命题。黑暗森林法则的提出，让我们重新思考文明的本质与发展方向...',
    author: {
      id: 2,
      name: '科幻迷',
      avatar: 'https://placeholder.co/100'
    },
    tags: ['科幻', '哲学', '文明探讨'],
    likes: 256,
    comments: 32,
    createTime: '2024-02-16'
  },
  {
    id: 3,
    title: '《人类简史》：从认知革命到人工智能',
    content: '尤瓦尔·赫拉利在《人类简史》中，通过宏大的历史视角，展现了人类从认知革命到农业革命，再到科技革命的发展历程。特别是对于虚构故事如何塑造人类社会的分析非常精彩，让我们重新思考信仰、货币、国家等概念的本质...',
    author: {
      id: 3,
      name: '历史研究者',
      avatar: 'https://placeholder.co/100'
    },
    tags: ['历史', '人类学', '科普'],
    likes: 198,
    comments: 27,
    createTime: '2024-02-17'
  }
])

// 搜索和筛选
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref<'latest' | 'popular'>('latest')

// 所有可用标签
const allTags = computed(() => {
  const tagSet = new Set<string>()
  notes.value.forEach(note => {
    note.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet)
})

// 筛选后的笔记列表
const filteredNotes = computed(() => {
  let result = notes.value.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => note.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })

  // 排序
  if (sortBy.value === 'latest') {
    result = result.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  } else {
    result = result.sort((a, b) => b.likes - a.likes)
  }

  return result
})

// 跳转到笔记详情
const goToNoteDetail = (noteId: number) => {
  router.push(`/user/note/${noteId}`)
}

// 点赞笔记
const likeNote = (note: Note) => {
  note.likes++
  ElMessage.success('点赞成功')
}

// 关注作者
const followAuthor = (authorId: number) => {
  ElMessage.success('关注成功')
}
</script>

<template>
  <div class="explore-container glass-effect">
    <!-- 顶部搜索和筛选区 -->
    <div class="explore-header">
      <h1 class="section-title">发现精彩笔记</h1>
      
      <div class="filters">
        <el-input
          v-model="searchQuery"
          placeholder="搜索笔记..."
          class="search-input"
          prefix-icon="Search"
        />
        
        <el-select
          v-model="selectedTags"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="选择标签"
          class="tag-select"
        >
          <el-option
            v-for="tag in allTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
        
        <el-radio-group v-model="sortBy" class="sort-options">
          <el-radio-button label="latest">最新</el-radio-button>
          <el-radio-button label="popular">最热</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 笔记列表 -->
    <div class="notes-grid">
      <el-card
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-card hover-scale"
        @click="goToNoteDetail(note.id)"
      >
        <div class="note-header">
          <div class="author-info" @click.stop>
            <el-avatar :size="40" :src="note.author.avatar" />
            <div class="author-details">
              <span class="author-name">{{ note.author.name }}</span>
              <el-button
                type="primary"
                size="small"
                plain
                @click="followAuthor(note.author.id)"
              >
                关注
              </el-button>
            </div>
          </div>
          <span class="publish-time">{{ note.createTime }}</span>
        </div>
        
        <h3 class="note-title">{{ note.title }}</h3>
        <p class="note-content">{{ note.content }}</p>
        
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
          <div class="interactions" @click.stop>
            <el-button
              type="primary"
              text
              @click="likeNote(note)"
            >
              <el-icon><ThumbsUp /></el-icon>
              {{ note.likes }}
            </el-button>
            <el-button
              type="primary"
              text
            >
              <el-icon><ChatDotRound /></el-icon>
              {{ note.comments }}
            </el-button>
          </div>
          
          <el-button
            type="primary"
            text
            class="read-more"
          >
            阅读全文
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.explore-container {
  padding: 32px;
  margin: 24px;
  border-radius: var(--border-radius);
}

.explore-header {
  margin-bottom: 32px;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

.search-input {
  width: 300px;
}

.tag-select {
  width: 240px;
}

.sort-options {
  margin-left: auto;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
}

.note-card {
  background: var(--card-background);
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.author-name {
  font-weight: 500;
  color: var(--text-primary);
}

.publish-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.note-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.note-content {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  margin: 0;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.interactions {
  display: flex;
  gap: 16px;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-card__body) {
  padding: 24px;
}

.dark {
  .note-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style>