<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
const uploadStatus = ref('')
const serverUrl = ref(`http://${window.location.hostname}:3000/api`)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    files.value = Array.from(input.files)
  }
}

const uploadFiles = async () => {
  if (files.value.length === 0) {
    uploadStatus.value = '请选择文件'
    return
  }

  const formData = new FormData()
  files.value.forEach(file => {
    formData.append('files', file)
  })

  try {
    uploadStatus.value = '正在上传...'
    const response = await fetch(`${serverUrl.value}/upload`, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      uploadStatus.value = '上传成功！'
      files.value = []
    } else {
      uploadStatus.value = '上传失败'
    }
  } catch (error) {
    uploadStatus.value = '上传出错：' + error
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">局域网文件传输</h1>

        <!-- 文件上传区域 -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input type="file" name="file" multiple class="hidden" @change="handleFileSelect" id="file-input">
          <label for="file-input" class="cursor-pointer block">
            <div class="text-gray-600">
              <svg class="mx-auto w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mb-2">点击或拖拽文件到此处</p>
              <p class="text-sm text-gray-500">支持多个文件上传</p>
            </div>
          </label>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="files.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-3">已选择的文件：</h3>
          <ul class="space-y-2">
            <li v-for="file in files" :key="file.name" class="flex items-center text-gray-700">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
            </li>
          </ul>
        </div>

        <!-- 上传按钮和状态 -->
        <div class="flex flex-col items-center">
          <button @click="uploadFiles"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mb-3"
            :disabled="files.length === 0">
            开始上传
          </button>
          <p v-if="uploadStatus" class="text-sm" :class="{
            'text-green-600': uploadStatus === '上传成功！',
            'text-red-600': uploadStatus.includes('错误') || uploadStatus.includes('失败'),
            'text-blue-600': uploadStatus === '正在上传...'
          }">
            {{ uploadStatus }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
