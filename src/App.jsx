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
  
  const [conversionType, setConversionType] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (val) => {
    // 清除按钮
    if (val === 'C') {
      setInput('');
      setHistory([]); // 清空历史记录
      setIsNewInput(true);
      return;
    }
    
    // 退格按钮
    if (val === '⌫') {
      if (isNewInput) {
        setInput('');
        setIsNewInput(false);
      } else {
        setInput(prev => prev.slice(0, -1));
      }
      return;
    }
    
    // 等于按钮 - 计算结果
    if (val === '=') {
      try {
        let expression = input
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/sin\(/g, angleMode === 'deg' ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
          .replace(/cos\(/g, angleMode === 'deg' ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
          .replace(/tan\(/g, angleMode === 'deg' ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/cbrt\(/g, 'Math.cbrt(')
          .replace(/abs\(/g, 'Math.abs(')
          .replace(/(\d+)!/g, 'factorial($1)');
        
        // 处理幂运算
        expression = expression.replace(/\^/g, '**');
        
        const result = Function('return ' + expression)();
        const resultStr = String(Number(result.toFixed(10)));
        
        // 添加到历史记录
        setHistory(prev => {
          const newHistory = [...prev, { expression: input, result: resultStr }];
          // 只保留最近3条记录
          return newHistory.slice(-3);
        });
        
        setInput(resultStr);
        setIsNewInput(true); // 标记为刚完成计算，下次输入数字时清空
      } catch {
        setInput('Error');
        setIsNewInput(true);
      }
      return;
    }
    
    // 定义运算符列表
    const operators = ['+', '-', '*', '/', '^'];
    const isOperator = operators.includes(val);
    
    // 如果刚完成计算且输入的是数字，则清空屏幕
    if (isNewInput && !isOperator) {
      setInput(val);
      setIsNewInput(false);
      return;
    }
    
    // 如果刚完成计算且输入的是运算符，则继续使用当前结果
    if (isNewInput && isOperator) {
      setIsNewInput(false);
      setInput(prev => prev + val);
      return;
    }
    
    // 处理科学函数按钮
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'].includes(val)) {
      if (isNewInput) {
        setInput(val + '(');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + val + '(');
      }
      return;
    }
    
    // 处理特殊按钮
    if (val === 'x²') {
      if (isNewInput) {
        setInput('^2');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + '^2');
      }
      return;
    }
    
    if (val === 'x³') {
      if (isNewInput) {
        setInput('^3');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + '^3');
      }
      return;
    }
    
    if (val === 'xʸ') {
      if (isNewInput) {
        setInput('^');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + '^');
      }
      return;
    }
    
    if (val === 'eˣ') {
      if (isNewInput) {
        setInput('e^');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + 'e^');
      }
      return;
    }
    
    if (val === '10ˣ') {
      if (isNewInput) {
        setInput('10^');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + '10^');
      }
      return;
    }
    
    if (val === '1/x') {
      if (isNewInput) {
        setInput('1/(' + input + ')');
        setIsNewInput(false);
      } else {
        setInput(prev => '1/(' + prev + ')');
      }
      return;
    }
    
    if (val === '±') {
      if (isNewInput) {
        setInput(prev => {
          if (prev.startsWith('-')) return prev.slice(1);
          return '-' + prev;
        });
      } else {
        setInput(prev => {
          if (prev.startsWith('-')) return prev.slice(1);
          return '-' + prev;
        });
      }
      return;
    }
    
    if (val === 'n!') {
      if (isNewInput) {
        setInput(input + '!');
        setIsNewInput(false);
      } else {
        setInput(prev => prev + '!');
      }
      return;
    }
    
    // 默认情况：直接追加
    if (isNewInput) {
      setInput(val);
      setIsNewInput(false);
    } else {
      setInput(prev => prev + val);
    }
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

  // 阶乘函数
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

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
            
            <div className="display">{input || '0'}</div>
            
            {calcMode === 'scientific' ? (
              <>
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
            ) : (
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
            )}
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