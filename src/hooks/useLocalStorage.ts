import { useEffect, useState } from 'react'

type Setter<T> = (value: T | ((prev: T) => T)) => void

const isBrowser = typeof window !== 'undefined'

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, Setter<T>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (!isBrowser) return
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Ignore write errors in restricted contexts.
    }
  }, [key, storedValue])

  const setValue: Setter<T> = (value) => {
    setStoredValue((prev) => (typeof value === 'function' ? (value as (prev: T) => T)(prev) : value))
  }

  return [storedValue, setValue]
}
