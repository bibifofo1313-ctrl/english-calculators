import type { ReactNode } from 'react'

type ResultItem = {
  label: string
  value: string
}

type ResultPanelProps = {
  title: string
  items: ResultItem[]
  children?: ReactNode
}

export const ResultPanel = ({ title, items, children }: ResultPanelProps) => {
  return (
    <section className="results-panel" aria-live="polite">
      <h2>{title}</h2>
      <div>
        {items.map((item) => (
          <div key={item.label} className="result-item">
            <span>{item.label}</span>
            <div className="result-value">{item.value}</div>
          </div>
        ))}
      </div>
      {children}
    </section>
  )
}
