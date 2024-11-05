const serverUrl = `http://${window.location.hostname}:3000/api`

// 获取文件列表
export const getFileList = async () =>
  fetch(`${serverUrl}/files`)

// 上传文件
export const uploadFile = async (file: FormData) =>
  fetch(`${serverUrl}/upload`, {
    method: 'POST',
    body: file
  })

// 删除文件
export const deleteFile = async (filePath: string) =>
  fetch(`${serverUrl}/delete?path=${encodeURIComponent(filePath)}`, {
    method: 'DELETE'
  })

// 删除文件夹
export const deleteDir = async (filePath: string) =>
  fetch(`${serverUrl}/deleteDir?path=${encodeURIComponent(filePath)}`, {
    method: 'DELETE'
  })

// 删除所有文件
export const deleteAllFiles = async () =>
  fetch(`${serverUrl}/deleteAll`, {
    method: 'DELETE'
  })

// 下载文件
export const downloadFile = async (filePath: string) =>
  fetch(`${serverUrl}/download?path=${encodeURIComponent(filePath)}`)

// 下载文件夹
export const downloadDir = async (filePath: string) =>
  fetch(`${serverUrl}/downloadDir?path=${encodeURIComponent(filePath)}`)

// 下载所有文件
export const downloadAllFiles = async () =>
  fetch(`${serverUrl}/downloadAll`)


