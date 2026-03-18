---
name: golang-patterns
description: Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã¤Â¸â€Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã§Å¡â€žGoÃ¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Æ’Â¯Ã§â€Â¨GoÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂÃ¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ¥â€™Å’Ã§ÂºÂ¦Ã¥Â®Å¡Ã£â‚¬â€š
origin: claude-fulcrum
---

# Go Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã¥â€™Å’Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Æ’Â¯Ã§â€Â¨ Go Ã¦Â¨Â¡Ã¥Â¼ÂÃ¤Â¸Å½Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Go Ã¤Â»Â£Ã§Â ÂÃ¦â€”Â¶
* Ã¥Â®Â¡Ã¦Å¸Â¥ Go Ã¤Â»Â£Ã§Â ÂÃ¦â€”Â¶
* Ã©â€¡ÂÃ¦Å¾â€žÃ§Å½Â°Ã¦Å“â€° Go Ã¤Â»Â£Ã§Â ÂÃ¦â€”Â¶
* Ã¨Â®Â¾Ã¨Â®Â¡ Go Ã¥Å’â€¦/Ã¦Â¨Â¡Ã¥Ââ€”Ã¦â€”Â¶

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Å½Å¸Ã¥Ë†â„¢

### 1. Ã§Â®â‚¬Ã¦Â´ÂÃ¤Â¸Å½Ã¦Â¸â€¦Ã¦â„¢Â°

Go Ã¦Å½Â¨Ã¥Â´â€¡Ã§Â®â‚¬Ã¦Â´ÂÃ¨â‚¬Å’Ã©ÂÅ¾Ã§Â²Â¾Ã¥Â·Â§Ã£â‚¬â€šÃ¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¦ËœÂ¾Ã¨â‚¬Å’Ã¦Ëœâ€œÃ¨Â§ÂÃ¤Â¸â€Ã¦Ëœâ€œÃ¤ÂºÅ½Ã©Ëœâ€¦Ã¨Â¯Â»Ã£â‚¬â€š

```go
// Good: Clear and direct
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}

// Bad: Overly clever
func GetUser(id string) (*User, error) {
    return func() (*User, error) {
        if u, e := db.FindUser(id); e == nil {
            return u, nil
        } else {
            return nil, e
        }
    }()
}
```

### 2. Ã¨Â®Â©Ã©â€ºÂ¶Ã¥â‚¬Â¼Ã¥ÂËœÃ¥Â¾â€”Ã¦Å“â€°Ã§â€Â¨

Ã¨Â®Â¾Ã¨Â®Â¡Ã§Â±Â»Ã¥Å¾â€¹Ã¦â€”Â¶Ã¯Â¼Å’Ã¥Âºâ€Ã¤Â½Â¿Ã¥â€¦Â¶Ã©â€ºÂ¶Ã¥â‚¬Â¼Ã¦â€”Â Ã©Å“â‚¬Ã¥Ë†ÂÃ¥Â§â€¹Ã¥Å’â€“Ã¥ÂÂ³Ã¥ÂÂ¯Ã§Â«â€¹Ã¥ÂÂ³Ã¤Â½Â¿Ã§â€Â¨Ã£â‚¬â€š

```go
// Good: Zero value is useful
type Counter struct {
    mu    sync.Mutex
    count int // zero value is 0, ready to use
}

func (c *Counter) Inc() {
    c.mu.Lock()
    c.count++
    c.mu.Unlock()
}

// Good: bytes.Buffer works with zero value
var buf bytes.Buffer
buf.WriteString("hello")

// Bad: Requires initialization
type BadCounter struct {
    counts map[string]int // nil map will panic
}
```

### 3. Ã¦Å½Â¥Ã¥Ââ€”Ã¦Å½Â¥Ã¥ÂÂ£Ã¯Â¼Å’Ã¨Â¿â€Ã¥â€ºÅ¾Ã§Â»â€œÃ¦Å¾â€žÃ¤Â½â€œ

Ã¥â€¡Â½Ã¦â€¢Â°Ã¥Âºâ€Ã¨Â¯Â¥Ã¦Å½Â¥Ã¥Ââ€”Ã¦Å½Â¥Ã¥ÂÂ£Ã¥Ââ€šÃ¦â€¢Â°Ã¥Â¹Â¶Ã¨Â¿â€Ã¥â€ºÅ¾Ã¥â€¦Â·Ã¤Â½â€œÃ§Â±Â»Ã¥Å¾â€¹Ã£â‚¬â€š

```go
// Good: Accepts interface, returns concrete type
func ProcessData(r io.Reader) (*Result, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    return &Result{Data: data}, nil
}

// Bad: Returns interface (hides implementation details unnecessarily)
func ProcessData(r io.Reader) (io.Reader, error) {
    // ...
}
```

## Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Ã¥Â¸Â¦Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã§Å¡â€žÃ©â€â„¢Ã¨Â¯Â¯Ã¥Å’â€¦Ã¨Â£â€¦

```go
// Good: Wrap errors with context
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parse config %s: %w", path, err)
    }

    return &cfg, nil
}
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã©â€â„¢Ã¨Â¯Â¯Ã§Â±Â»Ã¥Å¾â€¹

```go
// Define domain-specific errors
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

// Sentinel errors for common cases
var (
    ErrNotFound     = errors.New("resource not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrInvalidInput = errors.New("invalid input")
)
```

### Ã¤Â½Â¿Ã§â€Â¨ errors.Is Ã¥â€™Å’ errors.As Ã¦Â£â‚¬Ã¦Å¸Â¥Ã©â€â„¢Ã¨Â¯Â¯

```go
func HandleError(err error) {
    // Check for specific error
    if errors.Is(err, sql.ErrNoRows) {
        log.Println("No records found")
        return
    }

    // Check for error type
    var validationErr *ValidationError
    if errors.As(err, &validationErr) {
        log.Printf("Validation error on field %s: %s",
            validationErr.Field, validationErr.Message)
        return
    }

    // Unknown error
    log.Printf("Unexpected error: %v", err)
}
```

### Ã¦Â°Â¸Ã¤Â¸ÂÃ¥Â¿Â½Ã§â€¢Â¥Ã©â€â„¢Ã¨Â¯Â¯

```go
// Bad: Ignoring error with blank identifier
result, _ := doSomething()

// Good: Handle or explicitly document why it's safe to ignore
result, err := doSomething()
if err != nil {
    return err
}

// Acceptable: When error truly doesn't matter (rare)
_ = writer.Close() // Best-effort cleanup, error logged elsewhere
```

## Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

### Ã¥Â·Â¥Ã¤Â½Å“Ã¦Â±Â 

```go
func WorkerPool(jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }

    wg.Wait()
    close(results)
}
```

### Ã§â€Â¨Ã¤ÂºÅ½Ã¥Ââ€“Ã¦Â¶Ë†Ã¥â€™Å’Ã¨Â¶â€¦Ã¦â€”Â¶Ã§Å¡â€ž Context

```go
func FetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("create request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("fetch %s: %w", url, err)
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}
```

### Ã¤Â¼ËœÃ©â€ºâ€¦Ã¥â€¦Â³Ã©â€”Â­

```go
func GracefulShutdown(server *http.Server) {
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("Server forced to shutdown: %v", err)
    }

    log.Println("Server exited")
}
```

### Ã§â€Â¨Ã¤ÂºÅ½Ã¥ÂÂÃ¨Â°Æ’ Goroutine Ã§Å¡â€ž errgroup

```go
import "golang.org/x/sync/errgroup"

func FetchAll(ctx context.Context, urls []string) ([][]byte, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([][]byte, len(urls))

    for i, url := range urls {
        i, url := i, url // Capture loop variables
        g.Go(func() error {
            data, err := FetchWithTimeout(ctx, url)
            if err != nil {
                return err
            }
            results[i] = data
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}
```

### Ã©ÂÂ¿Ã¥â€¦Â Goroutine Ã¦Â³â€žÃ¦Â¼Â

```go
// Bad: Goroutine leak if context is cancelled
func leakyFetch(ctx context.Context, url string) <-chan []byte {
    ch := make(chan []byte)
    go func() {
        data, _ := fetch(url)
        ch <- data // Blocks forever if no receiver
    }()
    return ch
}

// Good: Properly handles cancellation
func safeFetch(ctx context.Context, url string) <-chan []byte {
    ch := make(chan []byte, 1) // Buffered channel
    go func() {
        data, err := fetch(url)
        if err != nil {
            return
        }
        select {
        case ch <- data:
        case <-ctx.Done():
        }
    }()
    return ch
}
```

## Ã¦Å½Â¥Ã¥ÂÂ£Ã¨Â®Â¾Ã¨Â®Â¡

### Ã¥Â°ÂÃ¨â‚¬Å’Ã¤Â¸â€œÃ¦Â³Â¨Ã§Å¡â€žÃ¦Å½Â¥Ã¥ÂÂ£

```go
// Good: Single-method interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type Closer interface {
    Close() error
}

// Compose interfaces as needed
type ReadWriteCloser interface {
    Reader
    Writer
    Closer
}
```

### Ã¥Å“Â¨Ã¦Å½Â¥Ã¥ÂÂ£Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¤â€žÃ¥Â®Å¡Ã¤Â¹â€°Ã¦Å½Â¥Ã¥ÂÂ£

```go
// In the consumer package, not the provider
package service

// UserStore defines what this service needs
type UserStore interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}

type Service struct {
    store UserStore
}

// Concrete implementation can be in another package
// It doesn't need to know about this interface
```

### Ã¤Â½Â¿Ã§â€Â¨Ã§Â±Â»Ã¥Å¾â€¹Ã¦â€“Â­Ã¨Â¨â‚¬Ã¥Â®Å¾Ã§Å½Â°Ã¥ÂÂ¯Ã©â‚¬â€°Ã¨Â¡Å’Ã¤Â¸Âº

```go
type Flusher interface {
    Flush() error
}

func WriteAndFlush(w io.Writer, data []byte) error {
    if _, err := w.Write(data); err != nil {
        return err
    }

    // Flush if supported
    if f, ok := w.(Flusher); ok {
        return f.Flush()
    }
    return nil
}
```

## Ã¥Å’â€¦Ã§Â»â€žÃ§Â»â€¡

### Ã¦Â â€¡Ã¥â€¡â€ Ã©Â¡Â¹Ã§â€ºÂ®Ã¥Â¸Æ’Ã¥Â±â‚¬

```text
myproject/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cmd/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ myapp/
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ main.go           # Entry point
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ internal/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ handler/              # HTTP handlers
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ service/              # Business logic
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ repository/           # Data access
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ config/               # Configuration
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ pkg/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ client/               # Public API client
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ api/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ v1/                   # API definitions (proto, OpenAPI)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ testdata/                 # Test fixtures
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ go.mod
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ go.sum
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Makefile
```

### Ã¥Å’â€¦Ã¥â€˜Â½Ã¥ÂÂ

```go
// Good: Short, lowercase, no underscores
package http
package json
package user

// Bad: Verbose, mixed case, or redundant
package httpHandler
package json_parser
package userService // Redundant 'Service' suffix
```

### Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å’â€¦Ã§ÂºÂ§Ã§Å Â¶Ã¦â‚¬Â

```go
// Bad: Global mutable state
var db *sql.DB

func init() {
    db, _ = sql.Open("postgres", os.Getenv("DATABASE_URL"))
}

// Good: Dependency injection
type Server struct {
    db *sql.DB
}

func NewServer(db *sql.DB) *Server {
    return &Server{db: db}
}
```

## Ã§Â»â€œÃ¦Å¾â€žÃ¤Â½â€œÃ¨Â®Â¾Ã¨Â®Â¡

### Ã¥â€¡Â½Ã¦â€¢Â°Ã¥Â¼ÂÃ©â‚¬â€°Ã©Â¡Â¹Ã¦Â¨Â¡Ã¥Â¼Â

```go
type Server struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}

type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) {
        s.timeout = d
    }
}

func WithLogger(l *log.Logger) Option {
    return func(s *Server) {
        s.logger = l
    }
}

func NewServer(addr string, opts ...Option) *Server {
    s := &Server{
        addr:    addr,
        timeout: 30 * time.Second, // default
        logger:  log.Default(),    // default
    }
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// Usage
server := NewServer(":8080",
    WithTimeout(60*time.Second),
    WithLogger(customLogger),
)
```

### Ã¤Â½Â¿Ã§â€Â¨Ã¥ÂµÅ’Ã¥â€¦Â¥Ã¥Â®Å¾Ã§Å½Â°Ã§Â»â€žÃ¥ÂË†

```go
type Logger struct {
    prefix string
}

func (l *Logger) Log(msg string) {
    fmt.Printf("[%s] %s\n", l.prefix, msg)
}

type Server struct {
    *Logger // Embedding - Server gets Log method
    addr    string
}

func NewServer(addr string) *Server {
    return &Server{
        Logger: &Logger{prefix: "SERVER"},
        addr:   addr,
    }
}

// Usage
s := NewServer(":8080")
s.Log("Starting...") // Calls embedded Logger.Log
```

## Ã¥â€ â€¦Ã¥Â­ËœÃ¤Â¸Å½Ã¦â‚¬Â§Ã¨Æ’Â½

### Ã¥Â½â€œÃ¥Â¤Â§Ã¥Â°ÂÃ¥Â·Â²Ã§Å¸Â¥Ã¦â€”Â¶Ã©Â¢â€žÃ¥Ë†â€ Ã©â€¦ÂÃ¥Ë†â€¡Ã§â€°â€¡

```go
// Bad: Grows slice multiple times
func processItems(items []Item) []Result {
    var results []Result
    for _, item := range items {
        results = append(results, process(item))
    }
    return results
}

// Good: Single allocation
func processItems(items []Item) []Result {
    results := make([]Result, 0, len(items))
    for _, item := range items {
        results = append(results, process(item))
    }
    return results
}
```

### Ã¤Â¸ÂºÃ©Â¢â€˜Ã§Â¹ÂÃ¥Ë†â€ Ã©â€¦ÂÃ¤Â½Â¿Ã§â€Â¨ sync.Pool

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func ProcessRequest(data []byte) []byte {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf)
    }()

    buf.Write(data)
    // Process...
    return buf.Bytes()
}
```

### Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã¥Â¾ÂªÃ§Å½Â¯Ã¤Â¸Â­Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¦â€¹Â¼Ã¦Å½Â¥

```go
// Bad: Creates many string allocations
func join(parts []string) string {
    var result string
    for _, p := range parts {
        result += p + ","
    }
    return result
}

// Good: Single allocation with strings.Builder
func join(parts []string) string {
    var sb strings.Builder
    for i, p := range parts {
        if i > 0 {
            sb.WriteString(",")
        }
        sb.WriteString(p)
    }
    return sb.String()
}

// Best: Use standard library
func join(parts []string) string {
    return strings.Join(parts, ",")
}
```

## Go Ã¥Â·Â¥Ã¥â€¦Â·Ã©â€ºâ€ Ã¦Ë†Â

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¥â€˜Â½Ã¤Â»Â¤

```bash
# Build and run
go build ./...
go run ./cmd/myapp

# Testing
go test ./...
go test -race ./...
go test -cover ./...

# Static analysis
go vet ./...
staticcheck ./...
golangci-lint run

# Module management
go mod tidy
go mod verify

# Formatting
gofmt -w .
goimports -w .
```

### Ã¦Å½Â¨Ã¨ÂÂÃ§Å¡â€ž Linter Ã©â€¦ÂÃ§Â½Â® (.golangci.yml)

```yaml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused
    - gofmt
    - goimports
    - misspell
    - unconvert
    - unparam

linters-settings:
  errcheck:
    check-type-assertions: true
  govet:
    check-shadowing: true

issues:
  exclude-use-default: false
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’Ã¯Â¼Å¡Go Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢

| Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢ | Ã¦ÂÂÃ¨Â¿Â° |
|-------|-------------|
| Ã¦Å½Â¥Ã¥Ââ€”Ã¦Å½Â¥Ã¥ÂÂ£Ã¯Â¼Å’Ã¨Â¿â€Ã¥â€ºÅ¾Ã§Â»â€œÃ¦Å¾â€žÃ¤Â½â€œ | Ã¥â€¡Â½Ã¦â€¢Â°Ã¦Å½Â¥Ã¥Ââ€”Ã¦Å½Â¥Ã¥ÂÂ£Ã¥Ââ€šÃ¦â€¢Â°Ã¯Â¼Å’Ã¨Â¿â€Ã¥â€ºÅ¾Ã¥â€¦Â·Ã¤Â½â€œÃ§Â±Â»Ã¥Å¾â€¹ |
| Ã©â€â„¢Ã¨Â¯Â¯Ã¥ÂÂ³Ã¥â‚¬Â¼ | Ã¥Â°â€ Ã©â€â„¢Ã¨Â¯Â¯Ã¨Â§â€ Ã¤Â¸ÂºÃ¤Â¸â‚¬Ã§Â­â€°Ã¥â‚¬Â¼Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥Â¼â€šÃ¥Â¸Â¸ |
| Ã¤Â¸ÂÃ¨Â¦ÂÃ©â‚¬Å¡Ã¨Â¿â€¡Ã¥â€¦Â±Ã¤ÂºÂ«Ã¥â€ â€¦Ã¥Â­ËœÃ¦ÂÂ¥Ã©â‚¬Å¡Ã¤Â¿Â¡ | Ã¤Â½Â¿Ã§â€Â¨Ã©â‚¬Å¡Ã©Ââ€œÃ¥Å“Â¨ goroutine Ã¤Â¹â€¹Ã©â€”Â´Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥ÂÂÃ¨Â°Æ’ |
| Ã¨Â®Â©Ã©â€ºÂ¶Ã¥â‚¬Â¼Ã¥ÂËœÃ¥Â¾â€”Ã¦Å“â€°Ã§â€Â¨ | Ã§Â±Â»Ã¥Å¾â€¹Ã¥Âºâ€Ã¦â€”Â Ã©Å“â‚¬Ã¦ËœÂ¾Ã¥Â¼ÂÃ¥Ë†ÂÃ¥Â§â€¹Ã¥Å’â€“Ã¥ÂÂ³Ã¥ÂÂ¯Ã¥Â·Â¥Ã¤Â½Å“ |
| Ã¥Â°â€˜Ã©â€¡ÂÃ¥Â¤ÂÃ¥Ë†Â¶Ã¤Â¼ËœÃ¤ÂºÅ½Ã¥Â°â€˜Ã©â€¡ÂÃ¤Â¾ÂÃ¨Âµâ€“ | Ã©ÂÂ¿Ã¥â€¦ÂÃ¤Â¸ÂÃ¥Â¿â€¦Ã¨Â¦ÂÃ§Å¡â€žÃ¥Â¤â€“Ã©Æ’Â¨Ã¤Â¾ÂÃ¨Âµâ€“ |
| Ã¦Â¸â€¦Ã¦â„¢Â°Ã¤Â¼ËœÃ¤ÂºÅ½Ã§Â²Â¾Ã¥Â·Â§ | Ã¤Â¼ËœÃ¥â€¦Ë†Ã¨â‚¬Æ’Ã¨â„¢â€˜Ã¥ÂÂ¯Ã¨Â¯Â»Ã¦â‚¬Â§Ã¨â‚¬Å’Ã©ÂÅ¾Ã§Â²Â¾Ã¥Â·Â§Ã¦â‚¬Â§ |
| gofmt Ã¨â„¢Â½Ã©ÂÅ¾Ã¦Å“â‚¬Ã§Ë†Â±Ã¯Â¼Å’Ã¤Â½â€ Ã¥ÂÂ´Ã¦ËœÂ¯Ã¦Â¯ÂÃ¤Â¸ÂªÃ¤ÂºÂºÃ§Å¡â€žÃ¦Å“â€¹Ã¥Ââ€¹ | Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨ gofmt/goimports Ã¦Â Â¼Ã¥Â¼ÂÃ¥Å’â€“Ã¤Â»Â£Ã§Â Â |
| Ã¦ÂÂÃ¥â€°ÂÃ¨Â¿â€Ã¥â€ºÅ¾ | Ã¥â€¦Ë†Ã¥Â¤â€žÃ§Ââ€ Ã©â€â„¢Ã¨Â¯Â¯Ã¯Â¼Å’Ã¤Â¿ÂÃ¦Å’ÂÃ¤Â¸Â»Ã©â‚¬Â»Ã¨Â¾â€˜Ã¨Â·Â¯Ã¥Â¾â€žÃ¦â€”Â Ã§Â¼Â©Ã¨Â¿â€º |

## Ã¥Âºâ€Ã©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

```go
// Bad: Naked returns in long functions
func process() (result int, err error) {
    // ... 50 lines ...
    return // What is being returned?
}

// Bad: Using panic for control flow
func GetUser(id string) *User {
    user, err := db.Find(id)
    if err != nil {
        panic(err) // Don't do this
    }
    return user
}

// Bad: Passing context in struct
type Request struct {
    ctx context.Context // Context should be first param
    ID  string
}

// Good: Context as first parameter
func ProcessRequest(ctx context.Context, id string) error {
    // ...
}

// Bad: Mixing value and pointer receivers
type Counter struct{ n int }
func (c Counter) Value() int { return c.n }    // Value receiver
func (c *Counter) Increment() { c.n++ }        // Pointer receiver
// Pick one style and be consistent
```

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Go Ã¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¤Â»Â¥Ã¦Å“â‚¬Ã¥Â¥Â½Ã§Å¡â€žÃ¦â€“Â¹Ã¥Â¼ÂÃ¦ËœÂ¾Ã¥Â¾â€”Ã¢â‚¬Å“Ã¤Â¹ÂÃ¥â€˜Â³Ã¢â‚¬ÂÃ¢â‚¬â€Ã¢â‚¬â€Ã¥ÂÂ¯Ã©Â¢â€žÃ¦Âµâ€¹Ã£â‚¬ÂÃ¤Â¸â‚¬Ã¨â€¡Â´Ã¤Â¸â€Ã¦Ëœâ€œÃ¤ÂºÅ½Ã§Ââ€ Ã¨Â§Â£Ã£â‚¬â€šÃ¥Â¦â€šÃ¦Å“â€°Ã§â€“â€˜Ã©â€”Â®Ã¯Â¼Å’Ã¤Â¿ÂÃ¦Å’ÂÃ§Â®â‚¬Ã¥Ââ€¢Ã£â‚¬â€š
