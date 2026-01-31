export type FAQItem = {
  question: string
  answer: string
}

type FAQProps = {
  items: FAQItem[]
}

export const FAQ = ({ items }: FAQProps) => {
  if (!items.length) return null
  return (
    <section className="section faq" aria-label="Frequently asked questions">
      <h2>FAQ</h2>
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  )
}
