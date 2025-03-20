import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function initTheme() {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = localStorage.getItem('theme') === 'dark' || prefersDark
    updateTheme()
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    updateTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
})