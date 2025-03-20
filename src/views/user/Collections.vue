<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Collection {
  id: number
  name: string
  description: string
  isPrivate: boolean
  createTime: string
  noteCount: number
}

interface Note {
  id: number
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  createTime: string
  collectionId: number
}

// 收藏夹列表
const collections = ref<Collection[]>([
  {
    id: 1,
    name: '文学作品笔记',
    description: '收集各类文学作品的读书笔记和感想',
    isPrivate: false,
    createTime: '2024-02-10',
    noteCount: 12
  },
  {
    id: 2,
    name: '科技前沿',
    description: '关于最新科技发展的思考和见解',
    isPrivate: true,
    createTime: '2024-02-15',
    noteCount: 8
  },
  {
    id: 3,
    name: '历史研究',
    description: '历史类书籍的笔记整理',
    isPrivate: false,
    createTime: '2024-02-18',
    noteCount: 5
  }
])

// 笔记列表
const notes = ref<Note[]>([
  {
    id: 1,
    title: '《百年孤独》读后感：魔幻现实主义的艺术巅峰',
    content: '马尔克斯的《百年孤独》是一部震撼人心的杰作。通过布恩迪亚家族的百年历史，展现了拉丁美洲的神奇与现实...',
    author: {
      name: '文学爱好者',
      avatar: 'https://placeholder.co/100'
    },
    tags: ['文学', '魔幻现实主义', '经典'],
    createTime: '2024-02-15',
    collectionId: 1
  },
  {
    id: 2,
    title: '量子计算机发展前沿综述',
    content: '近年来，量子计算领域取得了突破性进展。本文整理了最新的研究成果和未来发展趋势...',
    author: {
      name: '科技观察者',
      avatar: 'https://placeholder.co/100'
    },
    tags: ['科技', '量子计算', '前沿'],
    createTime: '2024-02-16',
    collectionId: 2
  }
])

// 当前选中的收藏夹
const currentCollection = ref<Collection | null>(null)

// 根据当前收藏夹筛选笔记
const filteredNotes = computed(() => {
  if (!currentCollection.value) return []
  return notes.value.filter(note => note.collectionId === currentCollection.value?.id)
})

// 搜索和筛选
const searchQuery = ref('')
const showPrivate = ref(true)

// 筛选后的收藏夹列表
const filteredCollections = computed(() => {
  return collections.value.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesPrivacy = showPrivate.value || !collection.isPrivate
    
    return matchesSearch && matchesPrivacy
  })
})

// 新建收藏夹
const showCreateDialog = ref(false)
const newCollection = ref({
  name: '',
  description: '',
  isPrivate: false
})

const createCollection = () => {
  collections.value.push({
    id: Date.now(),
    ...newCollection.value,
    createTime: new Date().toISOString().split('T')[0],
    noteCount: 0
  })
  showCreateDialog.value = false
  newCollection.value = {
    name: '',
    description: '',
    isPrivate: false
  }
  ElMessage.success('创建成功')
}

// 删除收藏夹
const deleteCollection = (collection: Collection) => {
  ElMessageBox.confirm(
    '确定要删除这个收藏夹吗？其中的笔记将被移除收藏。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    collections.value = collections.value.filter(c => c.id !== collection.id)
    if (currentCollection.value?.id === collection.id) {
      currentCollection.value = null
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 移除笔记
const removeNote = (note: Note) => {
  ElMessageBox.confirm(
    '确定要将这篇笔记从收藏夹中移除吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    notes.value = notes.value.filter(n => n.id !== note.id)
    const collection = collections.value.find(c => c.id === note.collectionId)
    if (collection) {
      collection.noteCount--
    }
    ElMessage.success('移除成功')
  }).catch(() => {})
}

// 查看笔记详情
const goToNoteDetail = (noteId: number) => {
  router.push(`/user/note/${noteId}`)
}
</script>

<template>
  <div class="collections-container glass-effect">
    <div class="collections-layout">
      <!-- 左侧收藏夹列表 -->
      <div class="collections-sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">我的收藏夹</h2>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>新建
          </el-button>
        </div>

        <div class="sidebar-filters">
          <el-input
            v-model="searchQuery"
            placeholder="搜索收藏夹..."
            prefix-icon="Search"
          />
          <el-checkbox v-model="showPrivate">显示私密收藏夹</el-checkbox>
        </div>

        <div class="collections-list">
          <el-card
            v-for="collection in filteredCollections"
            :key="collection.id"
            class="collection-item hover-scale"
            :class="{ active: currentCollection?.id === collection.id }"
            @click="currentCollection = collection"
          >
            <div class="collection-info">
              <div class="collection-header">
                <h3 class="collection-name">
                  {{ collection.name }}
                  <el-tag
                    v-if="collection.isPrivate"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    私密
                  </el-tag>
                </h3>
                <el-dropdown trigger="click" @command="deleteCollection(collection)">
                  <el-button type="primary" text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete" type="danger">
                        删除收藏夹
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <p class="collection-description">{{ collection.description }}</p>
              <div class="collection-meta">
                <span>{{ collection.noteCount }} 篇笔记</span>
                <span>创建于 {{ collection.createTime }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 右侧笔记列表 -->
      <div class="notes-content">
        <template v-if="currentCollection">
          <div class="content-header">
            <h2 class="section-title">{{ currentCollection.name }}</h2>
            <p class="collection-description">{{ currentCollection.description }}</p>
          </div>

          <div class="notes-grid">
            <el-card
              v-for="note in filteredNotes"
              :key="note.id"
              class="note-card hover-scale"
              @click="goToNoteDetail(note.id)"
            >
              <div class="note-header">
                <div class="author-info">
                  <el-avatar :size="32" :src="note.author.avatar" />
                  <span class="author-name">{{ note.author.name }}</span>
                </div>
                <el-dropdown trigger="click" @command="removeNote(note)">
                  <el-button type="primary" text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="remove">
                        移除收藏
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
                <span class="create-time">收藏于 {{ note.createTime }}</span>
                <el-button type="primary" text class="read-more">
                  阅读全文
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </el-card>
          </div>
        </template>

        <div v-else class="empty-state">
          <el-empty description="选择一个收藏夹以查看笔记" />
        </div>
      </div>
    </div>

    <!-- 新建收藏夹对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建收藏夹"
      width="500px"
    >
      <el-form :model="newCollection" label-position="top">
        <el-form-item label="名称">
          <el-input v-model="newCollection.name" placeholder="请输入收藏夹名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newCollection.description"
            type="textarea"
            :rows="3"
            placeholder="请输入收藏夹描述"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="newCollection.isPrivate">设为私密收藏夹</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createCollection">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.collections-container {
  padding: 24px;
  margin: 24px;
  border-radius: var(--border-radius);
  height: calc(100vh - 112px);
}

.collections-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  height: 100%;
}

.collections-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding-right: 24px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.sidebar-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.collections-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.collection-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.collection-item.active {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.collection-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.collection-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.5;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.notes-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 24px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.note-card {
  background: var(--card-background);
  backdrop-filter: blur(10px);
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
  gap: 8px;
}

.author-name {
  font-weight: 500;
  color: var(--text-primary);
}

.note-title {
  font-size: 1.2rem;
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

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.create-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 20px;
}

.dark {
  .collections-sidebar {
    border-right-color: rgba(255, 255, 255, 0.1);
  }

  .note-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style>