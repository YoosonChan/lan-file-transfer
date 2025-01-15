const getFileNameFromHeader = (headers: Response['headers']) => {
  const contentDisposition = headers.get('Content-Disposition')
  // 存在字符编码兼容报错问题, 解决方案：通过后端encodeURIComponent, 然后前端decodeURIComponent
  const filename = /[\w%]+\.[\w]+/g.exec(contentDisposition ?? '')?.[0]
  return decodeURIComponent(filename ?? '')
}

export async function downloadFileFromResponse(response: Response, _filename?: string) {
  const filename = getFileNameFromHeader(response.headers)
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}