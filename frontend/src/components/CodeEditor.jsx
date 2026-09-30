import { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Code2, Copy, Check, RotateCcw, CheckCircle2, Sparkles, Trash2, AlignLeft } from 'lucide-react'

const MONACO_LANG = {
  Python: 'python',
  JavaScript: 'javascript',
  'C++': 'cpp',
}

export default function CodeEditor({
  language,
  value,
  onChange,
  changeStatus,
  onAcceptChanges,
  onRevertChanges,
  onApplyFixAgain,
}) {
  const [copied, setCopied] = useState(false)
  const editorRef = useRef(null)

  const lineCount = value ? value.split('\n').length : 0
  const charCount = value ? value.length : 0

  function handleEditorDidMount(editor) {
    editorRef.current = editor
  }

  async function handleCopy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }

  function handleFormat() {
    if (editorRef.current) {
      try {
        editorRef.current.getAction('editor.action.formatDocument')?.run()
      } catch {
        // Fallback simple trim/format
        const formatted = value
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
        onChange(formatted)
      }
    } else {
      const formatted = value
        .split('\n')
        .map((line) => line.trimEnd())
        .join('\n')
      onChange(formatted)
    }
  }

  return (
    <div className="space-y-2">
      {/* Editor Section Header & Stats */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 font-semibold text-slate-300 tracking-wide uppercase text-[11px]">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Source Code</span>
        </label>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>·</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#080c14] focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all shadow-inner">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d121f] border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-indigo-300 border border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {language}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              UTF-8
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFormat}
              title="Format and trim whitespace"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded transition-colors cursor-pointer"
            >
              <AlignLeft className="w-3 h-3 text-slate-400" />
              <span>Format</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              title="Copy code to clipboard"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear code"
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-400 hover:text-rose-400 hover:bg-slate-800/70 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Change status banner inside editor card */}
        {changeStatus === 'pending' && (
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-b border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
              <div>
                <span className="font-semibold text-slate-100">Fix applied to editor!</span>
                <span className="text-slate-400 text-[11px] ml-1.5 hidden sm:inline">Review changes and accept or revert.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onAcceptChanges}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded shadow-sm shadow-emerald-500/20 transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3" />
                Accept
              </button>
              <button
                type="button"
                onClick={onRevertChanges}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Revert
              </button>
            </div>
          </div>
        )}

        {changeStatus === 'accepted' && (
          <div className="px-3 py-1.5 bg-emerald-950/30 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Changes accepted into your code editor.
            </span>
            <button
              type="button"
              onClick={onRevertChanges}
              className="text-[11px] text-emerald-400 hover:text-emerald-200 underline font-medium cursor-pointer"
            >
              Revert to original
            </button>
          </div>
        )}

        {changeStatus === 'reverted' && (
          <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">Reverted to original code.</span>
            <button
              type="button"
              onClick={onApplyFixAgain}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              Re-apply AI fix
            </button>
          </div>
        )}

        {/* Monaco Editor Container */}
        <div className="relative min-h-[280px]">
          <Editor
            height="290px"
            language={MONACO_LANG[language] ?? 'plaintext'}
            value={value}
            onChange={(val) => onChange(val ?? '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            loading={
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Loading editor...
              </div>
            }
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              lineNumbersMinChars: 3,
              glyphMargin: false,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              padding: { top: 12, bottom: 12 },
              overviewRulerLanes: 0,
              renderLineHighlight: 'line',
              contextmenu: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      </div>
    </div>
  )
}
