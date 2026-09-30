import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import CodeEditor from './components/CodeEditor'
import ErrorInput from './components/ErrorInput'
import ResultPanel from './components/ResultPanel'
import LoadingSpinner from './components/LoadingSpinner'
import EmptyState from './components/EmptyState'
import ExamplePicker from './components/ExamplePicker'
import ErrorBanner from './components/ErrorBanner'
import { EXAMPLES } from './data/examples'
import { Sparkles, Terminal, RotateCcw, AlertCircle } from 'lucide-react'

const MAX_CODE_LENGTH = 20000
const MAX_ERROR_LENGTH = 2000

export default function App() {
  const [language, setLanguage] = useState('Python')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [validationMsg, setValidationMsg] = useState(null)
  const [originalCode, setOriginalCode] = useState(null)
  const [changeStatus, setChangeStatus] = useState(null) // null | 'pending' | 'accepted' | 'reverted'
  const [aiHealth, setAiHealth] = useState(null)
  const [analysisTimestamp, setAnalysisTimestamp] = useState(null)
  const [selectedExampleId, setSelectedExampleId] = useState(null)

  // Check backend health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health')
        if (res.ok) {
          const data = await res.json()
          setAiHealth(data)
        }
      } catch {
        // Backend ping failed, default to demo mode
        setAiHealth({ mode: 'demo', geminiConfigured: false })
      }
    }
    checkHealth()
  }, [])

  function handleLanguageChange(lang) {
    setLanguage(lang)
    setValidationMsg(null)
  }

  function handleClear() {
    setCode('')
    setErrorMessage('')
    setResult(null)
    setApiError(null)
    setValidationMsg(null)
    setOriginalCode(null)
    setChangeStatus(null)
    setSelectedExampleId(null)
    setAnalysisTimestamp(null)
  }

  function handleExampleSelect(example) {
    setLanguage(example.language)
    setErrorMessage(example.error)
    setCode(example.code)
    setSelectedExampleId(example.id)
    setResult(null)
    setApiError(null)
    setValidationMsg(null)
    setOriginalCode(null)
    setChangeStatus(null)
  }

  function handleQuickSample(exampleId) {
    const found = EXAMPLES.find((e) => e.id === exampleId)
    if (found) {
      handleExampleSelect(found)
    }
  }

  function handleAcceptChanges() {
    setChangeStatus('accepted')
  }

  function handleRevertChanges() {
    if (originalCode !== null) {
      setCode(originalCode)
      setChangeStatus('reverted')
    }
  }

  function handleApplyFixAgain() {
    if (result?.fixedCode) {
      setCode(result.fixedCode)
      setChangeStatus('pending')
    }
  }

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault()

      // Client-side validation
      if (!errorMessage.trim() && !code.trim()) {
        setValidationMsg('Please provide both an error message/stack trace and your code.')
        return
      }
      if (!errorMessage.trim()) {
        setValidationMsg('Please paste an error message or stack trace.')
        return
      }
      if (!code.trim()) {
        setValidationMsg('Please provide the source code to debug.')
        return
      }

      setValidationMsg(null)
      setResult(null)
      setApiError(null)
      setChangeStatus(null)
      setLoading(true)

      const submittedCode = code

      try {
        const response = await fetch('/api/debug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language,
            error: errorMessage.slice(0, MAX_ERROR_LENGTH),
            code: submittedCode.slice(0, MAX_CODE_LENGTH),
          }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          setApiError(data.error ?? 'Analysis failed. Please try again.')
        } else {
          setResult(data.result)
          setAnalysisTimestamp(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          )
          if (data.mode) {
            setAiHealth((prev) => ({ ...prev, mode: data.mode }))
          }
          if (data.result?.fixedCode) {
            // Immediately apply fix to editor and set change status to pending
            setOriginalCode(submittedCode)
            setCode(data.result.fixedCode)
            setChangeStatus('pending')
          }
        }
      } catch {
        setApiError('Could not reach the backend server at http://localhost:3001. Please check your connection and try again.')
      } finally {
        setLoading(false)
      }
    },
    [code, errorMessage, language]
  )

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to analyze
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!loading) {
          handleSubmit()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, loading])

  const renderRightPanel = () => {
    if (loading) return <LoadingSpinner />
    if (apiError) return <ErrorBanner error={apiError} onRetry={triggerSubmit} />
    if (result) {
      return (
        <ResultPanel
          result={result}
          language={language}
          originalCode={originalCode}
          changeStatus={changeStatus}
          onAcceptChanges={handleAcceptChanges}
          onRevertChanges={handleRevertChanges}
          onApplyFixAgain={handleApplyFixAgain}
          timestamp={analysisTimestamp}
          apiMode={aiHealth?.mode}
        />
      )
    }
    return <EmptyState onSelectSample={handleQuickSample} />
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header aiHealth={aiHealth} onClearWorkspace={handleClear} />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ── LEFT PANEL: Debug Input (7 cols on desktop) ── */}
          <section
            className="lg:col-span-7 bg-[#0c101a] border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-xl space-y-4"
            aria-label="Debug Input Workspace"
          >
            {/* Panel Toolbar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 flex-wrap gap-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Terminal className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Debug Input
                </span>
              </div>

              {/* Language Selector + Example Picker */}
              <div className="flex items-center gap-2 flex-wrap">
                <LanguageSelector value={language} onChange={handleLanguageChange} />
                <ExamplePicker onSelect={handleExampleSelect} currentExampleId={selectedExampleId} />
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Error / Stack Trace Input */}
              <ErrorInput value={errorMessage} onChange={setErrorMessage} />

              {/* Source Code Monaco Editor */}
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                changeStatus={changeStatus}
                onAcceptChanges={handleAcceptChanges}
                onRevertChanges={handleRevertChanges}
                onApplyFixAgain={handleApplyFixAgain}
              />

              {/* Client-side Validation Alert */}
              {validationMsg && (
                <div
                  role="alert"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{validationMsg}</span>
                </div>
              )}

              {/* Actions Toolbar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Diagnosing Bug...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Analyze Bug</span>
                      <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-indigo-100">
                        Ctrl+Enter
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  title="Clear inputs and results"
                  className="px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 bg-[#080c14] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </form>
          </section>

          {/* ── RIGHT PANEL: AI Analysis (5 cols on desktop) ── */}
          <section
            className="lg:col-span-5 bg-[#0c101a] border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-xl min-h-[460px]"
            aria-label="AI Analysis Results"
            aria-live="polite"
          >
            {renderRightPanel()}
          </section>

        </div>
      </main>
    </div>
  )
}
