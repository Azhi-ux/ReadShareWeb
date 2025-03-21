// 用户相关接口类型
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  bio?: string
  followers: number
  following: number
}

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  username: string
  password: string
}

// 笔记相关接口类型
export interface Note {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
    avatar: string
    followers?: number
  }
  tags: string[]
  likes: number
  comments: Comment[]
  createTime: string
  updateTime?: string
  status: 'draft' | 'published'
  isCollected?: boolean
}

export interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatar: string
  }
  createTime: string
  likes: number
}

export interface CreateNoteParams {
  title: string
  content: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface UpdateNoteParams extends CreateNoteParams {
  id: number
}

// 收藏夹相关接口类型
export interface Collection {
  id: number
  name: string
  description: string
  isPrivate: boolean
  createTime: string
  noteCount: number
  notes?: Note[]
}

export interface CreateCollectionParams {
  name: string
  description: string
  isPrivate: boolean
}

// 统计数据类型
export interface UserStats {
  totalNotes: number
  publishedNotes: number
  totalLikes: number
  followers: number
  following: number
}

// 活动记录类型
export interface Activity {
  id: number
  type: 'note' | 'like' | 'follow' | 'comment'
  title: string
  content: string
  time: string
}

// 首页数据类型
export interface HomeData {
  hotNotes: Note[]
  recommendedNotes: Note[]
}

// 探索页数据类型
export interface ExploreData {
  notes: Note[]
  tags: string[]
}

// 搜索参数类型
export interface SearchParams {
  query?: string
  tags?: string[]
  status?: 'all' | 'published' | 'draft'
  page?: number
  pageSize?: number
}