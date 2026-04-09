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
  
  // Format: sender|receiver|lang|theme|autoPlayMusic|enableHeartJourney
  const rawString = `${config.senderName}|${config.receiverName}|${config.language}|${config.themeColor}|${config.autoPlayMusic ? '1' : '0'}|${config.enableHeartJourney !== false ? '1' : '0'}`
  
  // Create UTF-8 friendly base64, then make it URL-safe (replace + /, remove =)
  let encoded = btoa(unescape(encodeURIComponent(rawString)))
  encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const params = new URLSearchParams()
  params.set('id', encoded)
  url.search = params.toString()
  
  return url.toString()
}

export function decodeConfigFromURL(): Partial<UserConfig> | null {
  try {
    const params = new URLSearchParams(window.location.search)
    
    // 1. Newest Format: ?id=ShortBase64
    if (params.has('id')) {
      let encoded = params.get('id')!
      encoded = encoded.replace(/-/g, '+').replace(/_/g, '/')
      const decodedString = decodeURIComponent(escape(atob(encoded)))
      const [sender, receiver, language, theme, autoPlay, heartJourney] = decodedString.split('|')
      if (sender && receiver) {
        return {
          senderName: sender,
          receiverName: receiver,
          language: language === 'en' ? 'en' : 'vi',
          themeColor: theme || '#e11d48',
          autoPlayMusic: autoPlay === '1',
          enableHeartJourney: heartJourney === '0' ? false : true,
        }
      }
    }

    // 2. Intermediate Format: ?s=Sender&r=Receiver
    if (params.has('s') && params.has('r')) {
      const config: Partial<UserConfig> = {
        senderName: params.get('s')!,
        receiverName: params.get('r')!
      }
      const lang = params.get('l')
      if (lang === 'vi' || lang === 'en') config.language = lang
      if (params.get('t')) config.themeColor = params.get('t')!
      return config
    }

    // 3. Legacy Format: #config=eyJ...
    const hash = window.location.hash.slice(1)
    if (hash) {
      const cleanHash = hash.startsWith('config=') ? hash.replace('config=', '') : hash
      const json = decodeURIComponent(escape(atob(cleanHash)))
      const data = JSON.parse(json) as ShareableConfig
      return {
        senderName: data.s,
        receiverName: data.r,
        language: data.l === 'en' ? 'en' : 'vi',
        themeColor: data.t
      }
    }

    return null
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
      autoPlayMusic: !!parsed.autoPlayMusic,
      enableHeartJourney: parsed.enableHeartJourney !== false,
    }
  } catch {
    return null
  }
}
