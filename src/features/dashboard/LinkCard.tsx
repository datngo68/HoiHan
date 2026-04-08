import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Trash2, ExternalLink } from 'lucide-react'
import type { LinkDoc } from '../../services/linksService'

interface LinkCardProps {
  link: LinkDoc
  onDelete: (id: string) => Promise<void>
}

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(link.encodedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await onDelete(link.id)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const date = link.createdAt instanceof Date
    ? link.createdAt.toLocaleDateString('vi-VN')
    : 'Không rõ'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        background: '#0d0d0d',
        border: `1px solid ${link.themeColor}25`,
        borderLeft: `3px solid ${link.themeColor}`,
        padding: '1rem',
        position: 'relative',
      }}
    >
      {/* Theme color dot */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm" style={{ color: '#fff' }}>
              {link.senderName}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>→</span>
            <span className="font-bold text-sm" style={{ color: link.themeColor }}>
              {link.receiverName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-bold uppercase px-1.5 py-0.5"
              style={{
                background: link.isPaid ? `${link.themeColor}20` : 'rgba(255,255,255,0.06)',
                color: link.isPaid ? link.themeColor : 'rgba(255,255,255,0.35)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
              }}
            >
              {link.isPaid ? 'PAID' : 'FREE'}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {date}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              · {link.views} lượt xem
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        <button
          id={`btn-copy-${link.id}`}
          onClick={copyLink}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border-none cursor-pointer"
          style={{ background: copied ? '#16a34a' : 'rgba(255,255,255,0.07)', color: copied ? '#fff' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Đã copy' : 'Copy link'}
        </button>

        <a
          href={link.encodedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold no-underline"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
        >
          <ExternalLink size={12} />
          Mở
        </a>

        <button
          id={`btn-delete-${link.id}`}
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border-none cursor-pointer"
          style={{
            background: confirmDelete ? 'rgba(225,29,72,0.15)' : 'transparent',
            color: confirmDelete ? '#e11d48' : 'rgba(255,255,255,0.25)',
            transition: 'all 0.2s',
          }}
          onMouseLeave={() => setTimeout(() => setConfirmDelete(false), 2000)}
        >
          <Trash2 size={12} />
          {deleting ? '...' : confirmDelete ? 'Xác nhận xoá?' : 'Xoá'}
        </button>
      </div>
    </motion.div>
  )
}
