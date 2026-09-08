import { useState } from 'react'
import LanguageSelector from './components/LanguageSelector'
import CodeEditor from './components/CodeEditor'
import ErrorInput from './components/ErrorInput'
import ResultPanel from './components/ResultPanel'
import LoadingSpinner from './components/LoadingSpinner'
import EmptyState from './components/EmptyState'
import ExamplePicker from './components/ExamplePicker'

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
  }

  function handleExampleSelect(example) {
    setLanguage(example.language)
    setErrorMessage(example.error)
    setCode(example.code)
    setResult(null)
    setApiError(null)
    setValidationMsg(null)
    setOriginalCode(null)
    setChangeStatus(null)
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

  async function handleSubmit(e) {
    e.preventDefault()

    // Client-side validation
    if (!errorMessage.trim() && !code.trim()) {
      setValidationMsg('Please enter an error message and paste your code.')
      return
    }
    if (!errorMessage.trim()) {
      setValidationMsg('Please enter an error message or stack trace.')
      return
    }
    if (!code.trim()) {
      setValidationMsg('Please paste the code you want to debug.')
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
        if (data.result?.fixedCode) {
          // Immediately edit the code in the editor with the fix and prompt user to accept changes
          setOriginalCode(submittedCode)
          setCode(data.result.fixedCode)
          setChangeStatus('pending')
        }
      }
    } catch {
      setApiError('Could not reach the server. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const rightPanelContent = () => {
    if (loading) return <LoadingSpinner />
    if (apiError) return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 leading-relaxed" role="alert">
        <strong className="block font-semibold mb-1">Analysis failed</strong>
        {apiError}
      </div>
    )
    if (result) {
      return (
        <ResultPanel
          result={result}
          changeStatus={changeStatus}
          onAcceptChanges={handleAcceptChanges}
          onRevertChanges={handleRevertChanges}
          onApplyFixAgain={handleApplyFixAgain}
        />
      )
    }
    return <EmptyState />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl" aria-hidden="true">🐞</span>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">BugPilot AI</h1>
              <p className="text-xs text-gray-400">AI-powered debugging assistant</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" aria-hidden="true" />
            AI ready
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left column: Input form ── */}
          <section className="flex-1 min-w-0" aria-label="Debug input">
            <form onSubmit={handleSubmit} noValidate>
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

                {/* Toolbar row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <LanguageSelector value={language} onChange={handleLanguageChange} />
                  <ExamplePicker onSelect={handleExampleSelect} />
                </div>

                {/* Error message */}
                <div>
                  <label htmlFor="error-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Error Message / Stack Trace
                  </label>
                  <ErrorInput value={errorMessage} onChange={setErrorMessage} />
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Code
                    </label>
                    {changeStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                        Fix applied — please accept changes
                      </span>
                    )}
                    {changeStatus === 'accepted' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        ✓ Changes accepted
                      </span>
                    )}
                  </div>

                  {/* Pending Changes Action Banner */}
                  {changeStatus === 'pending' && (
                    <div className="p-3 bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 border border-indigo-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-800 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">✨</span>
                        <div>
                          <p className="font-semibold text-gray-900">AI updated your code with the fix!</p>
                          <p className="text-gray-600">Review the updated code in the editor below and accept or revert changes.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleAcceptChanges}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          <span>✓</span> Accept Changes
                        </button>
                        <button
                          type="button"
                          onClick={handleRevertChanges}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-300 transition-colors cursor-pointer"
                        >
                          ✕ Revert
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Accepted Confirmation Banner */}
                  {changeStatus === 'accepted' && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-600">✓</span>
                        <span>Changes accepted! Your code editor has been updated with the corrected code.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRevertChanges}
                        className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
                      >
                        Revert to original
                      </button>
                    </div>
                  )}

                  {/* Reverted Banner */}
                  {changeStatus === 'reverted' && (
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between gap-2 text-xs text-gray-600">
                      <span>Reverted to original code.</span>
                      <button
                        type="button"
                        onClick={handleApplyFixAgain}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer"
                      >
                        Re-apply AI fix
                      </button>
                    </div>
                  )}

                  <CodeEditor language={language} value={code} onChange={setCode} />
                </div>

                {/* Validation message */}
                {validationMsg && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="alert">
                    {validationMsg}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg
                               hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {loading ? 'Analyzing…' : 'Analyze Bug'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg
                               hover:bg-gray-50 hover:border-gray-400 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* ── Right column: Results ── */}
          <section
            className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-5 min-h-[420px]"
            aria-label="Debugging results"
            aria-live="polite"
          >
            {rightPanelContent()}
          </section>

        </div>
      </main>
    </div>
  )
}
