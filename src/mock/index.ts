import type {
  UserInfo,
  Note,
  Collection,
  UserStats,
  Activity,
  Comment,
  HomeData,
  ExploreData
} from '../api/types'

// 用户信息
const mockUserInfo: UserInfo = {
  id: 1,
  username: '文学爱好者',
  email: 'reader@example.com',
  avatar: 'https://placeholder.co/100',
  bio: '热爱阅读，分享生活',
  followers: 1234,
  following: 45
}

// 笔记列表
const mockNotes: Note[] = [
  {
    id: 1,
    title: '《百年孤独》读后感：魔幻现实主义的艺术巅峰',
    content: '马尔克斯的《百年孤独》是一部震撼人心的杰作。通过布恩迪亚家族的百年历史，展现了拉丁美洲的神奇与现实...',
    author: {
      id: 1,
      name: '文学爱好者',
      avatar: 'https://placeholder.co/100',
      followers: 1234
    },
    tags: ['文学', '魔幻现实主义', '经典'],
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
      }
    ],
    createTime: '2024-02-15',
    status: 'published',
    isCollected: false
  },
  {
    id: 2,
    title: '《三体》中的科学与哲学思考',
    content: '刘慈欣的《三体》不仅是一部优秀的科幻作品，更是一部探讨人性与文明的哲学著作...',
    author: {
      id: 2,
      name: '科幻迷',
      avatar: 'https://placeholder.co/100',
      followers: 856
    },
    tags: ['科幻', '哲学', '文明探讨'],
    likes: 256,
    comments: [],
    createTime: '2024-02-16',
    status: 'published',
    isCollected: true
  },
  {
    id: 3,
    title: '《人类简史》：从认知革命到人工智能',
    content: '尤瓦尔·赫拉利在《人类简史》中，通过宏大的历史视角，展现了人类从认知革命到农业革命...',
    author: {
      id: 3,
      name: '历史研究者',
      avatar: 'https://placeholder.co/100',
      followers: 678
    },
    tags: ['历史', '人类学', '科普'],
    likes: 198,
    comments: [],
    createTime: '2024-02-17',
    status: 'draft',
    isCollected: false
  }
]

// 收藏夹列表
const mockCollections: Collection[] = [
  {
    id: 1,
    name: '文学作品笔记',
    description: '收集各类文学作品的读书笔记和感想',
    isPrivate: false,
    createTime: '2024-02-10',
    noteCount: 12,
    notes: mockNotes.slice(0, 2)
  },
  {
    id: 2,
    name: '科技前沿',
    description: '关于最新科技发展的思考和见解',
    isPrivate: true,
    createTime: '2024-02-15',
    noteCount: 8,
    notes: mockNotes.slice(1, 3)
  }
]

// 用户统计数据
const mockUserStats: UserStats = {
  totalNotes: 15,
  publishedNotes: 12,
  totalLikes: 156,
  followers: 23,
  following: 45
}

// 用户活动记录
const mockActivities: Activity[] = [
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
]

// 首页数据
const mockHomeData: HomeData = {
  hotNotes: mockNotes.slice(0, 2),
  recommendedNotes: mockNotes.slice(1, 3)
}

// 探索页数据
const mockExploreData: ExploreData = {
  notes: mockNotes,
  tags: ['文学', '科幻', '历史', '哲学', '心理', '经济', '社科', '技术']
}

export function useMockData() {
  const getMockData = (url: string, method: string) => {
    // 用户相关接口
    if (url.startsWith('/auth')) {
      if (url === '/auth/login') return mockUserInfo
      if (url === '/auth/register') return { success: true }
    }

    if (url.startsWith('/users')) {
      if (url === '/users/me') return mockUserInfo
      if (url === '/users/me/stats') return mockUserStats
      if (url === '/users/me/activities') return mockActivities
      if (url.includes('/follow')) return { success: true }
    }

    // 笔记相关接口
    if (url.startsWith('/notes')) {
      if (method === 'GET') {
        if (url === '/notes') return mockNotes
        const noteId = url.split('/')[2]
        if (noteId) {
          if (url.includes('/comments')) return mockNotes[0].comments
          return mockNotes.find(note => note.id === Number(noteId))
        }
      }
      if (method === 'POST') {
        if (url.includes('/comments')) return mockNotes[0].comments[0]
        if (url.includes('/like')) return { success: true }
        return mockNotes[0]
      }
      if (method === 'PUT') return mockNotes[0]
      if (method === 'DELETE') return { success: true }
    }

    // 收藏夹相关接口
    if (url.startsWith('/collections')) {
      if (method === 'GET') {
        if (url === '/collections') return mockCollections
        const collectionId = url.split('/')[2]
        return mockCollections.find(collection => collection.id === Number(collectionId))
      }
      if (method === 'POST') return mockCollections[0]
      if (method === 'PUT') return mockCollections[0]
      if (method === 'DELETE') return { success: true }
    }

    // 首页相关接口
    if (url === '/home') {
      return mockHomeData
    }

    // 探索页相关接口
    if (url.startsWith('/explore')) {
      if (url === '/explore') return mockExploreData
      if (url === '/explore/hot') return mockNotes.slice(0, 2)
      if (url === '/explore/recommended') return mockNotes.slice(2, 4)
      if (url === '/explore/tags') return mockExploreData.tags
    }

    return null
  }

  return {
    getMockData
  }
}

export default useMockData