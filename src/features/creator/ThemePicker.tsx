interface ThemePickerProps {
  value: string
  onChange: (color: string) => void
}

const PRESETS = [
  '#e11d48', // rose-600
  '#db2777', // pink-600
  '#ea580c', // orange-600
  '#d97706', // amber-600
  '#16a34a', // green-600
  '#0891b2', // cyan-600
  '#2563eb', // blue-600
  '#7c3aed', // violet (option only, not UI)
]

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Màu chủ đạo
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        {PRESETS.map((color) => (
          <button
            key={color}
            id={`theme-swatch-${color.slice(1)}`}
            onClick={() => onChange(color)}
            className="w-8 h-8 cursor-pointer border-none flex items-center justify-center transition-transform"
            style={{
              background: color,
              outline: value === color ? `2px solid ${color}` : '2px solid transparent',
              outlineOffset: '2px',
              transform: value === color ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`Màu ${color}`}
            title={color}
          />
        ))}

        {/* Custom color */}
        <label
          className="w-8 h-8 cursor-pointer flex items-center justify-center relative"
          title="Chọn màu tự do"
          style={{
            border: '2px dashed rgba(255,255,255,0.25)',
            background: 'transparent',
          }}
        >
          <span className="text-sm">+</span>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Custom color picker"
          />
        </label>
      </div>
    </div>
  )
}
