<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { noteApi } from '../../api'
import type { Note, CreateNoteParams } from '../../api/types'

const userStore = useUserStore()

// 笔记列表数据
const notes = ref<Note[]>([
  {
    id: 1,
    title: '《三体》读书笔记',
    content: '刘慈欣的《三体》是一部震撼人心的科幻巨作，本文将从科学、哲学和人性三个角度进行深入分析...',
    tags: ['科幻', '读书笔记', '科学'],
    createTime: '2024-02-20 14:30',
    lastModified: '2024-02-20 15:45',
    status: 'published'
  },
  {
    id: 2,
    title: '《人类简史》思考',
    content: '尤瓦尔·赫拉利在《人类简史》中提出了许多发人深省的观点...',
    tags: ['历史', '人类学', '思考'],
    createTime: '2024-02-19 10:20',
    lastModified: '2024-02-19 16:30',
    status: 'draft'
  }
])

// 搜索和筛选
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const statusFilter = ref<'all' | 'published' | 'draft'>('all')

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
  return notes.value.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => note.tags.includes(tag))
    const matchesStatus = statusFilter.value === 'all' || 
      note.status === statusFilter.value
    return matchesSearch && matchesTags && matchesStatus
  })
})

// 编辑笔记
const showEditDialog = ref(false)
const currentNote = ref<CreateNoteParams>({
  title: '',
  content: '',
  tags: [],
  status: 'draft'
})
const editingNoteId = ref<number | null>(null)

const editNote = (note: Note) => {
  editingNoteId.value = note.id
  currentNote.value = {
    title: note.title,
    content: note.content,
    tags: [...note.tags],
    status: note.status
  }
  showEditDialog.value = true
}

const saveNote = async () => {
  try {
    if (editingNoteId.value) {
      await noteApi.updateNote({
        id: editingNoteId.value,
        ...currentNote.value
      })
    } else {
      await noteApi.createNote(currentNote.value)
    }
    
    ElMessage.success(editingNoteId.value ? '笔记已更新' : '笔记已创建')
    showEditDialog.value = false
    resetNoteForm()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 创建新笔记
const createNewNote = () => {
  editingNoteId.value = null
  resetNoteForm()
  showEditDialog.value = true
}

// 重置表单
const resetNoteForm = () => {
  currentNote.value = {
    title: '',
    content: '',
    tags: [],
    status: 'draft'
  }
}

// 删除笔记
const deleteNote = (note: Note) => {
  ElMessageBox.confirm(
    '确定要删除这篇笔记吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await noteApi.deleteNote(note.id)
      notes.value = notes.value.filter(n => n.id !== note.id)
      ElMessage.success('笔记已删除')
    } catch (error) {
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {})
}
</script>

<template>
  <div class="notes-container glass-effect">
    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="left-section">
        <h1 class="section-title">我的笔记</h1>
        <el-button type="primary" @click="createNewNote" class="new-note-btn">
          <el-icon><Plus /></el-icon>新建笔记
        </el-button>
      </div>
      
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
        
        <el-radio-group v-model="statusFilter" class="status-filter">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="published">已发布</el-radio-button>
          <el-radio-button label="draft">草稿</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 笔记列表 -->
    <div class="notes-grid">
      <el-card
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-card hover-scale"
        :class="{ 'draft': note.status === 'draft' }"
      >
        <div class="note-header">
          <h3 class="note-title">{{ note.title }}</h3>
          <el-tag
            :type="note.status === 'published' ? 'success' : 'info'"
            effect="light"
            size="small"
          >
            {{ note.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </div>
        
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
          <div class="timestamps">
            <span class="time">创建：{{ note.createTime }}</span>
            <span class="time">修改：{{ note.lastModified }}</span>
          </div>
          
          <div class="actions">
            <el-button
              type="primary"
              text
              @click="editNote(note)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              text
              @click="deleteNote(note)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 编辑笔记对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="editingNoteId ? '编辑笔记' : '新建笔记'"
      width="80%"
      class="edit-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="edit-form">
        <el-form :model="currentNote" label-position="top">
          <el-form-item 
            label="标题" 
            required
            :rules="[{ required: true, message: '请输入笔记标题' }]"
          >
            <el-input 
              v-model="currentNote.title" 
              placeholder="请输入笔记标题"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item 
            label="内容" 
            required
            :rules="[{ required: true, message: '请输入笔记内容' }]"
          >
            <el-input
              v-model="currentNote.content"
              type="textarea"
              :rows="15"
              placeholder="请输入笔记内容"
              resize="none"
            />
          </el-form-item>
          
          <div class="form-footer">
            <div class="left-actions">
              <el-form-item label="标签">
                <el-select
                  v-model="currentNote.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或创建标签"
                  class="tag-input"
                >
                  <el-option
                    v-for="tag in allTags"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="状态">
                <el-radio-group v-model="currentNote.status">
                  <el-radio label="draft">草稿</el-radio>
                  <el-radio label="published">发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            
            <div class="dialog-footer">
              <el-button @click="showEditDialog = false">取消</el-button>
              <el-button 
                type="primary" 
                @click="saveNote"
                :disabled="!currentNote.title || !currentNote.content"
              >
                保存
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.notes-container {
  padding: 32px;
  margin: 24px;
  border-radius: var(--border-radius);
  min-height: calc(100vh - 112px);
}

.top-bar {
  margin-bottom: 32px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.new-note-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 240px;
}

.tag-select {
  width: 240px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.note-card {
  background: var(--card-background);
  backdrop-filter: blur(10px);
}

.note-card.draft {
  border: 1px solid var(--text-secondary);
  opacity: 0.8;
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

.note-content {
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

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.timestamps {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 16px;
}

.edit-dialog {
  :deep(.el-dialog) {
    max-width: 1200px;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.edit-form {
  padding: 24px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.left-actions {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.tag-input {
  width: 300px;
}

.dialog-footer {
  display: flex;
  gap: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 8px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.dark {
  .note-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .form-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style>