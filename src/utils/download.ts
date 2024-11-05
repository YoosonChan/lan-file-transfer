const getFileNameFromHeader = (headers: Response['headers']) => {
  const contentDisposition = headers.get('Content-Disposition')
  const filename = /[\w\s]+\.[a-zA-Z]+/g.exec(contentDisposition ?? '')?.[0]
  return filename ?? ''
}

export async function downloadFileFromResponse(response: Response, _filename?: string) {
  const filename = getFileNameFromHeader(response.headers)
  console.log('------filename------', filename);
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