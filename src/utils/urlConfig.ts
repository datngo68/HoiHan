import type { UserConfig } from '../types'

interface ShareableConfig {
  s: string   // senderName
  r: string   // receiverName
  l: string   // language
  t: string   // themeColor
}

export function encodeConfigToURL(config: UserConfig): string {
  const url = new URL(window.location.href)
  url.hash = '' // Clear old hash method if exists
  const params = new URLSearchParams()
  params.set('s', config.senderName)
  params.set('r', config.receiverName)
  params.set('l', config.language)
  params.set('t', config.themeColor)
  url.search = params.toString()
  return url.toString()
}

export function decodeConfigFromURL(): Partial<UserConfig> | null {
  try {
    const params = new URLSearchParams(window.location.search)
    
    // Support legacy base64 hash backward compatibility
    const hash = window.location.hash.slice(1)
    if (hash && hash.startsWith('config=')) {
      const json = decodeURIComponent(escape(atob(hash.replace('config=', ''))))
      const data = JSON.parse(json) as ShareableConfig
      return {
        senderName: data.s,
        receiverName: data.r,
        language: data.l as 'vi' | 'en',
        themeColor: data.t
      }
    } else if (hash && !hash.includes('=')) {
      const json = decodeURIComponent(escape(atob(hash)))
      const data = JSON.parse(json) as ShareableConfig
      return {
        senderName: data.s,
        receiverName: data.r,
        language: data.l as 'vi' | 'en',
        themeColor: data.t
      }
    }

    if (!params.has('s') && !params.has('r')) return null

    const config: Partial<UserConfig> = {}
    if (params.get('s')) config.senderName = params.get('s')!
    if (params.get('r')) config.receiverName = params.get('r')!
    
    const lang = params.get('l')
    if (lang === 'vi' || lang === 'en') config.language = lang
    
    if (params.get('t')) config.themeColor = params.get('t')!

    return config
  } catch {
    return null
  }
}

export function exportConfigJSON(config: UserConfig): string {
  return JSON.stringify(config, null, 2)
}

export function importConfigJSON(json: string): UserConfig | null {
  try {
    const parsed = JSON.parse(json)
    if (!parsed.senderName || !parsed.receiverName) return null
    return {
      senderName: parsed.senderName,
      receiverName: parsed.receiverName,
      themeColor: parsed.themeColor || '#e11d48',
      language: parsed.language === 'en' ? 'en' : 'vi',
    }
  } catch {
    return null
  }
}
