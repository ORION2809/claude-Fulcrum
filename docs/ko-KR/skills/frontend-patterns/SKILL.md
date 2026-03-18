---
name: frontend-patterns
description: React, Next.js, Ã¬Æ’ÂÃ­Æ’Å“ ÃªÂ´â‚¬Ã«Â¦Â¬, Ã¬â€žÂ±Ã«Å Â¥ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€ Ã«Â°Â UI Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã­â€â€žÃ«Â¡Â Ã­Å Â¸Ã¬â€”â€Ã«â€œÅ“ ÃªÂ°Å“Ã«Â°Å“ Ã­Å’Â¨Ã­â€žÂ´.
origin: claude-fulcrum
---

# Ã­â€â€žÃ«Â¡Â Ã­Å Â¸Ã¬â€”â€Ã«â€œÅ“ ÃªÂ°Å“Ã«Â°Å“ Ã­Å’Â¨Ã­â€žÂ´

React, Next.js Ã«Â°Â ÃªÂ³Â Ã¬â€žÂ±Ã«Å Â¥ Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã«ÂªÂ¨Ã«ÂËœ Ã­â€â€žÃ«Â¡Â Ã­Å Â¸Ã¬â€”â€Ã«â€œÅ“ Ã­Å’Â¨Ã­â€žÂ´.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- React Ã¬Â»Â´Ã­ÂÂ¬Ã«â€žÅ’Ã­Å Â¸Ã«Â¥Â¼ ÃªÂµÂ¬Ã¬Â¶â€¢Ã­â€¢Â  Ã«â€¢Å’ (Ã­â€¢Â©Ã¬â€žÂ±, props, Ã«Â Å’Ã«Ââ€Ã«Â§Â)
- Ã¬Æ’ÂÃ­Æ’Å“Ã«Â¥Â¼ ÃªÂ´â‚¬Ã«Â¦Â¬Ã­â€¢Â  Ã«â€¢Å’ (useState, useReducer, Zustand, Context)
- Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã­Å½ËœÃ¬Â¹Â­Ã¬Ââ€ž ÃªÂµÂ¬Ã­Ëœâ€žÃ­â€¢Â  Ã«â€¢Å’ (SWR, React Query, server components)
- Ã¬â€žÂ±Ã«Å Â¥Ã¬Ââ€ž Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€Ã­â€¢Â  Ã«â€¢Å’ (Ã«Â©â€Ã«ÂªÂ¨Ã¬ÂÂ´Ã¬Â Å“Ã¬ÂÂ´Ã¬â€¦Ëœ, ÃªÂ°â‚¬Ã¬Æ’ÂÃ­â„¢â€, Ã¬Â½â€Ã«â€œÅ“ Ã«Â¶â€žÃ­â€¢Â )
- Ã­ÂÂ¼Ã¬Ââ€ž Ã«â€¹Â¤Ã«Â£Â° Ã«â€¢Å’ (Ã¬Å“Â Ã­Å¡Â¨Ã¬â€žÂ± ÃªÂ²â‚¬Ã¬â€šÂ¬, Ã¬Â Å“Ã¬â€“Â´ Ã¬Å¾â€¦Ã«Â Â¥, Zod Ã¬Å Â¤Ã­â€šÂ¤Ã«Â§Ë†)
- Ã­ÂÂ´Ã«ÂÂ¼Ã¬ÂÂ´Ã¬â€“Â¸Ã­Å Â¸ Ã¬â€šÂ¬Ã¬ÂÂ´Ã«â€œÅ“ Ã«ÂÂ¼Ã¬Å¡Â°Ã­Å’â€¦ÃªÂ³Â¼ Ã«â€žÂ¤Ã«Â¹â€žÃªÂ²Å’Ã¬ÂÂ´Ã¬â€¦ËœÃ¬Ââ€ž Ã¬Â²ËœÃ«Â¦Â¬Ã­â€¢Â  Ã«â€¢Å’
- Ã¬Â â€˜ÃªÂ·Â¼Ã¬â€žÂ± Ã¬Å¾Ë†ÃªÂ³Â  Ã«Â°ËœÃ¬Ââ€˜Ã­Ëœâ€¢Ã¬ÂÂ¸ UI Ã­Å’Â¨Ã­â€žÂ´Ã¬Ââ€ž ÃªÂµÂ¬Ã¬Â¶â€¢Ã­â€¢Â  Ã«â€¢Å’

## Ã¬Â»Â´Ã­ÂÂ¬Ã«â€žÅ’Ã­Å Â¸ Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Æ’ÂÃ¬â€ ÂÃ«Â³Â´Ã«â€¹Â¤ Ã­â€¢Â©Ã¬â€žÂ±

```typescript
// Ã¢Å“â€¦ GOOD: Component composition
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card-${variant}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### Compound Components

```typescript
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>
}

export function Tab({ id, children }: { id: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  return (
    <button
      className={context.activeTab === id ? 'active' : ''}
      onClick={() => context.setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// Usage
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

### Render Props Ã­Å’Â¨Ã­â€žÂ´

```typescript
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{children(data, loading, error)}</>
}

// Usage
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

## Ã¬Â»Â¤Ã¬Å Â¤Ã­â€¦â‚¬ Hook Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Æ’ÂÃ­Æ’Å“ ÃªÂ´â‚¬Ã«Â¦Â¬ Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Usage
const [isOpen, toggleOpen] = useToggle()
```

### Ã«Â¹â€žÃ«Ââ„¢ÃªÂ¸Â° Ã«ÂÂ°Ã¬ÂÂ´Ã­â€žÂ° Ã­Å½ËœÃ¬Â¹Â­ Hook

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const successRef = useRef(options?.onSuccess)
  const errorRef = useRef(options?.onError)
  const enabled = options?.enabled !== false

  useEffect(() => {
    successRef.current = options?.onSuccess
    errorRef.current = options?.onError
  }, [options?.onSuccess, options?.onError])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      successRef.current?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      errorRef.current?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    if (enabled) {
      refetch()
    }
  }, [key, enabled, refetch])

  return { data, error, loading, refetch }
}

// Usage
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

### Debounce Hook

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

## Ã¬Æ’ÂÃ­Æ’Å“ ÃªÂ´â‚¬Ã«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´

### Context + Reducer Ã­Å’Â¨Ã­â€žÂ´

```typescript
interface State {
  markets: Market[]
  selectedMarket: Market | null
  loading: boolean
}

type Action =
  | { type: 'SET_MARKETS'; payload: Market[] }
  | { type: 'SELECT_MARKET'; payload: Market }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MARKETS':
      return { ...state, markets: action.payload }
    case 'SELECT_MARKET':
      return { ...state, selectedMarket: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const MarketContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
} | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    markets: [],
    selectedMarket: null,
    loading: false
  })

  return (
    <MarketContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarkets() {
  const context = useContext(MarketContext)
  if (!context) throw new Error('useMarkets must be used within MarketProvider')
  return context
}
```

## Ã¬â€žÂ±Ã«Å Â¥ Ã¬ÂµÅ“Ã¬Â ÂÃ­â„¢â€

### Ã«Â©â€Ã«ÂªÂ¨Ã¬ÂÂ´Ã¬Â Å“Ã¬ÂÂ´Ã¬â€¦Ëœ

```typescript
// Ã¢Å“â€¦ useMemo for expensive computations
const sortedMarkets = useMemo(() => {
  return [...markets].sort((a, b) => b.volume - a.volume)
}, [markets])

// Ã¢Å“â€¦ useCallback for functions passed to children
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// Ã¢Å“â€¦ React.memo for pure components
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

### Ã¬Â½â€Ã«â€œÅ“ Ã«Â¶â€žÃ­â€¢Â  Ã«Â°Â Ã¬Â§â‚¬Ã¬â€”Â° Ã«Â¡Å“Ã«â€Â©

```typescript
import { lazy, Suspense } from 'react'

// Ã¢Å“â€¦ Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))
const ThreeJsBackground = lazy(() => import('./ThreeJsBackground'))

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>

      <Suspense fallback={null}>
        <ThreeJsBackground />
      </Suspense>
    </div>
  )
}
```

### ÃªÂ¸Â´ Ã«Â¦Â¬Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ ÃªÂ°â‚¬Ã¬Æ’ÂÃ­â„¢â€

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // Estimated row height
    overscan: 5  // Extra items to render
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <MarketCard market={markets[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Ã­ÂÂ¼ Ã¬Â²ËœÃ«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Å“Â Ã­Å¡Â¨Ã¬â€žÂ± ÃªÂ²â‚¬Ã¬â€šÂ¬ÃªÂ°â‚¬ Ã­ÂÂ¬Ã­â€¢Â¨Ã«ÂÅ“ Ã¬Â Å“Ã¬â€“Â´ Ã­ÂÂ¼

```typescript
interface FormData {
  name: string
  description: string
  endDate: string
}

interface FormErrors {
  name?: string
  description?: string
  endDate?: string
}

export function CreateMarketForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    endDate: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be under 200 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await createMarket(formData)
      // Success handling
    } catch (error) {
      // Error handling
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Market name"
      />
      {errors.name && <span className="error">{errors.name}</span>}

      {/* Other fields */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

## Error Boundary Ã­Å’Â¨Ã­â€žÂ´

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Ã¬â€¢Â Ã«â€¹Ë†Ã«Â©â€Ã¬ÂÂ´Ã¬â€¦Ëœ Ã­Å’Â¨Ã­â€žÂ´

### Framer Motion Ã¬â€¢Â Ã«â€¹Ë†Ã«Â©â€Ã¬ÂÂ´Ã¬â€¦Ëœ

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// Ã¢Å“â€¦ List animations
export function AnimatedMarketList({ markets }: { markets: Market[] }) {
  return (
    <AnimatePresence>
      {markets.map(market => (
        <motion.div
          key={market.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MarketCard market={market} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// Ã¢Å“â€¦ Modal animations
export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

## Ã¬Â â€˜ÃªÂ·Â¼Ã¬â€žÂ± Ã­Å’Â¨Ã­â€žÂ´

### Ã­â€šÂ¤Ã«Â³Â´Ã«â€œÅ“ Ã«â€žÂ¤Ã«Â¹â€žÃªÂ²Å’Ã¬ÂÂ´Ã¬â€¦Ëœ

```typescript
export function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        onSelect(options[activeIndex])
        setIsOpen(false)
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown implementation */}
    </div>
  )
}
```

### Ã­ÂÂ¬Ã¬Â»Â¤Ã¬Å Â¤ ÃªÂ´â‚¬Ã«Â¦Â¬

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus modal
      modalRef.current?.focus()
    } else {
      // Restore focus when closing
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  ) : null
}
```

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: Ã«ÂªÂ¨Ã«ÂËœ Ã­â€â€žÃ«Â¡Â Ã­Å Â¸Ã¬â€”â€Ã«â€œÅ“ Ã­Å’Â¨Ã­â€žÂ´Ã¬Ââ‚¬ Ã¬Å“Â Ã¬Â§â‚¬Ã«Â³Â´Ã¬Ë†Ëœ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ³Â  ÃªÂ³Â Ã¬â€žÂ±Ã«Å Â¥Ã¬ÂÂ¸ Ã¬â€šÂ¬Ã¬Å¡Â©Ã¬Å¾Â Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤Ã«Â¥Â¼ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ²Å’ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤. Ã­â€â€žÃ«Â¡Å“Ã¬Â ÂÃ­Å Â¸ Ã«Â³ÂµÃ¬Å¾Â¡Ã«Ââ€žÃ¬â€”Â Ã«Â§Å¾Ã«Å â€ Ã­Å’Â¨Ã­â€žÂ´Ã¬Ââ€ž Ã¬â€žÂ Ã­Æ’ÂÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.
