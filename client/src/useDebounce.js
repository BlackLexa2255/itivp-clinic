import { useEffect, useState } from 'react'

// Значение обновляется только тогда, когда оно не менялось delay миллисекунд.
// Каждое новое нажатие клавиши отменяет предыдущий таймер
export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
