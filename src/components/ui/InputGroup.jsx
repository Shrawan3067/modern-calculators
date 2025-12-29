import { useState } from 'react'

export default function InputGroup({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step,
  unit,
  options
}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e) => {
    onChange(name, e.target.value)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-surface border ${error ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'currency':
      case 'percentage':
      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step || (type === 'percentage' ? '0.1' : '1')}
              className={`w-full px-4 py-3 pr-10 bg-surface border ${error ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {unit && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60">
                {unit}
              </span>
            )}
          </div>
        )
      
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-surface border ${error ? 'border-error' : 'border-border'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-text/80">
        {label}
        {error && <span className="text-error ml-2">• {error}</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  )
}