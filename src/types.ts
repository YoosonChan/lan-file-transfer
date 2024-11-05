export interface FileItem {
  name: string
  path: string
  type: 'directory' | 'file'
  size: number
  createTime: Date
  children?: FileItem[]
}