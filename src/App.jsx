import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('calculator');
  const [calcMode, setCalcMode] = useState('basic'); // 'basic' or 'scientific'
  
  const [input, setInput] = useState('');
  const [angleMode, setAngleMode] = useState('deg'); // 'deg' or 'rad'
  const [isNewInput, setIsNewInput] = useState(true); // 标记是否为新输入
  const [history, setHistory] = useState([]); // 历史记录
  const historyRef = useRef(null); // 历史记录区域的引用
  const displayRef = useRef(null); // 输入框引用
  
  const [conversionType, setConversionType] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  // 安全表达式求值：仅允许预定义的数学函数和运算符
  const safeEvaluate = (expr) => {
    // 预定义的数学函数映射
    const safeFunctions = {
      sin: angleMode === 'deg' ? (x) => Math.sin(Math.PI / 180 * x) : Math.sin,
      cos: angleMode === 'deg' ? (x) => Math.cos(Math.PI / 180 * x) : Math.cos,
      tan: angleMode === 'deg' ? (x) => Math.tan(Math.PI / 180 * x) : Math.tan,
      log: Math.log10,
      ln: Math.log,
      sqrt: Math.sqrt,
      cbrt: Math.cbrt,
      abs: Math.abs,
      factorial: (n) => {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      }
    };

    // 替换显示符号为计算符号
    let expression = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b(?!\^)/g, `(${Math.E})`)  // 仅替换独立 e，不匹配 e^
      .replace(/\^/g, '**');

    // 预处理阶乘：将 n! 或 (...)! 转为 factorial(n)
    expression = expression.replace(/(\d+|\([^()]*\))\s*!/g, (match, num) => {
      return `factorial(${num})`;
    });

    // 安全检查
    const sanitized = expression.replace(/[a-zA-Z]+/g, (token) => {
      // 只允许预定义的函数名
      if (token in safeFunctions) return token;
      // 允许 Math.PI / Math.E（已替换为数字字面量，不会到这里）
      throw new Error(`不允许的标识符: ${token}`);
    });

    // 构建安全执行上下文
    const fn = new Function(...Object.keys(safeFunctions), `"use strict"; return (${sanitized})`);
    return fn(...Object.values(safeFunctions));
  };
  
  const insertAtCursor = (text) => {
    const el = displayRef.current;
    let start, end;
    
    if (el) {
      start = el.selectionStart;
      end = el.selectionEnd;
    } else {
      start = input.length;
      end = input.length;
    }
    
    const newValue = input.substring(0, start) + text + input.substring(end);
    
    setInput(newValue);
    
    // 定位光标到插入位置后面
    setTimeout(() => {
      const targetEl = displayRef.current;
      if (targetEl) {
        const newPos = start + text.length;
        targetEl.focus();
        targetEl.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleClick = (val) => {
    // 清除按钮
    if (val === 'C') {
      setInput('');
      setHistory([]);
      setIsNewInput(true);
      return;
    }
    
    // 退格按钮
    if (val === '⌫') {
      const el = displayRef.current;
      if (!el) {
        setInput(prev => isNewInput ? '' : prev.slice(0, -1));
        setIsNewInput(false);
        return;
      }
      
      const start = el.selectionStart;
      const end = el.selectionEnd;
      
      if (start === end && start > 0) {
        // 光标位置退格
        const newValue = input.substring(0, start - 1) + input.substring(start);
        setInput(newValue);
        setTimeout(() => {
          el.setSelectionRange(start - 1, start - 1);
        }, 0);
      } else if (start !== end) {
        // 选中区域退格
        const newValue = input.substring(0, start) + input.substring(end);
        setInput(newValue);
        setTimeout(() => {
          el.setSelectionRange(start, start);
        }, 0);
      }
      
      setIsNewInput(false);
      return;
    }
    
    // 等于按钮 - 计算结果
    if (val === '=') {
      if (!input.trim()) return;
      try {
        // 自动补全缺失的右括号
        let expr = input;
        let open = (expr.match(/\(/g) || []).length;
        let close = (expr.match(/\)/g) || []).length;
        while (close < open) {
          expr += ')';
          close++;
        }
        
        const result = safeEvaluate(expr);
        const resultStr = Number.isFinite(result) ? String(Number(result.toFixed(10))) : 'Error';
        
        setHistory(prev => [...prev, { expression: input, result: resultStr }].slice(-3));
        setInput(resultStr);
        setIsNewInput(true);
      } catch {
        setInput('Error');
        setIsNewInput(true);
      }
      return;
    }
    
    const operators = ['+', '-', '*', '/', '^'];
    const isOperator = operators.includes(val);
    const funcs = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'π', 'e'];
    
    // 科学函数按钮 - 优先级最高，无论是否 isNewInput 都处理
    if (funcs.includes(val)) {
      const el = displayRef.current;
      let start = input.length; // 默认从末尾开始
      if (el && !isNewInput) {
        start = el.selectionStart;
      }
      
      let textBefore = isNewInput ? '' : input.substring(0, start);
      const lastChar = textBefore.slice(-1);
      
      let prefix = '';
      if (numbers.includes(lastChar) || lastChar === ')' || lastChar === '!') {
        prefix = '*';
      }
      
      let newInput;
      let cursorPos;
      
      if (isNewInput) {
        newInput = prefix + val + '()';
        cursorPos = (prefix + val + '(').length;
      } else {
        const beforePart = textBefore + prefix + val + '(';
        const afterPart = ')' + input.substring(start);
        newInput = beforePart + afterPart;
        cursorPos = beforePart.length;
      }
      
      setInput(newInput);
      
      setTimeout(() => {
        const targetEl = displayRef.current;
        if (targetEl) {
          targetEl.focus();
          targetEl.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
      
      setIsNewInput(false);
      return;
    }
    
    // 刚完成计算的逻辑
    if (isNewInput) {
      if (!isOperator) {
        setInput(val);
        setTimeout(() => {
          const el = displayRef.current;
          if (el) {
            el.focus();
            el.setSelectionRange(val.length, val.length);
          }
        }, 0);
      } else {
        // 运算符的话保持结果并添加运算符
        setInput(prev => prev + val);
        setTimeout(() => {
          const el = displayRef.current;
          if (el) {
            el.focus();
            el.setSelectionRange(prev.length + 1, prev.length + 1);
          }
        }, 0);
      }
      setIsNewInput(false);
      return;
    }
    
    // 特殊按钮映射
    const specialMap = {
      'x²': '^2', 'x³': '^3', 'xʸ': '^',
      'eˣ': 'e^', '10ˣ': '10^',
      'n!': '!'
    };
    
    if (val in specialMap) {
      insertAtCursor(specialMap[val]);
      return;
    }
    
    if (val === '1/x') {
      setInput(prev => '1/(' + prev + ')');
      return;
    }
    
    if (val === '±') {
      const el = displayRef.current;
      const start = el ? el.selectionStart : input.length;
      const end = el ? el.selectionEnd : input.length;
      
      // 尝试在光标前的数字上加±
      let leftPos = start - 1;
      while (leftPos >= 0 && /[\d.πe]/.test(input[leftPos])) {
        leftPos--;
      }
      leftPos++;
      
      if (leftPos < start) {
        const before = input.substring(0, leftPos);
        const num = input.substring(leftPos, start);
        const after = input.substring(start);
        
        if (num.startsWith('-')) {
          const newValue = before + num.substring(1) + after;
          setInput(newValue);
          setTimeout(() => {
            const targetEl = displayRef.current;
            if (targetEl) {
              targetEl.focus();
              targetEl.setSelectionRange(start - 1, start - 1);
            }
          }, 0);
        } else {
          const newValue = before + '-' + num + after;
          setInput(newValue);
          setTimeout(() => {
            const targetEl = displayRef.current;
            if (targetEl) {
              targetEl.focus();
              targetEl.setSelectionRange(start + 1, start + 1);
            }
          }, 0);
        }
        return;
      }
      
      // 没有找到数字，就给整个表达式加
      setInput(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      return;
    }
    
    // 数字/右括号/常量后接左括号，自动补乘号
    if (val === '(') {
      const el = displayRef.current;
      const start = el ? el.selectionStart : input.length;
      const lastChar = input.substring(0, start).slice(-1);
      
      if (numbers.includes(lastChar) || lastChar === ')' || lastChar === '!') {
        insertAtCursor('*(');
      } else {
        insertAtCursor('(');
      }
      return;
    }
    
    // 默认：在光标位置插入输入
    insertAtCursor(val);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '⌫', '+'
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['log', 'ln', 'e', 'eˣ'],
    ['x²', 'x³', 'xʸ', '√'],
    ['(', ')', 'n!', '1/x'],
    ['10ˣ', 'abs', '±', 'C']
  ];

  const conversionTypes = {
    length: {
      name: '长度',
      units: {
        m: { name: '米', rate: 1 },
        km: { name: '千米', rate: 0.001 },
        cm: { name: '厘米', rate: 100 },
        mm: { name: '毫米', rate: 1000 },
        ft: { name: '英尺', rate: 3.28084 },
        in: { name: '英寸', rate: 39.3701 },
        mi: { name: '英里', rate: 0.000621371 }
      }
    },
    weight: {
      name: '重量',
      units: {
        kg: { name: '千克', rate: 1 },
        g: { name: '克', rate: 1000 },
        mg: { name: '毫克', rate: 1000000 },
        lb: { name: '磅', rate: 2.20462 },
        oz: { name: '盎司', rate: 35.274 }
      }
    },
    temperature: {
      name: '温度',
      units: {
        c: { name: '摄氏度' },
        f: { name: '华氏度' },
        k: { name: '开尔文' }
      }
    },
    area: {
      name: '面积',
      units: {
        sqm: { name: '平方米', rate: 1 },
        sqkm: { name: '平方千米', rate: 0.000001 },
        sqft: { name: '平方英尺', rate: 10.7639 },
        acre: { name: '英亩', rate: 0.000247105 },
        hectare: { name: '公顷', rate: 0.0001 }
      }
    }
  };

  // 当历史记录更新时，自动滚动到底部
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const handleConvert = () => {
    if (!value || isNaN(value)) {
      setResult('请输入有效数字');
      return;
    }

    const numValue = parseFloat(value);
    let converted;

    if (conversionType === 'temperature') {
      converted = convertTemperature(numValue, fromUnit, toUnit);
    } else {
      const fromRate = conversionTypes[conversionType].units[fromUnit].rate;
      const toRate = conversionTypes[conversionType].units[toUnit].rate;
      converted = (numValue / fromRate) * toRate;
    }

    setResult(converted.toFixed(4).replace(/\.?0+$/, ''));
  };

  const convertTemperature = (value, from, to) => {
    if (from === to) return value;
    
    let celsius;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5/9;
    else if (from === 'k') celsius = value - 273.15;

    if (to === 'c') return celsius;
    else if (to === 'f') return (celsius * 9/5) + 32;
    else if (to === 'k') return celsius + 273.15;
  };

  const handleTypeChange = (type) => {
    setConversionType(type);
    const units = Object.keys(conversionTypes[type].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setValue('');
    setResult('');
  };

  const basicGrid = (
    <>
      <div className="button-grid">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className={`btn ${['+', '-', '*', '/'].includes(btn) ? 'operator' : ''} ${btn === '⌫' ? 'backspace' : ''}`}
          >
            {btn}
          </button>
        ))}
      </div>
      <button onClick={() => handleClick('=')} className="equal-btn">=</button>
    </>
  );

  return (
    <div className="app-container">
      <div className="calculator-wrapper">
        <div className="mode-switcher">
          <button 
            className={`mode-btn ${mode === 'calculator' ? 'active' : ''}`}
            onClick={() => setMode('calculator')}
          >
            <span className="icon">🧮</span>
            计算器
          </button>
          <button 
            className={`mode-btn ${mode === 'converter' ? 'active' : ''}`}
            onClick={() => setMode('converter')}
          >
            <span className="icon">🔄</span>
            单位转换
          </button>
        </div>

        {mode === 'calculator' ? (
          <div className="calculator-mode">
            <div className="calc-header">
              <h1 className="title">AI 计算器</h1>
              <div className="calc-mode-switcher">
                <button 
                  className={`mode-toggle ${calcMode === 'basic' ? 'active' : ''}`}
                  onClick={() => setCalcMode('basic')}
                >
                  标准
                </button>
                <button 
                  className={`mode-toggle ${calcMode === 'scientific' ? 'active' : ''}`}
                  onClick={() => setCalcMode('scientific')}
                >
                  科学
                </button>
              </div>
            </div>
            
            {calcMode === 'scientific' && (
              <div className="angle-mode">
                <button 
                  className={`angle-btn ${angleMode === 'deg' ? 'active' : ''}`}
                  onClick={() => setAngleMode('deg')}
                >
                  DEG
                </button>
                <button 
                  className={`angle-btn ${angleMode === 'rad' ? 'active' : ''}`}
                  onClick={() => setAngleMode('rad')}
                >
                  RAD
                </button>
              </div>
            )}
            
            {/* 历史记录显示区 */}
            {history.length > 0 && (
              <div className="history-display" ref={historyRef}>
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-expression">{item.expression}</div>
                    <div className="history-result">= {item.result}</div>
                  </div>
                ))}
                <div className="history-divider"></div>
              </div>
            )}
            
            <input 
              ref={displayRef}
              className="display" 
              value={input || '0'}
              onChange={(e) => {
                setInput(e.target.value);
                setIsNewInput(false);
              }}
            />
            
            {calcMode === 'scientific' && (
              <div className="scientific-grid">
                {scientificButtons.map((row, rowIndex) => (
                  <div key={rowIndex} className="sci-row">
                    {row.map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleClick(btn === '√' ? 'sqrt' : btn)}
                        className={`sci-btn 
                          ${['sin', 'cos', 'tan', 'log', 'ln'].includes(btn) ? 'func' : ''}
                          ${['π', 'e'].includes(btn) ? 'constant' : ''}
                          ${['x²', 'x³', 'xʸ', 'eˣ', '10ˣ'].some(x => btn.includes(x)) ? 'power' : ''}
                          ${btn === 'C' ? 'clear' : ''}
                        `}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {basicGrid}
          </div>
        ) : (
          <div className="converter-mode">
            <h1 className="title">单位转换器</h1>
            
            <div className="type-selector">
              {Object.entries(conversionTypes).map(([key, data]) => (
                <button
                  key={key}
                  className={`type-btn ${conversionType === key ? 'active' : ''}`}
                  onClick={() => handleTypeChange(key)}
                >
                  {data.name}
                </button>
              ))}
            </div>

            <div className="converter-box">
              <div className="input-group">
                <label>从</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="输入数值"
                  className="number-input"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="unit-select"
                >
                  {Object.entries(conversionTypes[conversionType].units).map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>

              <div className="convert-arrow">↓</div>

              <div className="input-group">
                <label>到</label>
                <div className="result-display">{result || '---'}</div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="unit-select"
                >
                  {Object.entries(conversionTypes[conversionType].units).map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleConvert} className="convert-btn">
                转换
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;