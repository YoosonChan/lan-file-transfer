import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zhCN from './locales/zh-CN'
import zhTW from './locales/zh-TW'

// 获取浏览器语言
const getBrowserLanguage = () => {
  const lang = navigator.language
  if (lang.includes('zh')) {
    return lang.includes('TW') || lang.includes('HK') ? 'zh-TW' : 'zh-CN'
  }
  return 'en'
}

const savedLanguage = localStorage.getItem('userLanguage')
const browserLanguage = getBrowserLanguage()

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage || browserLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
    'zh-TW': zhTW
  }
})

export default i18n 