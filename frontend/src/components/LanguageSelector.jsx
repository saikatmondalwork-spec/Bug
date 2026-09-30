const LANGUAGES = [
  { id: 'Python', label: 'Python', ext: '.py', color: 'from-blue-500 to-yellow-500' },
  { id: 'JavaScript', label: 'JavaScript', ext: '.js', color: 'from-amber-400 to-yellow-500' },
  { id: 'C++', label: 'C++', ext: '.cpp', color: 'from-sky-400 to-blue-600' },
]

export default function LanguageSelector({ value, onChange }) {
  return (
    <div
      className="inline-flex items-center p-1 rounded-lg bg-[#080c14] border border-slate-800/90 shadow-inner"
      role="group"
      aria-label="Select programming language"
    >
      {LANGUAGES.map((lang) => {
        const isActive = value === lang.id
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onChange(lang.id)}
            aria-pressed={isActive}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {/* Small language indicator */}
            <span
              className={`w-2 h-2 rounded-full transition-opacity ${
                isActive ? 'bg-white' : 'bg-slate-500 opacity-60'
              }`}
            />
            <span>{lang.label}</span>
            <span className={`text-[10px] font-mono transition-colors ${
              isActive ? 'text-indigo-200' : 'text-slate-400'
            }`}>
              {lang.ext}
            </span>
          </button>
        )
      })}
    </div>
  )
}
