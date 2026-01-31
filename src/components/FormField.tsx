import type { ChangeEvent } from 'react'

type FormFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number'
  placeholder?: string
  helper?: string
  error?: string
  step?: string
  min?: string
  unit?: string
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  helper,
  error,
  step,
  min,
  unit,
}: FormFieldProps) => {
  const helperId = helper ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="field-control">
        <input
          id={id}
          name={id}
          type={type}
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {unit && <span className="field-unit">{unit}</span>}
      </div>
      {helper && (
        <p id={helperId} className="field-helper">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="status" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
