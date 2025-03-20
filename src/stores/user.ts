import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({
    username: '',
    email: '',
    avatar: ''
  })

  function login(email: string, password: string) {
    // 模拟登录成功
    isLoggedIn.value = true
    userInfo.value = {
      username: email.split('@')[0],
      email: email,
      avatar: 'https://placeholder.co/100'
    }
  }

  function register(email: string, username: string, password: string) {
    // 模拟注册成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = {
      username: '',
      email: '',
      avatar: ''
    }
  }

  return {
    isLoggedIn,
    userInfo,
    login,
    register,
    logout
  }
})