import { useState, useEffect, useCallback } from 'react'
import {
  getUserLinks,
  createLink,
  deleteLink,
  canCreateFreeLink,
  type LinkDoc,
} from '../services/linksService'
import { useAuthStore } from '../store/useAuthStore'
import type { UserConfig } from '../types'

export function useLinks() {
  const user = useAuthStore((s) => s.user)
  const [links, setLinks] = useState<LinkDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [canFree, setCanFree] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [fetched, free] = await Promise.all([
        getUserLinks(user.uid),
        canCreateFreeLink(user.uid),
      ])
      setLinks(fetched)
      setCanFree(free)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(
    async (config: UserConfig, isPaid: boolean) => {
      if (!user) throw new Error('Not authenticated')
      await createLink(user.uid, config, isPaid)
      await refresh()
    },
    [user, refresh],
  )

  const remove = useCallback(
    async (linkId: string) => {
      await deleteLink(linkId)
      setLinks((prev) => prev.filter((l) => l.id !== linkId))
    },
    [],
  )

  return { links, loading, canFree, refresh, create, remove }
}
