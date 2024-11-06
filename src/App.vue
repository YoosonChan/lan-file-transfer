<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileItem } from './types';
import { deleteAllFiles, deleteDir, deleteFile, downloadAllFiles, downloadDir, downloadFile, getFileList, uploadFile } from './api';
import { downloadFileFromResponse } from './utils/download';
import LanguageSelector from './components/LanguageSelector.vue'
const { t } = useI18n()

// 文件列表
const fileList = ref<FileItem[]>([])
const getList = async () => {
  try {
    const response = await getFileList()
    if (response.ok) {
      fileList.value = await response.json()
    }
  } catch (error) {
    console.error(t('errors.fileList'), error)
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
    uploadStatus.value = t('upload.status.select')
    return
  }
  const formData = new FormData()
  files.value.forEach(file => {
    formData.append('files', file)
  })
  try {
    uploadStatus.value = t('upload.status.uploading')
    const response = await uploadFile(formData)
    if (response.ok) {
      uploadStatus.value = t('upload.status.success')
      files.value = []
      await getList()
    } else {
      uploadStatus.value = t('upload.status.error')
    }
  } catch (error) {
    uploadStatus.value = t('upload.status.error') + error
  }
}


// 下载单个文件
const handleDownloadFile = async (filePath: string) => {
  try {
    downloadFileFromResponse(await downloadFile(filePath))
  } catch (error) {
    console.error(t('errors.download.file'), error)
  }
}

// 下载单个文件夹
const handleDownloadDir = async (filePath: string) => {
  try {
    downloadFileFromResponse(await downloadDir(filePath))
  } catch (error) {
    console.error(t('errors.download.directory'), error)
  }
}

// 下载所有文件
const handleDownloadAllFiles = async () => {
  try {
    downloadFileFromResponse(await downloadAllFiles())
  } catch (error) {
    console.error(t('errors.download.all'), error)
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
    console.error(t('errors.delete.file'), error)
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
    console.error(t('errors.delete.directory'), error)
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
    console.error(t('errors.delete.all'), error)
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
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">{{ t('title') }}</h1>
          <LanguageSelector />
        </div>

        <!-- 文件上传区域 -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input type="file" name="file" multiple class="hidden" @change="handleFileSelect" id="file-input">
          <label for="file-input" class="cursor-pointer block">
            <div class="text-gray-600">
              <svg class="mx-auto w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mb-2">{{ t('upload.dropzone.title') }}</p>
              <p class="text-sm text-gray-500">{{ t('upload.dropzone.subtitle') }}</p>
            </div>
          </label>
        </div>

        <!-- 已选文件列表 -->
        <div v-if="files.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-3">{{ t('upload.selectedFiles') }}</h3>
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
            {{ t('upload.startUpload') }}
          </button>
          <p v-if="uploadStatus" class="text-sm" :class="{
            'text-green-600': uploadStatus === t('upload.status.success'),
            'text-red-600': uploadStatus.includes(t('upload.status.error')) || uploadStatus.includes('Failed'),
            'text-blue-600': uploadStatus === t('upload.status.uploading')
          }">
            {{ uploadStatus }}
          </p>
        </div>
      </div>
    </div>

    <!-- 在上传部分后添加文件列表组件 -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">{{ t('serverFiles.title') }}</h2>
        <div class="space-x-4">
          <button @click="handleDownloadAllFiles"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
            {{ t('serverFiles.downloadAll') }}
          </button>
          <button @click="handleDeleteAllFiles"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
            {{ t('serverFiles.deleteAll') }}
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
