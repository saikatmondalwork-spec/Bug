import Editor from '@monaco-editor/react'

const MONACO_LANG = {
  Python: 'python',
  JavaScript: 'javascript',
  'C++': 'cpp',
}

export default function CodeEditor({ language, value, onChange }) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
      <Editor
        height="260px"
        language={MONACO_LANG[language] ?? 'plaintext'}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
          overviewRulerLanes: 0,
          renderLineHighlight: 'line',
          contextmenu: false,
        }}
      />
    </div>
  )
}
