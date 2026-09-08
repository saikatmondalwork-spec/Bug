import { useState, useRef, useEffect } from 'react'
import { EXAMPLES } from '../data/examples'

export default function ExamplePicker({ onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 bg-white hover:border-indigo-400 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Try Example ▾
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 max-h-72 overflow-y-auto"
        >
          {EXAMPLES.map((ex) => (
            <li key={ex.id} role="option">
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors"
                onClick={() => {
                  onSelect(ex)
                  setOpen(false)
                }}
              >
                <span className="block text-sm font-medium text-gray-800">{ex.title}</span>
                <span className="block text-xs text-gray-400 mt-0.5 truncate">{ex.summary}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
