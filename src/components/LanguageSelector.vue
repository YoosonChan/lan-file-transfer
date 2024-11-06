<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = {
  'en': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
}

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  locale.value = target.value
  localStorage.setItem('userLanguage', target.value)
}
</script>

<template>
  <div class="relative inline-block">
    <select :value="locale" @change="handleLanguageChange"
      class="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <option v-for="(name, code) in languages" :key="code" :value="code">
        {{ name }}
      </option>
    </select>
    <!-- 添加一个自定义的下拉箭头 -->
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>