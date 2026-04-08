import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, RefreshCw, LayoutGrid } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useLinks } from '../../hooks/useLinks'
import { navigateTo } from '../../pages/router'
import UserAvatar from '../auth/UserAvatar'
import LinkCard from './LinkCard'

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

export default function DashboardPage() {
  const { user } = useAuth()
  const { links, loading, canFree, refresh, remove } = useLinks()

  if (!user) {
    navigateTo('login')
    return null
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #080808 0%, #140306 60%, #080808 100%)', fontFamily: FONT }}
    >
      <UserAvatar />

      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid size={16} style={{ color: '#e11d48' }} />
            <div>
              <h1
                className="font-bold leading-none"
                style={{ color: '#fff', fontSize: '1.1rem', letterSpacing: '-0.03em' }}
              >
                Link của <span style={{ color: '#e11d48' }}>bạn</span>
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {links.length} link · {canFree ? '1 free khả dụng' : 'Link free đã dùng'}
              </p>
            </div>
          </div>

          <button
            id="btn-refresh"
            onClick={refresh}
            className="border-none cursor-pointer p-2"
            style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)' }}
            aria-label="Làm mới"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <RefreshCw size={24} className="animate-spin mb-3" />
            <p className="text-sm">Đang tải...</p>
          </div>
        ) : links.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">💌</div>
            <p className="font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Bạn chưa có link nào
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Tạo link đầu tiên — hoàn toàn miễn phí!
            </p>
            <motion.button
              onClick={() => navigateTo('create')}
              className="px-6 py-3 font-bold text-sm border-none cursor-pointer"
              style={{ background: '#e11d48', color: '#fff' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              ✨ Tạo link đầu tiên
            </motion.button>
          </motion.div>
        ) : (
          /* Links list */
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} onDelete={remove} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB  */}
      {!loading && (
        <motion.button
          id="btn-fab-create"
          onClick={() => navigateTo('create')}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 font-bold text-sm border-none cursor-pointer shadow-lg z-30"
          style={{ background: '#e11d48', color: '#fff' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <PlusCircle size={16} />
          {canFree ? 'Tạo link miễn phí' : 'Tạo link — 19.999đ'}
        </motion.button>
      )}
    </div>
  )
}
