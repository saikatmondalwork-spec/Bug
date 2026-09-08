// Language selector — Python, JavaScript, C++
const LANGUAGES = ['Python', 'JavaScript', 'C++']

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Select programming language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          aria-pressed={value === lang}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
            ${value === lang
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
