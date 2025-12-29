import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calculator, TrendingUp, Heart, Calendar, 
  Scale, DollarSign, Clock, Thermometer,
  Plus, Minus, Divide, Percent,
  X as XIcon,
  Delete, Equal, Pi,
  Sun, Moon, Calculator as CalcIcon
} from 'lucide-react'

export default function Home() {
  const [calculatorType, setCalculatorType] = useState('basic')
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState('')
  const [operation, setOperation] = useState('')
  const [scientificMode, setScientificMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [calcHasFocus, setCalcHasFocus] = useState(false);
  const calculatorRef = useRef(null);

  // Add all calculators data for search
  const allCalculators = [
    { name: 'Mortgage Calculator', category: 'Financial', path: '/calculators/mortgage', description: 'Calculate monthly payments and amortization schedule' },
    { name: 'BMI Calculator', category: 'Health & Fitness', path: '/calculators/bmi', description: 'Calculate your Body Mass Index' },
    { name: 'Investment Calculator', category: 'Financial', path: '/calculators/investment', description: 'Calculate compound interest and ROI' },
    { name: 'Unit Converters', category: 'Unit Converters', path: '/calculators/converters', description: 'Convert length, weight, temperature, and more' },
    { name: 'Loan Calculator', category: 'Financial', path: '/calculators/loan', description: 'Calculate loan payments and interest' },
    { name: 'Retirement Calculator', category: 'Financial', path: '/calculators/retirement', description: 'Plan for retirement savings' },
    { name: 'Currency Converter', category: 'Unit Converters', path: '/calculators/currency', description: 'Convert between different currencies' },
    { name: 'Tax Calculator', category: 'Financial', path: '/calculators/tax', description: 'Calculate income tax and deductions' },
    { name: 'Calorie Calculator', category: 'Health & Fitness', path: '/calculators/calorie', description: 'Calculate daily calorie needs' },
    { name: 'Age Calculator', category: 'Date & Time', path: '/calculators/age', description: 'Calculate age from birth date' },
    { name: 'Scientific Calculator', category: 'Math', path: '/calculators/scientific', description: 'Advanced mathematical calculations' },
    { name: 'Percentage Calculator', category: 'Math', path: '/calculators/percentage', description: 'Calculate percentages' },
    { name: 'Tip Calculator', category: 'Financial', path: '/calculators/tip', description: 'Calculate restaurant tips' },
    { name: 'Fuel Calculator', category: 'Unit Converters', path: '/calculators/fuel', description: 'Calculate fuel economy and cost' },
    { name: 'Password Generator', category: 'Tools', path: '/calculators/password', description: 'Generate secure passwords' },
    { name: 'BMI Calculator', category: 'Health & Fitness', path: '/calculators/bmi', description: 'Body Mass Index calculator' },
    { name: 'Pregnancy Calculator', category: 'Health & Fitness', path: '/calculators/pregnancy', description: 'Calculate due dates' },
    { name: 'Time Calculator', category: 'Date & Time', path: '/calculators/time', description: 'Add, subtract time intervals' },
    { name: 'Date Calculator', category: 'Date & Time', path: '/calculators/date', description: 'Calculate days between dates' },
  ];

  const featuredCalculators = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payments and amortization schedule',
      path: '/calculators/mortgage',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index',
      path: '/calculators/bmi',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Investment Calculator',
      description: 'Calculate compound interest and ROI',
      path: '/calculators/investment',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    },
    {
      icon: <Thermometer className="h-8 w-8" />,
      title: 'Unit Converters',
      description: 'Convert length, weight, temperature, and more',
      path: '/calculators/converters',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    }
  ]

  const categories = [
    {
      name: 'Financial',
      count: 8,
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      name: 'Health & Fitness',
      count: 4,
      icon: <Heart className="h-6 w-6" />
    },
    {
      name: 'Math',
      count: 5,
      icon: <Calculator className="h-6 w-6" />
    },
    {
      name: 'Date & Time',
      count: 3,
      icon: <Calendar className="h-6 w-6" />
    },
    {
      name: 'Unit Converters',
      count: 5,
      icon: <Scale className="h-6 w-6" />
    }
  ]

  // Basic Calculator Functions
  const handleNumberClick = (num) => {
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(num)
    } else {
      setCalcDisplay(calcDisplay + num)
    }
  }

  const handleOperationClick = (op) => {
    if (operation && previousValue) {
      calculateResult()
    }
    setPreviousValue(calcDisplay)
    setOperation(op)
    setCalcDisplay('0')
  }

  const calculateResult = () => {
    if (!operation || !previousValue) return

    const prev = parseFloat(previousValue)
    const current = parseFloat(calcDisplay)
    let result

    switch (operation) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '×':
        result = prev * current
        break
      case '÷':
        result = prev / current
        break
      case '%':
        result = (prev * current) / 100
        break
      default:
        return
    }

    setCalcDisplay(result.toString())
    setPreviousValue('')
    setOperation('')
  }

  const handleClear = () => {
    setCalcDisplay('0')
    setPreviousValue('')
    setOperation('')
  }

  const handleDelete = () => {
    if (calcDisplay.length === 1 || calcDisplay === 'Error') {
      setCalcDisplay('0')
    } else {
      setCalcDisplay(calcDisplay.slice(0, -1))
    }
  }

  const handleDecimal = () => {
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.')
    }
  }

  // Scientific Calculator Functions
  const handleScientificOperation = (op) => {
    const current = parseFloat(calcDisplay)
    let result

    switch (op) {
      case 'sqrt':
        result = Math.sqrt(current)
        break
      case 'square':
        result = current * current
        break
      case 'cube':
        result = current * current * current
        break
      case 'sin':
        result = Math.sin(current * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(current * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(current * Math.PI / 180)
        break
      case 'log':
        result = Math.log10(current)
        break
      case 'ln':
        result = Math.log(current)
        break
      case 'pi':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      default:
        return
    }

    setCalcDisplay(result.toFixed(8).replace(/\.?0+$/, ''))
  }

  const basicButtons = [
    ['7', '8', '9', '+', 'DEL'],
    ['4', '5', '6', '-', 'C'],
    ['1', '2', '3', '×', '%' ],
    ['0', '.', '÷', '='],
  ]

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log'],
    ['sqrt', 'square', 'cube', 'ln'],
    ['π', 'e', 'x²', 'x³'],
    ['(', ')', '^', '!']
  ]

  // Focus management functions
  const handleCalculatorClick = () => {
    setCalcHasFocus(true);
  };

  const handleOutsideClick = (e) => {
    if (calculatorRef.current && !calculatorRef.current.contains(e.target)) {
      setCalcHasFocus(false);
    }
  };

  // Search functions
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const filtered = allCalculators.filter(calc => 
      calc.name.toLowerCase().includes(term.toLowerCase()) ||
      calc.description.toLowerCase().includes(term.toLowerCase()) ||
      calc.category.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      if (searchResults.length > 0) {
        window.location.href = searchResults[0].path;
      }
    }
  };

  // UseEffects
  useEffect(() => {
    const handleSearchClickOutside = (event) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleSearchClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSearchClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle calculator keys if calculator doesn't have focus
      if (!calcHasFocus) return;

      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isInputElement = 
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable;
      
      if (isInputElement) return;

      // Prevent default behavior for calculator keys
      if (
        /^[0-9]$/.test(e.key) ||
        e.key === '.' ||
        e.key === '+' ||
        e.key === '-' ||
        e.key === '*' ||
        e.key === '/' ||
        e.key === '%' ||
        e.key === 'Enter' ||
        e.key === 'Escape' ||
        e.key === 'Backspace' ||
        e.key === 'Delete'
      ) {
        e.preventDefault();
      }

      // Handle number keys (0-9)
      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(e.key);
      }
      
      // Handle decimal point
      else if (e.key === '.') {
        handleDecimal();
      }
      
      // Handle arithmetic operations
      else if (e.key === '+') {
        handleOperationClick('+');
      }
      else if (e.key === '-') {
        handleOperationClick('-');
      }
      else if (e.key === '*' || e.key === 'x') {
        handleOperationClick('×');
      }
      else if (e.key === '/') {
        handleOperationClick('÷');
      }
      else if (e.key === '%') {
        handleOperationClick('%');
      }
      
      // Handle Enter for equals
      else if (e.key === 'Enter' || e.key === '=') {
        calculateResult();
      }
      
      // Handle Clear (Escape)
      else if (e.key === 'Escape') {
        handleClear();
      }
      
      // Handle Backspace for delete
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      }
      
      // Handle scientific calculator shortcuts
      else if (calculatorType === 'scientific' && calcHasFocus) {
        switch (e.key.toLowerCase()) {
          case 's':
            handleScientificOperation('sin');
            break;
          case 'c':
            handleScientificOperation('cos');
            break;
          case 't':
            handleScientificOperation('tan');
            break;
          case 'l':
            if (e.shiftKey) handleScientificOperation('log');
            else handleScientificOperation('ln');
            break;
          case 'q':
            handleScientificOperation('sqrt');
            break;
          case 'p':
            handleScientificOperation('pi');
            break;
          case 'e':
            if (!e.shiftKey) handleScientificOperation('e');
            break;
          case '2':
            if (e.shiftKey) handleScientificOperation('square');
            break;
          case '3':
            if (e.shiftKey) handleScientificOperation('cube');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [calcDisplay, previousValue, operation, calculatorType, calcHasFocus]);

  const renderCalculator = () => {
    return (
      <div 
        ref={calculatorRef}
        className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${
          calcHasFocus ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {/* Calculator Header */}
        <div 
          className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
          onClick={handleCalculatorClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalcIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {calculatorType === 'basic' ? 'Basic Calculator' : 'Scientific Calculator'}
              </span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                  setCalculatorType('basic');
                }}
                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                  calculatorType === 'basic'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Basic
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                  setCalculatorType('scientific');
                }}
                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                  calculatorType === 'scientific'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Scientific
              </button>
            </div>
          </div>
        </div>

        {/* Calculator Display */}
        <div 
          className="p-6 bg-gradient-to-b from-gray-900 to-gray-800"
          onClick={handleCalculatorClick}
        >
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1 h-5">
              {previousValue} {operation}
            </div>
            <div className="text-4xl font-bold text-white overflow-hidden">
              {calcDisplay.length > 12 ? (
                <span className="text-3xl">{calcDisplay.slice(0, 12)}...</span>
              ) : (
                calcDisplay
              )}
            </div>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div 
          className="p-4"
          onClick={handleCalculatorClick}
        >
          {calculatorType === 'scientific' && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {scientificButtons.flat().map((btn) => (
                <button
                  key={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCalculatorClick();
                    handleScientificOperation(btn.toLowerCase());
                  }}
                  className="py-3 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  {btn}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {basicButtons.flat().map((btn) => {
              const isNumber = !isNaN(btn) || btn === '.';
              const isOperation = ['+', '-', '×', '÷', '%', '='].includes(btn);
              const isSpecial = ['C', 'DEL'].includes(btn);

              let buttonClass = "py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all duration-150 shadow-md ";
              
              if (isNumber) {
                buttonClass += "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 ";
              } else if (isOperation) {
                buttonClass += "bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-blue-600 ";
              } else if (isSpecial) {
                buttonClass += "bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-600 ";
              } else {
                buttonClass += "bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 ";
              }

              if (btn === '0') {
                return (
                  <button
                    key={btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCalculatorClick();
                      handleNumberClick('0');
                    }}
                    className="col-span-2 h-14 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:opacity-90 active:scale-95 transition-all duration-150 shadow-md"
                  >
                    0
                  </button>
                );
              }

              return (
                <button
                  key={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCalculatorClick();
                    if (btn === 'C') handleClear();
                    else if (btn === 'DEL') handleDelete();
                    else if (btn === '=') calculateResult();
                    else if (btn === '.') handleDecimal();
                    else if (isOperation) handleOperationClick(btn);
                    else if (isNumber) handleNumberClick(btn);
                  }}
                  className={buttonClass}
                >
                  {btn === '×' ? <XIcon className="h-5 w-5 inline" /> :
                   btn === '÷' ? <Divide className="h-5 w-5 inline" /> :
                   btn === '+' ? <Plus className="h-5 w-5 inline" /> :
                   btn === '-' ? <Minus className="h-5 w-5 inline" /> :
                   btn === '=' ? <Equal className="h-5 w-5 inline" /> :
                   btn === 'DEL' ? <Delete className="h-5 w-5 inline" /> :
                   btn === '%' ? <Percent className="h-5 w-5 inline" /> :
                   btn}
                </button>
              );
            })}
          </div>

          {/* Memory Functions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                MC
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                MR
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                M+
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCalculatorClick();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                M-
              </button>
            </div>
          </div>

          {/* Keyboard Status */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {calcHasFocus 
                ? "✓ Keyboard active - Click outside calculator to deactivate" 
                : "Click calculator to activate keyboard input"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="text-center py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Calculator Platform
            </h1>
            <p className="text-xl text-text/70 max-w-3xl mx-auto mb-8">
              Free, fast, and accurate calculators for finance, health, math, and conversions.
              Everything you need in one modern platform.
            </p>
           
            <div className="relative max-w-xl mx-auto search-container">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search for calculators..."
                  className="w-full p-4 pl-12 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Calculator className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {/* Clear button when there's text */}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow-2xl max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Found {searchResults.length} calculator{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    
                    {searchResults.map((calc, index) => (
                      <Link
                        key={index}
                        to={calc.path}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Calculator className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {calc.name}
                            </h4>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {calc.category}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No Results Message */}
              {showResults && searchResults.length === 0 && searchTerm.trim() !== '' && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow-2xl p-6">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                      No calculators found
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try searching with different keywords
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Calculator Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {renderCalculator()}
            
            {/* Quick Tip */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <CalcIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Quick Tip</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click the calculator to activate keyboard input. Use number keys, + - * /, Enter (=), Esc (Clear), and Backspace for calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Calculators */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Featured Calculators</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Popular Tools</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCalculators.map((calc) => (
            <Link
              key={calc.title}
              to={calc.path}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/10 dark:via-blue-900/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div className={`inline-flex p-3 rounded-xl mb-4 relative z-10 ${calc.color}`}>
                {calc.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 relative z-10">
                {calc.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                {calc.description}
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Browse by Category</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {categories.reduce((acc, cat) => acc + cat.count, 0)} calculators
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50 transition-all duration-300">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {category.count}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}