import axios from 'axios'
import type {
  UserInfo,
  LoginParams,
  RegisterParams,
  Note,
  CreateNoteParams,
  UpdateNoteParams,
  Collection,
  CreateCollectionParams,
  UserStats,
  Activity,
  HomeData,
  ExploreData,
  SearchParams
} from './types'
import { useMockData } from '../mock'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 用户相关API
export const userApi = {
  login: (params: LoginParams) => {
    return api.post<UserInfo>('/auth/login', params)
  },

  register: (params: RegisterParams) => {
    return api.post<void>('/auth/register', params)
  },

  logout: () => {
    return api.post<void>('/auth/logout')
  },

  getCurrentUser: () => {
    return api.get<UserInfo>('/users/me')
  },

  updateUserInfo: (params: Partial<UserInfo>) => {
    return api.put<UserInfo>('/users/me', params)
  },

  getUserStats: () => {
    return api.get<UserStats>('/users/me/stats')
  },

  getActivities: () => {
    return api.get<Activity[]>('/users/me/activities')
  },

  followUser: (userId: number) => {
    return api.post<void>(`/users/${userId}/follow`)
  },

  unfollowUser: (userId: number) => {
    return api.delete<void>(`/users/${userId}/follow`)
  }
}

// 笔记相关API
export const noteApi = {
  getNotes: (params?: SearchParams) => {
    return api.get<Note[]>('/notes', { params })
  },

  getNoteById: (id: number) => {
    return api.get<Note>(`/notes/${id}`)
  },

  createNote: (params: CreateNoteParams) => {
    return api.post<Note>('/notes', params)
  },

  updateNote: (params: UpdateNoteParams) => {
    return api.put<Note>(`/notes/${params.id}`, params)
  },

  deleteNote: (id: number) => {
    return api.delete<void>(`/notes/${id}`)
  },

  likeNote: (id: number) => {
    return api.post<void>(`/notes/${id}/like`)
  },

  unlikeNote: (id: number) => {
    return api.delete<void>(`/notes/${id}/like`)
  },

  addComment: (noteId: number, content: string) => {
    return api.post<Comment>(`/notes/${noteId}/comments`, { content })
  },

  likeComment: (noteId: number, commentId: number) => {
    return api.post<void>(`/notes/${noteId}/comments/${commentId}/like`)
  }
}

// 收藏夹相关API
export const collectionApi = {
  getCollections: (params?: { showPrivate?: boolean; search?: string }) => {
    return api.get<Collection[]>('/collections', { params })
  },

  getCollectionById: (id: number) => {
    return api.get<Collection>(`/collections/${id}`)
  },

  createCollection: (params: CreateCollectionParams) => {
    return api.post<Collection>('/collections', params)
  },

  updateCollection: (id: number, params: Partial<CreateCollectionParams>) => {
    return api.put<Collection>(`/collections/${id}`, params)
  },

  deleteCollection: (id: number) => {
    return api.delete<void>(`/collections/${id}`)
  },

  addNoteToCollection: (collectionId: number, noteId: number) => {
    return api.post<void>(`/collections/${collectionId}/notes/${noteId}`)
  },

  removeNoteFromCollection: (collectionId: number, noteId: number) => {
    return api.delete<void>(`/collections/${collectionId}/notes/${noteId}`)
  }
}

// 首页相关API
export const homeApi = {
  getHomeData: () => {
    return api.get<HomeData>('/home')
  }
}

// 探索页相关API
export const exploreApi = {
  getExploreData: (params?: SearchParams) => {
    return api.get<ExploreData>('/explore', { params })
  },

  getHotNotes: () => {
    return api.get<Note[]>('/explore/hot')
  },

  getRecommendedNotes: () => {
    return api.get<Note[]>('/explore/recommended')
  },

  getAllTags: () => {
    return api.get<string[]>('/explore/tags')
  }
}

// API拦截器配置
api.interceptors.request.use(
  (config) => {
    // 如果是开发环境且启用了mock，使用mock数据
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
      const mockData = useMockData()
      const mockResponse = mockData.getMockData(config.url!, config.method!)
      return Promise.reject({ response: { data: mockResponse } })
    }
    
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data) {
      return Promise.resolve(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api