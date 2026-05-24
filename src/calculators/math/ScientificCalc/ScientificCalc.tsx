import { useState, useCallback, useEffect } from 'react'
import { SEOHead } from '@/components/SEOHead'
import { AdBanner } from '@/components/AdUnit'
import s from './ScientificCalc.module.css'

type AngleMode = 'DEG' | 'RAD'
type DisplayMode = 'normal' | 'error'

function toRad(val: number, mode: AngleMode) {
  return mode === 'DEG' ? (val * Math.PI) / 180 : val
}

function fmt(n: number): string {
  if (!isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity'
  if (isNaN(n)) return 'Error'
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) {
    return n.toExponential(8).replace(/\.?0+e/, 'e')
  }
  const s = parseFloat(n.toPrecision(12)).toString()
  return s
}

const HISTORY_MAX = 10

export default function ScientificCalcPage() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [isError, setIsError] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [shiftMode, setShiftMode] = useState(false)

  const pushHistory = (entry: string) => {
    setHistory(h => [entry, ...h].slice(0, HISTORY_MAX))
  }

  const handleDigit = useCallback((digit: string) => {
    if (isError) { setDisplay('0'); setExpression(''); setIsError(false) }
    setDisplay(prev => {
      if (waitingForOperand) { setWaitingForOperand(false); return digit }
      if (prev === '0' && digit !== '.') return digit
      if (digit === '.' && prev.includes('.')) return prev
      return prev + digit
    })
  }, [waitingForOperand, isError])

  const handleOperator = useCallback((op: string) => {
    if (isError) return
    const val = parseFloat(display)
    setExpression(`${fmt(val)} ${op}`)
    setWaitingForOperand(true)
  }, [display, isError])

  const handleEquals = useCallback(() => {
    if (isError || !expression) return
    const parts = expression.trim().split(' ')
    const left = parseFloat(parts[0])
    const op = parts[1]
    const right = parseFloat(display)
    let result = 0
    switch (op) {
      case '+': result = left + right; break
      case '−': result = left - right; break
      case '×': result = left * right; break
      case '÷': result = right === 0 ? NaN : left / right; break
      case 'xʸ': result = Math.pow(left, right); break
      case 'ʸ√x': result = Math.pow(left, 1 / right); break
      case 'EE': result = left * Math.pow(10, right); break
      default: result = right
    }
    if (!isFinite(result) || isNaN(result)) {
      setDisplay('Error'); setIsError(true); setExpression(''); return
    }
    const entry = `${expression} ${fmt(right)} = ${fmt(result)}`
    pushHistory(entry)
    setDisplay(fmt(result))
    setExpression('')
    setWaitingForOperand(true)
  }, [display, expression, isError])

  const handleFunction = useCallback((fn: string) => {
    if (isError) return
    const x = parseFloat(display)
    let result = 0
    try {
      switch (fn) {
        case 'sin': result = Math.sin(toRad(x, angleMode)); break
        case 'cos': result = Math.cos(toRad(x, angleMode)); break
        case 'tan': result = Math.tan(toRad(x, angleMode)); break
        case 'asin': result = angleMode === 'DEG' ? Math.asin(x) * 180 / Math.PI : Math.asin(x); break
        case 'acos': result = angleMode === 'DEG' ? Math.acos(x) * 180 / Math.PI : Math.acos(x); break
        case 'atan': result = angleMode === 'DEG' ? Math.atan(x) * 180 / Math.PI : Math.atan(x); break
        case 'log': result = Math.log10(x); break
        case 'ln': result = Math.log(x); break
        case '10^x': result = Math.pow(10, x); break
        case 'e^x': result = Math.exp(x); break
        case '√': result = Math.sqrt(x); break
        case 'x²': result = x * x; break
        case 'x³': result = x * x * x; break
        case '1/x': result = 1 / x; break
        case 'x!': {
          if (x < 0 || !Number.isInteger(x) || x > 170) { result = NaN; break }
          result = 1; for (let i = 2; i <= x; i++) result *= i; break
        }
        case '|x|': result = Math.abs(x); break
        case 'π': setDisplay(fmt(Math.PI)); setWaitingForOperand(false); return
        case 'e': setDisplay(fmt(Math.E)); setWaitingForOperand(false); return
        case 'rand': setDisplay(fmt(Math.random())); setWaitingForOperand(false); return
        case '+/-': setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev); return
        case '%': result = x / 100; break
        case 'EXP': setExpression(`${display} EE`); setWaitingForOperand(true); return
        default: return
      }
      if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error'); setIsError(true); return
      }
      pushHistory(`${fn}(${fmt(x)}) = ${fmt(result)}`)
      setDisplay(fmt(result))
      setWaitingForOperand(true)
    } catch {
      setDisplay('Error'); setIsError(true)
    }
  }, [display, angleMode, isError])

  const handleClear = useCallback((full: boolean) => {
    setDisplay('0'); setIsError(false)
    if (full) { setExpression(''); setWaitingForOperand(false) }
  }, [])

  const handleBackspace = useCallback(() => {
    if (isError || waitingForOperand) { setDisplay('0'); setIsError(false); return }
    setDisplay(prev => prev.length <= 1 ? '0' : prev.slice(0, -1))
  }, [isError, waitingForOperand])

  const handleMemory = useCallback((action: string) => {
    const val = parseFloat(display)
    switch (action) {
      case 'MC': setMemory(0); break
      case 'MR': setDisplay(fmt(memory)); setWaitingForOperand(false); break
      case 'M+': setMemory(m => m + val); break
      case 'M-': setMemory(m => m - val); break
      case 'MS': setMemory(val); break
    }
  }, [display, memory])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ('0123456789'.includes(e.key)) handleDigit(e.key)
      else if (e.key === '.') handleDigit('.')
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('−')
      else if (e.key === '*') handleOperator('×')
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷') }
      else if (e.key === 'Enter' || e.key === '=') handleEquals()
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === 'Escape') handleClear(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleClear])

  type BtnDef = { label: string; action: () => void; cls?: string }

  const row1: BtnDef[] = [
    { label: shiftMode ? 'sin⁻¹' : 'sin', action: () => handleFunction(shiftMode ? 'asin' : 'sin') },
    { label: shiftMode ? 'cos⁻¹' : 'cos', action: () => handleFunction(shiftMode ? 'acos' : 'cos') },
    { label: shiftMode ? 'tan⁻¹' : 'tan', action: () => handleFunction(shiftMode ? 'atan' : 'tan') },
    { label: shiftMode ? 'e^x' : 'ln', action: () => handleFunction(shiftMode ? 'e^x' : 'ln') },
    { label: shiftMode ? '10^x' : 'log', action: () => handleFunction(shiftMode ? '10^x' : 'log') },
  ]
  const row2: BtnDef[] = [
    { label: 'xʸ', action: () => handleOperator('xʸ') },
    { label: shiftMode ? 'ʸ√x' : '√', action: () => shiftMode ? handleOperator('ʸ√x') : handleFunction('√') },
    { label: shiftMode ? 'x³' : 'x²', action: () => handleFunction(shiftMode ? 'x³' : 'x²') },
    { label: shiftMode ? 'EXP' : '1/x', action: () => shiftMode ? handleFunction('EXP') : handleFunction('1/x') },
    { label: shiftMode ? 'rand' : 'x!', action: () => handleFunction(shiftMode ? 'rand' : 'x!') },
  ]
  const row3: BtnDef[] = [
    { label: memory !== 0 ? 'MR*' : 'MR', action: () => handleMemory('MR'), cls: memory !== 0 ? s.memActive : '' },
    { label: 'M+', action: () => handleMemory('M+') },
    { label: 'M-', action: () => handleMemory('M-') },
    { label: 'MS', action: () => handleMemory('MS') },
    { label: 'MC', action: () => handleMemory('MC') },
  ]

  return (
    <>
      <SEOHead
        title="Scientific Calculator – Online Calculator with Trig, Log & More"
        description="Free scientific calculator online. Calculate trig functions, logarithms, powers, factorials, and more. Supports degrees and radians with history."
        canonical="/math/scientific-calculator"
      />
      <div className={s.page}>
        <div className={`container ${s.wrap}`}>

          <div className={s.hero}>
            <p className={s.crumb}>Math › Calculator</p>
            <h1 className={s.h1}>Scientific Calculator</h1>
            <p className={s.sub}>Full scientific calculator with trig, logarithms, memory, and calculation history.</p>
          </div>

          <AdBanner slot="28000000001" />

          <div className={s.calcContainer}>
            {/* Display */}
            <div className={s.displayArea}>
              <div className={s.expressionLine}>{expression || '\u00a0'}</div>
              <div className={`${s.mainDisplay} ${isError ? s.displayError : ''}`}>
                {display}
              </div>
              <div className={s.statusRow}>
                <button className={`${s.modeBtn} ${angleMode === 'DEG' ? s.modeActive : ''}`}
                  onClick={() => setAngleMode('DEG')}>DEG</button>
                <button className={`${s.modeBtn} ${angleMode === 'RAD' ? s.modeActive : ''}`}
                  onClick={() => setAngleMode('RAD')}>RAD</button>
                <button className={`${s.modeBtn} ${shiftMode ? s.modeActive : ''}`}
                  onClick={() => setShiftMode(v => !v)}>2nd</button>
                <button className={`${s.modeBtn} ${showHistory ? s.modeActive : ''}`}
                  onClick={() => setShowHistory(v => !v)}>History</button>
              </div>
            </div>

            {showHistory && (
              <div className={s.historyPanel}>
                {history.length === 0
                  ? <p className={s.historyEmpty}>No calculations yet</p>
                  : history.map((h, i) => <div key={i} className={s.historyItem}>{h}</div>)
                }
              </div>
            )}

            {/* Scientific rows */}
            <div className={s.sciRows}>
              {[row1, row2, row3].map((row, ri) => (
                <div key={ri} className={s.btnRow}>
                  {row.map(btn => (
                    <button key={btn.label} className={`${s.btn} ${s.btnSci} ${btn.cls ?? ''}`}
                      onClick={btn.action}>{btn.label}</button>
                  ))}
                </div>
              ))}
            </div>

            {/* Main keypad */}
            <div className={s.mainKeypad}>
              {/* Row: special */}
              <div className={s.btnRow}>
                <button className={`${s.btn} ${s.btnSpecial}`} onClick={() => handleFunction('|x|')}>|x|</button>
                <button className={`${s.btn} ${s.btnSpecial}`} onClick={() => handleFunction('π')}>π</button>
                <button className={`${s.btn} ${s.btnSpecial}`} onClick={() => handleFunction('e')}>e</button>
                <button className={`${s.btn} ${s.btnClear}`} onClick={() => handleClear(false)}>C</button>
                <button className={`${s.btn} ${s.btnClear}`} onClick={() => handleClear(true)}>AC</button>
              </div>
              {/* Row 1 */}
              <div className={s.btnRow}>
                <button className={`${s.btn} ${s.btnSpecial}`} onClick={() => handleFunction('+/-')}>+/-</button>
                <button className={`${s.btn} ${s.btnSpecial}`} onClick={() => handleFunction('%')}>%</button>
                <button className={`${s.btn} ${s.btnBack}`} onClick={handleBackspace}>⌫</button>
                <button className={`${s.btn} ${s.btnOp}`} onClick={() => handleOperator('÷')}>÷</button>
              </div>
              {/* Digit rows */}
              {[['7','8','9'], ['4','5','6'], ['1','2','3']].map((digits, ri) => (
                <div key={ri} className={s.btnRow}>
                  {digits.map(d => (
                    <button key={d} className={`${s.btn} ${s.btnDigit}`} onClick={() => handleDigit(d)}>{d}</button>
                  ))}
                  <button className={`${s.btn} ${s.btnOp}`}
                    onClick={() => handleOperator(ri === 0 ? '×' : ri === 1 ? '−' : '+')}>
                    {ri === 0 ? '×' : ri === 1 ? '−' : '+'}
                  </button>
                </div>
              ))}
              {/* Last row */}
              <div className={s.btnRow}>
                <button className={`${s.btn} ${s.btnDigit} ${s.btnZero}`} onClick={() => handleDigit('0')}>0</button>
                <button className={`${s.btn} ${s.btnDigit}`} onClick={() => handleDigit('.')}>.</button>
                <button className={`${s.btn} ${s.btnEquals}`} onClick={handleEquals}>=</button>
              </div>
            </div>
          </div>

          <article className={s.article}>
            <h2>How to Use the Scientific Calculator</h2>
            <p>This calculator supports all standard scientific operations. Use the keypad or your keyboard (numbers, +, -, *, /, Enter, Backspace, Escape). Press <strong>2nd</strong> to access inverse trig functions (sin⁻¹, cos⁻¹, tan⁻¹), cube root, and more. Toggle between <strong>DEG</strong> and <strong>RAD</strong> for angle calculations.</p>
            <h2>Memory Functions</h2>
            <p>MS stores the displayed value, MR recalls it, M+ and M- add or subtract from memory, MC clears memory. A * next to MR indicates a stored value.</p>
          </article>

          <AdBanner slot="28000000002" />
        </div>
      </div>
    </>
  )
}