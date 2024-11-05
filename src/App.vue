<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteAllFiles, deleteDir, deleteFile, downloadAllFiles, downloadDir, downloadFile, getFileList, uploadFile } from './api';
import { downloadFileFromResponse } from './utils/download';
import { FileItem } from './types';

// 文件列表
const fileList = ref<FileItem[]>([])
const getList = async () => {
  try {
    const response = await getFileList()
    if (response.ok) {
      fileList.value = await response.json()
    }
  } catch (error) {
    console.error('获取文件列表失败：', error)
  }
}

// 文件上传
const files = ref<File[]>([])
const uploadStatus = ref('')
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    files.value = Array.from(input.files)
  }
}
const handleUploadFiles = async () => {
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
    const response = await uploadFile(formData)
    if (response.ok) {
      uploadStatus.value = '上传成功！'
      files.value = []
      await getList()
    } else {
      uploadStatus.value = '上传失败'
    }
  } catch (error) {
    uploadStatus.value = '上传出错：' + error
  }
}


// 下载单个文件
const handleDownloadFile = async (filePath: string) => {
  try {
    downloadFileFromResponse(await downloadFile(filePath))
  } catch (error) {
    console.error('下载文件失败：', error)
  }
}

// 下载单个文件夹
const handleDownloadDir = async (filePath: string) => {
  try {
    downloadFileFromResponse(await downloadDir(filePath))
  } catch (error) {
    console.error('下载文件夹失败：', error)
  }
}

// 下载所有文件
const handleDownloadAllFiles = async () => {
  try {
    downloadFileFromResponse(await downloadAllFiles())
  } catch (error) {
    console.error('下载所有文件失败：', error)
  }
}

// 删除单个文件
const handleDeleteFile = async (filePath: string) => {
  try {
    const response = await deleteFile(filePath)
    if (response.ok) {
      await getList()
    }
  } catch (error) {
    console.error('删除文件失败：', error)
  }
}

// 删除单个文件夹
const handleDeleteDir = async (filePath: string) => {
  try {
    const response = await deleteDir(filePath)
    if (response.ok) {
      await getList()
    }
  } catch (error) {
    console.error('删除文件夹失败：', error)
  }
}

// 删除所有文件
const handleDeleteAllFiles = async () => {
  try {
    const response = await deleteAllFiles()
    if (response.ok) {
      await getList()
    }
  } catch (error) {
    console.error('删除所有文件失败：', error)
  }
}

// 页面加载时获取文件列表
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">LAN File Transfer</h1>

        <!-- 文件上传区域 -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input type="file" name="file" multiple class="hidden" @change="handleFileSelect" id="file-input">
          <label for="file-input" class="cursor-pointer block">
            <div class="text-gray-600">
              <svg class="mx-auto w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mb-2">Click or Drag Files Here</p>
              <p class="text-sm text-gray-500">Support Multiple Files Upload</p>
            </div>
          </label>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="files.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Selected Files:</h3>
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
        <div v-if="files.length > 0" class="flex flex-col items-center">
          <button @click="handleUploadFiles"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mb-3"
            :disabled="files.length === 0">
            Start Upload
          </button>
          <p v-if="uploadStatus" class="text-sm" :class="{
            'text-green-600': uploadStatus === 'Upload Success!',
            'text-red-600': uploadStatus.includes('Error') || uploadStatus.includes('Failed'),
            'text-blue-600': uploadStatus === 'Uploading...'
          }">
            {{ uploadStatus }}
          </p>
        </div>
      </div>
    </div>

    <!-- 在上传部分后添加文件列表组件 -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Server Files</h2>
        <div class="space-x-4">
          <button @click="handleDownloadAllFiles"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
            Download All Files
          </button>
          <button @click="handleDeleteAllFiles"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            Delete All Files
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <template v-for="file in fileList" :key="file.path">
          <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div class="flex items-center">
              <button v-if="file.path"
                @click="() => { file.type === 'directory' ? handleDownloadDir(file.path) : handleDownloadFile(file.path) }"
                class="mr-2 text-blue-500 hover:text-blue-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <span class="text-gray-700">{{ file.name }}</span>
            </div>
            <button v-if="file.path"
              @click="() => { file.type === 'directory' ? handleDeleteDir(file.path) : handleDeleteFile(file.path) }"
              class="text-red-500 hover:text-red-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
