---
name: frontend-patterns
description: ReactÃ£â‚¬ÂNext.jsÃ£â‚¬ÂÃ§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€ Ã£â‚¬ÂÃ¦â‚¬Â§Ã¨Æ’Â½Ã¤Â¼ËœÃ¥Å’â€“Ã¥â€™Å’UIÃ¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ§Å¡â€žÃ¥â€°ÂÃ§Â«Â¯Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
origin: claude-fulcrum
---

# Ã¥â€°ÂÃ§Â«Â¯Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ ReactÃ£â‚¬ÂNext.js Ã¥â€™Å’Ã©Â«ËœÃ¦â‚¬Â§Ã¨Æ’Â½Ã§â€Â¨Ã¦Ë†Â·Ã§â€¢Å’Ã©ÂÂ¢Ã§Å¡â€žÃ§Å½Â°Ã¤Â»Â£Ã¥â€°ÂÃ§Â«Â¯Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¦Å¾â€žÃ¥Â»Âº React Ã§Â»â€žÃ¤Â»Â¶Ã¯Â¼Ë†Ã§Â»â€žÃ¥ÂË†Ã£â‚¬ÂÃ¥Â±Å¾Ã¦â‚¬Â§Ã£â‚¬ÂÃ¦Â¸Â²Ã¦Å¸â€œÃ¯Â¼â€°
* Ã§Â®Â¡Ã§Ââ€ Ã§Å Â¶Ã¦â‚¬ÂÃ¯Â¼Ë†useStateÃ£â‚¬ÂuseReducerÃ£â‚¬ÂZustandÃ£â‚¬ÂContextÃ¯Â¼â€°
* Ã¥Â®Å¾Ã§Å½Â°Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Å½Â·Ã¥Ââ€“Ã¯Â¼Ë†SWRÃ£â‚¬ÂReact QueryÃ£â‚¬ÂÃ¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã§Â»â€žÃ¤Â»Â¶Ã¯Â¼â€°
* Ã¤Â¼ËœÃ¥Å’â€“Ã¦â‚¬Â§Ã¨Æ’Â½Ã¯Â¼Ë†Ã¨Â®Â°Ã¥Â¿â€ Ã¥Å’â€“Ã£â‚¬ÂÃ¨â„¢Å¡Ã¦â€¹Å¸Ã¥Å’â€“Ã£â‚¬ÂÃ¤Â»Â£Ã§Â ÂÃ¥Ë†â€ Ã¥â€°Â²Ã¯Â¼â€°
* Ã¥Â¤â€žÃ§Ââ€ Ã¨Â¡Â¨Ã¥Ââ€¢Ã¯Â¼Ë†Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂÃ¥Ââ€”Ã¦Å½Â§Ã¨Â¾â€œÃ¥â€¦Â¥Ã£â‚¬ÂZod Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼â€°
* Ã¥Â¤â€žÃ§Ââ€ Ã¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯Ã¨Â·Â¯Ã§â€Â±Ã¥â€™Å’Ã¥Â¯Â¼Ã¨Ë†Âª
* Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¯Ã¨Â®Â¿Ã©â€”Â®Ã£â‚¬ÂÃ¥â€œÂÃ¥Âºâ€Ã¥Â¼ÂÃ§Å¡â€ž UI Ã¦Â¨Â¡Ã¥Â¼Â

## Ã§Â»â€žÃ¤Â»Â¶Ã¦Â¨Â¡Ã¥Â¼Â

### Ã§Â»â€žÃ¥ÂË†Ã¤Â¼ËœÃ¤ÂºÅ½Ã§Â»Â§Ã¦â€°Â¿

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

### Ã¥Â¤ÂÃ¥ÂË†Ã§Â»â€žÃ¤Â»Â¶

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

### Ã¦Â¸Â²Ã¦Å¸â€œÃ¥Â±Å¾Ã¦â‚¬Â§Ã¦Â¨Â¡Ã¥Â¼Â

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

## Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€° Hooks Ã¦Â¨Â¡Ã¥Â¼Â

### Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€  Hook

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

### Ã¥Â¼â€šÃ¦Â­Â¥Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Å½Â·Ã¥Ââ€“ Hook

```typescript
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

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, options])

  useEffect(() => {
    if (options?.enabled !== false) {
      refetch()
    }
  }, [key, refetch, options?.enabled])

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

### Ã©ËœÂ²Ã¦Å â€“ Hook

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

## Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Context + Reducer Ã¦Â¨Â¡Ã¥Â¼Â

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

## Ã¦â‚¬Â§Ã¨Æ’Â½Ã¤Â¼ËœÃ¥Å’â€“

### Ã¨Â®Â°Ã¥Â¿â€ Ã¥Å’â€“

```typescript
// Ã¢Å“â€¦ useMemo for expensive computations
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
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

### Ã¤Â»Â£Ã§Â ÂÃ¥Ë†â€ Ã¥â€°Â²Ã¤Â¸Å½Ã¦â€¡â€™Ã¥Å Â Ã¨Â½Â½

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

### Ã©â€¢Â¿Ã¥Ë†â€”Ã¨Â¡Â¨Ã¨â„¢Å¡Ã¦â€¹Å¸Ã¥Å’â€“

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

## Ã¨Â¡Â¨Ã¥Ââ€¢Ã¥Â¤â€žÃ§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Ã¥Â¸Â¦Ã©ÂªÅ’Ã¨Â¯ÂÃ§Å¡â€žÃ¥Ââ€”Ã¦Å½Â§Ã¨Â¡Â¨Ã¥Ââ€¢

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

## Ã©â€â„¢Ã¨Â¯Â¯Ã¨Â¾Â¹Ã§â€¢Å’Ã¦Â¨Â¡Ã¥Â¼Â

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

## Ã¥Å Â¨Ã§â€Â»Ã¦Â¨Â¡Ã¥Â¼Â

### Framer Motion Ã¥Å Â¨Ã§â€Â»

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

## Ã¦â€”Â Ã©Å¡Å“Ã§Â¢ÂÃ¦Â¨Â¡Ã¥Â¼Â

### Ã©â€Â®Ã§â€ºËœÃ¥Â¯Â¼Ã¨Ë†Âª

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

### Ã§â€žÂ¦Ã§â€šÂ¹Ã§Â®Â¡Ã§Ââ€ 

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

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã§Å½Â°Ã¤Â»Â£Ã¥â€°ÂÃ§Â«Â¯Ã¦Â¨Â¡Ã¥Â¼ÂÃ¨Æ’Â½Ã¥Â®Å¾Ã§Å½Â°Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã£â‚¬ÂÃ©Â«ËœÃ¦â‚¬Â§Ã¨Æ’Â½Ã§Å¡â€žÃ§â€Â¨Ã¦Ë†Â·Ã§â€¢Å’Ã©ÂÂ¢Ã£â‚¬â€šÃ©â‚¬â€°Ã¦â€¹Â©Ã©â‚¬â€šÃ¥ÂË†Ã¤Â½Â Ã©Â¡Â¹Ã§â€ºÂ®Ã¥Â¤ÂÃ¦Ââ€šÃ¥ÂºÂ¦Ã§Å¡â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
