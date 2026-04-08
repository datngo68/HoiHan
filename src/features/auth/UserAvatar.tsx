import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, LayoutDashboard, PlusCircle, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { navigateTo } from '../../pages/router'

export default function UserAvatar() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const menuItems = [
    { icon: LayoutDashboard, label: 'Link của tôi', action: () => navigateTo('dashboard') },
    { icon: PlusCircle, label: 'Tạo link mới', action: () => navigateTo('create') },
    {
      icon: LogOut,
      label: 'Đăng xuất',
      action: async () => {
        await signOut()
        navigateTo('login')
      },
      danger: true,
    },
  ]

  return (
    <div ref={ref} className="fixed top-4 left-4 z-40">
      <motion.button
        id="btn-user-avatar"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer border-none"
        style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(225,29,72,0.25)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="User menu"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User'}
            className="w-7 h-7 object-cover"
            style={{ imageRendering: 'auto' }}
          />
        ) : (
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: '#e11d48' }}
          >
            <User size={14} className="text-white" />
          </div>
        )}
        <span
          className="hidden sm:block text-xs font-medium max-w-[100px] truncate"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {user.displayName?.split(' ').pop()}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: '180px',
              background: 'rgba(10,10,10,0.95)',
              border: '1px solid rgba(225,29,72,0.2)',
              backdropFilter: 'blur(12px)',
              transformOrigin: 'top left',
            }}
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setOpen(false); item.action() }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer border-none"
                style={{
                  background: 'transparent',
                  color: item.danger ? '#e11d48' : 'rgba(255,255,255,0.75)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(225,29,72,0.08)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
