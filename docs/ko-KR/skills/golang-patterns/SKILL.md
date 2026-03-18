---
name: golang-patterns
description: ÃªÂ²Â¬ÃªÂ³Â Ã­â€¢ËœÃªÂ³Â  Ã­Å¡Â¨Ã¬Å“Â¨Ã¬Â ÂÃ¬ÂÂ´Ã«Â©Â° Ã¬Å“Â Ã¬Â§â‚¬Ã«Â³Â´Ã¬Ë†Ëœ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢Å“ Go Ã¬â€¢Â Ã­â€Å’Ã«Â¦Â¬Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬â€¦Ëœ ÃªÂµÂ¬Ã¬Â¶â€¢Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ ÃªÂ´â‚¬Ã¬Å¡Â©Ã¬Â Â Go Ã­Å’Â¨Ã­â€žÂ´, Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬ Ã«Â°Â ÃªÂ·Å“Ã¬Â¹â„¢.
origin: claude-fulcrum
---

# Go ÃªÂ°Å“Ã«Â°Å“ Ã­Å’Â¨Ã­â€žÂ´

ÃªÂ²Â¬ÃªÂ³Â Ã­â€¢ËœÃªÂ³Â  Ã­Å¡Â¨Ã¬Å“Â¨Ã¬Â ÂÃ¬ÂÂ´Ã«Â©Â° Ã¬Å“Â Ã¬Â§â‚¬Ã«Â³Â´Ã¬Ë†Ëœ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢Å“ Ã¬â€¢Â Ã­â€Å’Ã«Â¦Â¬Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬â€¦Ëœ ÃªÂµÂ¬Ã¬Â¶â€¢Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ ÃªÂ´â‚¬Ã¬Å¡Â©Ã¬Â Â Go Ã­Å’Â¨Ã­â€žÂ´ÃªÂ³Â¼ Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- Ã¬Æ’Ë†Ã«Â¡Å“Ã¬Å¡Â´ Go Ã¬Â½â€Ã«â€œÅ“ Ã¬Å¾â€˜Ã¬â€žÂ± Ã¬â€¹Å“
- Go Ã¬Â½â€Ã«â€œÅ“ Ã«Â¦Â¬Ã«Â·Â° Ã¬â€¹Å“
- ÃªÂ¸Â°Ã¬Â¡Â´ Go Ã¬Â½â€Ã«â€œÅ“ Ã«Â¦Â¬Ã­Å’Â©Ã­â€ Â Ã«Â§Â Ã¬â€¹Å“
- Go Ã­Å’Â¨Ã­â€šÂ¤Ã¬Â§â‚¬/Ã«ÂªÂ¨Ã«â€œË† Ã¬â€žÂ¤ÃªÂ³â€ž Ã¬â€¹Å“

## Ã­â€¢ÂµÃ¬â€¹Â¬ Ã¬â€ºÂÃ¬Â¹â„¢

### 1. Ã«â€¹Â¨Ã¬Ë†Å“Ã¬â€žÂ±ÃªÂ³Â¼ Ã«Âªâ€¦Ã­â„¢â€¢Ã¬â€žÂ±

GoÃ«Å â€ Ã¬ËœÂÃ«Â¦Â¬Ã­â€¢Â¨Ã«Â³Â´Ã«â€¹Â¤ Ã«â€¹Â¨Ã¬Ë†Å“Ã¬â€žÂ±Ã¬Ââ€ž Ã¬â€žÂ Ã­ËœÂ¸Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤. Ã¬Â½â€Ã«â€œÅ“Ã«Å â€ Ã«Âªâ€¦Ã­â„¢â€¢Ã­â€¢ËœÃªÂ³Â  Ã¬ÂÂ½ÃªÂ¸Â° Ã¬â€°Â¬Ã¬â€ºÅ’Ã¬â€¢Â¼ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.

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

### 2. Ã¬Â Å“Ã«Â¡Å“ ÃªÂ°â€™Ã¬Ââ€ž Ã¬Å“Â Ã¬Å¡Â©Ã­â€¢ËœÃªÂ²Å’ Ã«Â§Å’Ã«â€œÂ¤ÃªÂ¸Â°

Ã¬Â Å“Ã«Â¡Å“ ÃªÂ°â€™Ã¬ÂÂ´ Ã¬Â´Ë†ÃªÂ¸Â°Ã­â„¢â€ Ã¬â€”â€ Ã¬ÂÂ´ Ã¬Â¦â€°Ã¬â€¹Å“ Ã¬â€šÂ¬Ã¬Å¡Â© ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃ«Ââ€žÃ«Â¡Â Ã­Æ’â‚¬Ã¬Å¾â€¦Ã¬Ââ€ž Ã¬â€žÂ¤ÃªÂ³â€žÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.

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

### 3. Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤Ã«Â¥Â¼ Ã«Â°â€ºÃªÂ³Â  ÃªÂµÂ¬Ã¬Â¡Â°Ã¬Â²Â´Ã«Â¥Â¼ Ã«Â°ËœÃ­â„¢ËœÃ­â€¢ËœÃªÂ¸Â°

Ã­â€¢Â¨Ã¬Ë†ËœÃ«Å â€ Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤ Ã«Â§Â¤ÃªÂ°Å“Ã«Â³â‚¬Ã¬Ë†ËœÃ«Â¥Â¼ Ã«Â°â€ºÃªÂ³Â  ÃªÂµÂ¬Ã¬Â²Â´Ã¬Â Â Ã­Æ’â‚¬Ã¬Å¾â€¦Ã¬Ââ€ž Ã«Â°ËœÃ­â„¢ËœÃ­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.

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

## Ã¬â€”ÂÃ«Å¸Â¬ Ã¬Â²ËœÃ«Â¦Â¬ Ã­Å’Â¨Ã­â€žÂ´

### Ã¬Â»Â¨Ã­â€¦ÂÃ¬Å Â¤Ã­Å Â¸ÃªÂ°â‚¬ Ã¬Å¾Ë†Ã«Å â€ Ã¬â€”ÂÃ«Å¸Â¬ Ã«Å¾ËœÃ­â€¢â€˜

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

### Ã¬Â»Â¤Ã¬Å Â¤Ã­â€¦â‚¬ Ã¬â€”ÂÃ«Å¸Â¬ Ã­Æ’â‚¬Ã¬Å¾â€¦

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

### errors.IsÃ¬â„¢â‚¬ errors.AsÃ«Â¥Â¼ Ã¬â€šÂ¬Ã¬Å¡Â©Ã­â€¢Å“ Ã¬â€”ÂÃ«Å¸Â¬ Ã­â„¢â€¢Ã¬ÂÂ¸

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

### Ã¬â€”ÂÃ«Å¸Â¬Ã«Â¥Â¼ Ã¬Â Ë†Ã«Å’â‚¬ Ã«Â¬Â´Ã¬â€¹Å“Ã­â€¢ËœÃ¬Â§â‚¬ Ã«Â§Â ÃªÂ²Æ’

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

## Ã«Ââ„¢Ã¬â€¹Å“Ã¬â€žÂ± Ã­Å’Â¨Ã­â€žÂ´

### Ã¬â€ºÅ’Ã¬Â»Â¤ Ã­â€™â‚¬

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

### Ã¬Â·Â¨Ã¬â€ Å’ Ã«Â°Â Ã­Æ’â‚¬Ã¬Å¾â€žÃ¬â€¢â€žÃ¬â€ºÆ’Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ Context

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

### Ã¬Å¡Â°Ã¬â€¢â€žÃ­â€¢Å“ Ã¬Â¢â€¦Ã«Â£Å’

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

### Ã¬Â¡Â°Ã¬Å“Â¨Ã«ÂÅ“ ÃªÂ³Â Ã«Â£Â¨Ã­â€¹Â´Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ errgroup

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

### ÃªÂ³Â Ã«Â£Â¨Ã­â€¹Â´ Ã«Ë†â€žÃ¬Ë†Ëœ Ã«Â°Â©Ã¬Â§â‚¬

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

## Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤ Ã¬â€žÂ¤ÃªÂ³â€ž

### Ã¬Å¾â€˜ÃªÂ³Â  Ã¬Â§â€˜Ã¬Â¤â€˜Ã«ÂÅ“ Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤

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

### Ã¬â€šÂ¬Ã¬Å¡Â©Ã«ÂËœÃ«Å â€ ÃªÂ³Â³Ã¬â€”ÂÃ¬â€žÅ“ Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤ Ã¬Â â€¢Ã¬ÂËœ

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

### Ã­Æ’â‚¬Ã¬Å¾â€¦ Ã¬â€“Â´Ã¬â€žÅ“Ã¬â€¦ËœÃ¬Ââ€ž Ã­â€ ÂµÃ­â€¢Å“ Ã¬â€žÂ Ã­Æ’ÂÃ¬Â Â Ã«Ââ„¢Ã¬Å¾â€˜

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

## Ã­Å’Â¨Ã­â€šÂ¤Ã¬Â§â‚¬ ÃªÂµÂ¬Ã¬â€žÂ±

### Ã­â€˜Å“Ã¬Â¤â‚¬ Ã­â€â€žÃ«Â¡Å“Ã¬Â ÂÃ­Å Â¸ Ã«Â Ë†Ã¬ÂÂ´Ã¬â€¢â€žÃ¬â€ºÆ’

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

### Ã­Å’Â¨Ã­â€šÂ¤Ã¬Â§â‚¬ Ã«Âªâ€¦Ã«Âªâ€¦

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

### Ã­Å’Â¨Ã­â€šÂ¤Ã¬Â§â‚¬ Ã¬Ë†ËœÃ¬Â¤â‚¬ Ã¬Æ’ÂÃ­Æ’Å“ Ã­â€Â¼Ã­â€¢ËœÃªÂ¸Â°

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

## ÃªÂµÂ¬Ã¬Â¡Â°Ã¬Â²Â´ Ã¬â€žÂ¤ÃªÂ³â€ž

### Ã­â€¢Â¨Ã¬Ë†ËœÃ­Ëœâ€¢ Ã¬ËœÂµÃ¬â€¦Ëœ Ã­Å’Â¨Ã­â€žÂ´

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

### Ã­â€¢Â©Ã¬â€žÂ±Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ Ã¬Å¾â€žÃ«Â²Â Ã«â€Â©

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

## Ã«Â©â€Ã«ÂªÂ¨Ã«Â¦Â¬ Ã«Â°Â Ã¬â€žÂ±Ã«Å Â¥

### Ã­ÂÂ¬ÃªÂ¸Â°Ã«Â¥Â¼ Ã¬â€¢Å’ Ã«â€¢Å’ Ã¬Å Â¬Ã«ÂÂ¼Ã¬ÂÂ´Ã¬Å Â¤ Ã«Â¯Â¸Ã«Â¦Â¬ Ã­â€¢Â Ã«â€¹Â¹

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

### Ã«Â¹Ë†Ã«Â²Ë†Ã­â€¢Å“ Ã­â€¢Â Ã«â€¹Â¹Ã¬â€”Â sync.Pool Ã¬â€šÂ¬Ã¬Å¡Â©

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
    out := append([]byte(nil), buf.Bytes()...)
    return out
}
```

### Ã«Â£Â¨Ã­â€â€žÃ¬â€”ÂÃ¬â€žÅ“ Ã«Â¬Â¸Ã¬Å¾ÂÃ¬â€”Â´ Ã¬â€”Â°ÃªÂ²Â° Ã­â€Â¼Ã­â€¢ËœÃªÂ¸Â°

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

## Go Ã«Ââ€žÃªÂµÂ¬ Ã­â€ ÂµÃ­â€¢Â©

### Ã­â€¢â€žÃ¬Ë†Ëœ Ã«Âªâ€¦Ã«Â Â¹Ã¬â€“Â´

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

### ÃªÂ¶Å’Ã¬Å¾Â¥ Ã«Â¦Â°Ã­â€žÂ° ÃªÂµÂ¬Ã¬â€žÂ± (.golangci.yml)

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

## Ã«Â¹Â Ã«Â¥Â¸ Ã¬Â°Â¸Ã¬Â¡Â°: Go ÃªÂ´â‚¬Ã¬Å¡Â©ÃªÂµÂ¬

| ÃªÂ´â‚¬Ã¬Å¡Â©ÃªÂµÂ¬ | Ã¬â€žÂ¤Ã«Âªâ€¦ |
|-------|-------------|
| Accept interfaces, return structs | Ã­â€¢Â¨Ã¬Ë†ËœÃ«Å â€ Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤ Ã«Â§Â¤ÃªÂ°Å“Ã«Â³â‚¬Ã¬Ë†ËœÃ«Â¥Â¼ Ã«Â°â€ºÃªÂ³Â  ÃªÂµÂ¬Ã¬Â²Â´Ã¬Â Â Ã­Æ’â‚¬Ã¬Å¾â€¦Ã¬Ââ€ž Ã«Â°ËœÃ­â„¢Ëœ |
| Errors are values | Ã¬â€”ÂÃ«Å¸Â¬Ã«Â¥Â¼ Ã¬ËœË†Ã¬â„¢Â¸ÃªÂ°â‚¬ Ã¬â€¢â€žÃ«â€¹Å’ Ã¬ÂÂ¼ÃªÂ¸â€° ÃªÂ°â€™Ã¬Å“Â¼Ã«Â¡Å“ Ã¬Â·Â¨ÃªÂ¸â€° |
| Don't communicate by sharing memory | ÃªÂ³Â Ã«Â£Â¨Ã­â€¹Â´ ÃªÂ°â€ž Ã¬Â¡Â°Ã¬Å“Â¨Ã¬â€”Â Ã¬Â±â€žÃ«â€žÂ Ã¬â€šÂ¬Ã¬Å¡Â© |
| Make the zero value useful | Ã­Æ’â‚¬Ã¬Å¾â€¦Ã¬ÂÂ´ Ã«Âªâ€¦Ã¬â€¹Å“Ã¬Â Â Ã¬Â´Ë†ÃªÂ¸Â°Ã­â„¢â€ Ã¬â€”â€ Ã¬ÂÂ´ Ã¬Å¾â€˜Ã«Ââ„¢Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â¨ |
| A little copying is better than a little dependency | Ã«Â¶Ë†Ã­â€¢â€žÃ¬Å¡â€Ã­â€¢Å“ Ã¬â„¢Â¸Ã«Â¶â‚¬ Ã¬ÂËœÃ¬Â¡Â´Ã¬â€žÂ± Ã­â€Â¼Ã­â€¢ËœÃªÂ¸Â° |
| Clear is better than clever | Ã¬ËœÂÃ«Â¦Â¬Ã­â€¢Â¨Ã«Â³Â´Ã«â€¹Â¤ ÃªÂ°â‚¬Ã«Ââ€¦Ã¬â€žÂ± Ã¬Å¡Â°Ã¬â€žÂ  |
| gofmt is no one's favorite but everyone's friend | Ã­â€¢Â­Ã¬Æ’Â gofmt/goimportsÃ«Â¡Å“ Ã­ÂÂ¬Ã«Â§Â·Ã­Å’â€¦ |
| Return early | Ã¬â€”ÂÃ«Å¸Â¬Ã«Â¥Â¼ Ã«Â¨Â¼Ã¬Â â‚¬ Ã¬Â²ËœÃ«Â¦Â¬Ã­â€¢ËœÃªÂ³Â  Ã¬Â â€¢Ã¬Æ’Â ÃªÂ²Â½Ã«Â¡Å“Ã«Å â€ Ã«â€œÂ¤Ã¬â€”Â¬Ã¬â€œÂ°ÃªÂ¸Â° Ã¬â€”â€ Ã¬ÂÂ´ Ã¬Å“Â Ã¬Â§â‚¬ |

## Ã­â€Â¼Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â  Ã¬â€¢Ë†Ã­â€¹Â°Ã­Å’Â¨Ã­â€žÂ´

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

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: Go Ã¬Â½â€Ã«â€œÅ“Ã«Å â€ Ã¬ÂµÅ“ÃªÂ³Â Ã¬ÂËœ Ã¬ÂËœÃ«Â¯Â¸Ã¬â€”ÂÃ¬â€žÅ“ Ã¬Â§â‚¬Ã«Â£Â¨Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤ - Ã¬ËœË†Ã¬Â¸Â¡ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ³Â , Ã¬ÂÂ¼ÃªÂ´â‚¬Ã¬Â ÂÃ¬ÂÂ´Ã«Â©Â°, Ã¬ÂÂ´Ã­â€¢Â´Ã­â€¢ËœÃªÂ¸Â° Ã¬â€°Â½ÃªÂ²Å’. Ã¬ÂËœÃ¬â€¹Â¬Ã¬Å Â¤Ã«Å¸Â¬Ã¬Å¡Â¸ Ã«â€¢Å’Ã«Å â€ Ã«â€¹Â¨Ã¬Ë†Å“Ã­â€¢ËœÃªÂ²Å’ Ã¬Å“Â Ã¬Â§â‚¬Ã­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.
