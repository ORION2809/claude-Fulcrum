---
name: golang-testing
description: Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬Â£Â¼Ã«Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸, Ã¬â€žÅ“Ã«Â¸Å’Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸, Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬, Ã­ÂÂ¼Ã¬Â§â€¢, Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã«Â¥Â¼ Ã­ÂÂ¬Ã­â€¢Â¨Ã­â€¢Å“ Go Ã­â€¦Å’Ã¬Å Â¤Ã­Å’â€¦ Ã­Å’Â¨Ã­â€žÂ´. ÃªÂ´â‚¬Ã¬Å¡Â©Ã¬Â Â Go ÃªÂ´â‚¬Ã­â€“â€°ÃªÂ³Â¼ Ã­â€¢Â¨ÃªÂ»Ëœ TDD Ã«Â°Â©Ã«Â²â€¢Ã«Â¡Â Ã¬Ââ€ž Ã«â€Â°Ã«Â¦â€¦Ã«â€¹Ë†Ã«â€¹Â¤.
origin: claude-fulcrum
---

# Go Ã­â€¦Å’Ã¬Å Â¤Ã­Å’â€¦ Ã­Å’Â¨Ã­â€žÂ´

TDD Ã«Â°Â©Ã«Â²â€¢Ã«Â¡Â Ã¬Ââ€ž Ã«â€Â°Ã«Â¥Â´Ã«Å â€ Ã¬â€¹Â Ã«Â¢Â°Ã­â€¢Â  Ã¬Ë†Ëœ Ã¬Å¾Ë†ÃªÂ³Â  Ã¬Å“Â Ã¬Â§â‚¬Ã«Â³Â´Ã¬Ë†Ëœ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Å¾â€˜Ã¬â€žÂ±Ã¬Ââ€ž Ã¬Å“â€žÃ­â€¢Å“ Ã­ÂÂ¬ÃªÂ´â€žÃ¬Â ÂÃ¬ÂÂ¸ Go Ã­â€¦Å’Ã¬Å Â¤Ã­Å’â€¦ Ã­Å’Â¨Ã­â€žÂ´.

## Ã­â„¢Å“Ã¬â€žÂ±Ã­â„¢â€ Ã¬â€¹Å“Ã¬Â Â

- Ã¬Æ’Ë†Ã«Â¡Å“Ã¬Å¡Â´ Go Ã­â€¢Â¨Ã¬Ë†ËœÃ«â€šËœ Ã«Â©â€Ã¬â€žÅ“Ã«â€œÅ“ Ã¬Å¾â€˜Ã¬â€žÂ± Ã¬â€¹Å“
- ÃªÂ¸Â°Ã¬Â¡Â´ Ã¬Â½â€Ã«â€œÅ“Ã¬â€”Â Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã¬Â¶â€ÃªÂ°â‚¬ Ã¬â€¹Å“
- Ã¬â€žÂ±Ã«Å Â¥Ã¬ÂÂ´ Ã¬Â¤â€˜Ã¬Å¡â€Ã­â€¢Å“ Ã¬Â½â€Ã«â€œÅ“Ã¬â€”Â Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬ Ã¬Æ’ÂÃ¬â€žÂ± Ã¬â€¹Å“
- Ã¬Å¾â€¦Ã«Â Â¥ Ã¬Å“Â Ã­Å¡Â¨Ã¬â€žÂ± ÃªÂ²â‚¬Ã¬â€šÂ¬Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Å“ Ã­ÂÂ¼Ã¬Â¦Ë† Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂµÂ¬Ã­Ëœâ€ž Ã¬â€¹Å“
- Go Ã­â€â€žÃ«Â¡Å“Ã¬Â ÂÃ­Å Â¸Ã¬â€”ÂÃ¬â€žÅ“ TDD Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â° Ã«â€Â°Ã«Â¥Â¼ Ã¬â€¹Å“

## GoÃ¬â€”ÂÃ¬â€žÅ“Ã¬ÂËœ TDD Ã¬â€ºÅ’Ã­ÂÂ¬Ã­â€Å’Ã«Â¡Å“Ã¬Å¡Â°

### RED-GREEN-REFACTOR Ã¬â€šÂ¬Ã¬ÂÂ´Ã­ÂÂ´

```
RED     Ã¢â€ â€™ Write a failing test first
GREEN   Ã¢â€ â€™ Write minimal code to pass the test
REFACTOR Ã¢â€ â€™ Improve code while keeping tests green
REPEAT  Ã¢â€ â€™ Continue with next requirement
```

### GoÃ¬â€”ÂÃ¬â€žÅ“Ã¬ÂËœ Ã«â€¹Â¨ÃªÂ³â€žÃ«Â³â€ž TDD

```go
// Step 1: Define the interface/signature
// calculator.go
package calculator

func Add(a, b int) int {
    panic("not implemented") // Placeholder
}

// Step 2: Write failing test (RED)
// calculator_test.go
package calculator

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}

// Step 3: Run test - verify FAIL
// $ go test
// --- FAIL: TestAdd (0.00s)
// panic: not implemented

// Step 4: Implement minimal code (GREEN)
func Add(a, b int) int {
    return a + b
}

// Step 5: Run test - verify PASS
// $ go test
// PASS

// Step 6: Refactor if needed, verify tests still pass
```

## Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬Â£Â¼Ã«Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

Go Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã¬ÂËœ Ã­â€˜Å“Ã¬Â¤â‚¬ Ã­Å’Â¨Ã­â€žÂ´. Ã¬ÂµÅ“Ã¬â€ Å’Ã­â€¢Å“Ã¬ÂËœ Ã¬Â½â€Ã«â€œÅ“Ã«Â¡Å“ Ã­ÂÂ¬ÃªÂ´â€žÃ¬Â ÂÃ¬ÂÂ¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã«Â¥Â¼ ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃªÂ²Å’ Ã­â€¢Â©Ã«â€¹Ë†Ã«â€¹Â¤.

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -2, -3},
        {"zero values", 0, 0, 0},
        {"mixed signs", -1, 1, 0},
        {"large numbers", 1000000, 2000000, 3000000},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

### Ã¬â€”ÂÃ«Å¸Â¬ Ã¬Â¼â‚¬Ã¬ÂÂ´Ã¬Å Â¤ÃªÂ°â‚¬ Ã¬Å¾Ë†Ã«Å â€ Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬Â£Â¼Ã«Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

```go
func TestParseConfig(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    *Config
        wantErr bool
    }{
        {
            name:  "valid config",
            input: `{"host": "localhost", "port": 8080}`,
            want:  &Config{Host: "localhost", Port: 8080},
        },
        {
            name:    "invalid JSON",
            input:   `{invalid}`,
            wantErr: true,
        },
        {
            name:    "empty input",
            input:   "",
            wantErr: true,
        },
        {
            name:  "minimal config",
            input: `{}`,
            want:  &Config{}, // Zero value config
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseConfig(tt.input)

            if tt.wantErr {
                if err == nil {
                    t.Error("expected error, got nil")
                }
                return
            }

            if err != nil {
                t.Fatalf("unexpected error: %v", err)
            }

            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("got %+v; want %+v", got, tt.want)
            }
        })
    }
}
```

## Ã¬â€žÅ“Ã«Â¸Å’Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã«Â°Â Ã¬â€žÅ“Ã«Â¸Å’Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬

### ÃªÂ´â‚¬Ã«Â Â¨ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ ÃªÂµÂ¬Ã¬â€žÂ±

```go
func TestUser(t *testing.T) {
    // Setup shared by all subtests
    db := setupTestDB(t)

    t.Run("Create", func(t *testing.T) {
        user := &User{Name: "Alice"}
        err := db.CreateUser(user)
        if err != nil {
            t.Fatalf("CreateUser failed: %v", err)
        }
        if user.ID == "" {
            t.Error("expected user ID to be set")
        }
    })

    t.Run("Get", func(t *testing.T) {
        user, err := db.GetUser("alice-id")
        if err != nil {
            t.Fatalf("GetUser failed: %v", err)
        }
        if user.Name != "Alice" {
            t.Errorf("got name %q; want %q", user.Name, "Alice")
        }
    })

    t.Run("Update", func(t *testing.T) {
        // ...
    })

    t.Run("Delete", func(t *testing.T) {
        // ...
    })
}
```

### Ã«Â³â€˜Ã«Â Â¬ Ã¬â€žÅ“Ã«Â¸Å’Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

```go
func TestParallel(t *testing.T) {
    tests := []struct {
        name  string
        input string
    }{
        {"case1", "input1"},
        {"case2", "input2"},
        {"case3", "input3"},
    }

    for _, tt := range tests {
        tt := tt // Capture range variable
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // Run subtests in parallel
            result := Process(tt.input)
            // assertions...
            _ = result
        })
    }
}
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã­â€”Â¬Ã­ÂÂ¼

### Ã­â€”Â¬Ã­ÂÂ¼ Ã­â€¢Â¨Ã¬Ë†Ëœ

```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper() // Marks this as a helper function

    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("failed to open database: %v", err)
    }

    // Cleanup when test finishes
    t.Cleanup(func() {
        db.Close()
    })

    // Run migrations
    if _, err := db.Exec(schema); err != nil {
        t.Fatalf("failed to create schema: %v", err)
    }

    return db
}

func assertNoError(t *testing.T, err error) {
    t.Helper()
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
}

func assertEqual[T comparable](t *testing.T, got, want T) {
    t.Helper()
    if got != want {
        t.Errorf("got %v; want %v", got, want)
    }
}
```

### Ã¬Å¾â€žÃ¬â€¹Å“ Ã­Å’Å’Ã¬ÂÂ¼ Ã«Â°Â Ã«â€â€Ã«Â â€°Ã­â€žÂ°Ã«Â¦Â¬

```go
func TestFileProcessing(t *testing.T) {
    // Create temp directory - automatically cleaned up
    tmpDir := t.TempDir()

    // Create test file
    testFile := filepath.Join(tmpDir, "test.txt")
    err := os.WriteFile(testFile, []byte("test content"), 0644)
    if err != nil {
        t.Fatalf("failed to create test file: %v", err)
    }

    // Run test
    result, err := ProcessFile(testFile)
    if err != nil {
        t.Fatalf("ProcessFile failed: %v", err)
    }

    // Assert...
    _ = result
}
```

## ÃªÂ³Â¨Ã«â€œÂ  Ã­Å’Å’Ã¬ÂÂ¼

`testdata/`Ã¬â€”Â Ã¬Â â‚¬Ã¬Å¾Â¥Ã«ÂÅ“ Ã¬ËœË†Ã¬Æ’Â Ã¬Â¶Å“Ã«Â Â¥ Ã­Å’Å’Ã¬ÂÂ¼Ã¬â€”Â Ã«Å’â‚¬Ã­â€¢Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸.

```go
var update = flag.Bool("update", false, "update golden files")

func TestRender(t *testing.T) {
    tests := []struct {
        name  string
        input Template
    }{
        {"simple", Template{Name: "test"}},
        {"complex", Template{Name: "test", Items: []string{"a", "b"}}},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Render(tt.input)

            golden := filepath.Join("testdata", tt.name+".golden")

            if *update {
                // Update golden file: go test -update
                err := os.WriteFile(golden, got, 0644)
                if err != nil {
                    t.Fatalf("failed to update golden file: %v", err)
                }
            }

            want, err := os.ReadFile(golden)
            if err != nil {
                t.Fatalf("failed to read golden file: %v", err)
            }

            if !bytes.Equal(got, want) {
                t.Errorf("output mismatch:\ngot:\n%s\nwant:\n%s", got, want)
            }
        })
    }
}
```

## Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤Ã«Â¥Â¼ Ã¬â€šÂ¬Ã¬Å¡Â©Ã­â€¢Å“ Ã«ÂªÂ¨Ã­â€šÂ¹

### Ã¬ÂÂ¸Ã­â€žÂ°Ã­Å½ËœÃ¬ÂÂ´Ã¬Å Â¤ ÃªÂ¸Â°Ã«Â°Ëœ Ã«ÂªÂ¨Ã­â€šÂ¹

```go
// Define interface for dependencies
type UserRepository interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}

// Production implementation
type PostgresUserRepository struct {
    db *sql.DB
}

func (r *PostgresUserRepository) GetUser(id string) (*User, error) {
    // Real database query
}

// Mock implementation for tests
type MockUserRepository struct {
    GetUserFunc  func(id string) (*User, error)
    SaveUserFunc func(user *User) error
}

func (m *MockUserRepository) GetUser(id string) (*User, error) {
    return m.GetUserFunc(id)
}

func (m *MockUserRepository) SaveUser(user *User) error {
    return m.SaveUserFunc(user)
}

// Test using mock
func TestUserService(t *testing.T) {
    mock := &MockUserRepository{
        GetUserFunc: func(id string) (*User, error) {
            if id == "123" {
                return &User{ID: "123", Name: "Alice"}, nil
            }
            return nil, ErrNotFound
        },
    }

    service := NewUserService(mock)

    user, err := service.GetUserProfile("123")
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if user.Name != "Alice" {
        t.Errorf("got name %q; want %q", user.Name, "Alice")
    }
}
```

## Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬

### ÃªÂ¸Â°Ã«Â³Â¸ Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬

```go
func BenchmarkProcess(b *testing.B) {
    data := generateTestData(1000)
    b.ResetTimer() // Don't count setup time

    for i := 0; i < b.N; i++ {
        Process(data)
    }
}

// Run: go test -bench=BenchmarkProcess -benchmem
// Output: BenchmarkProcess-8   10000   105234 ns/op   4096 B/op   10 allocs/op
```

### Ã«â€¹Â¤Ã¬â€“â€˜Ã­â€¢Å“ Ã­ÂÂ¬ÃªÂ¸Â°Ã¬ÂËœ Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬

```go
func BenchmarkSort(b *testing.B) {
    sizes := []int{100, 1000, 10000, 100000}

    for _, size := range sizes {
        b.Run(fmt.Sprintf("size=%d", size), func(b *testing.B) {
            data := generateRandomSlice(size)
            b.ResetTimer()

            for i := 0; i < b.N; i++ {
                // Make a copy to avoid sorting already sorted data
                tmp := make([]int, len(data))
                copy(tmp, data)
                sort.Ints(tmp)
            }
        })
    }
}
```

### Ã«Â©â€Ã«ÂªÂ¨Ã«Â¦Â¬ Ã­â€¢Â Ã«â€¹Â¹ Ã«Â²Â¤Ã¬Â¹ËœÃ«Â§Ë†Ã­ÂÂ¬

```go
func BenchmarkStringConcat(b *testing.B) {
    parts := []string{"hello", "world", "foo", "bar", "baz"}

    b.Run("plus", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var s string
            for _, p := range parts {
                s += p
            }
            _ = s
        }
    })

    b.Run("builder", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            var sb strings.Builder
            for _, p := range parts {
                sb.WriteString(p)
            }
            _ = sb.String()
        }
    })

    b.Run("join", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
            _ = strings.Join(parts, "")
        }
    })
}
```

## Ã­ÂÂ¼Ã¬Â§â€¢ (Go 1.18+)

### ÃªÂ¸Â°Ã«Â³Â¸ Ã­ÂÂ¼Ã¬Â¦Ë† Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

```go
func FuzzParseJSON(f *testing.F) {
    // Add seed corpus
    f.Add(`{"name": "test"}`)
    f.Add(`{"count": 123}`)
    f.Add(`[]`)
    f.Add(`""`)

    f.Fuzz(func(t *testing.T, input string) {
        var result map[string]interface{}
        err := json.Unmarshal([]byte(input), &result)

        if err != nil {
            // Invalid JSON is expected for random input
            return
        }

        // If parsing succeeded, re-encoding should work
        _, err = json.Marshal(result)
        if err != nil {
            t.Errorf("Marshal failed after successful Unmarshal: %v", err)
        }
    })
}

// Run: go test -fuzz=FuzzParseJSON -fuzztime=30s
```

### Ã«â€¹Â¤Ã¬Â¤â€˜ Ã¬Å¾â€¦Ã«Â Â¥ Ã­ÂÂ¼Ã¬Â¦Ë† Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸

```go
func FuzzCompare(f *testing.F) {
    f.Add("hello", "world")
    f.Add("", "")
    f.Add("abc", "abc")

    f.Fuzz(func(t *testing.T, a, b string) {
        result := Compare(a, b)

        // Property: Compare(a, a) should always equal 0
        if a == b && result != 0 {
            t.Errorf("Compare(%q, %q) = %d; want 0", a, b, result)
        }

        // Property: Compare(a, b) and Compare(b, a) should have opposite signs
        reverse := Compare(b, a)
        if (result > 0 && reverse >= 0) || (result < 0 && reverse <= 0) {
            if result != 0 || reverse != 0 {
                t.Errorf("Compare(%q, %q) = %d, Compare(%q, %q) = %d; inconsistent",
                    a, b, result, b, a, reverse)
            }
        }
    })
}
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬

### Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã¬â€¹Â¤Ã­â€“â€°

```bash
# Basic coverage
go test -cover ./...

# Generate coverage profile
go test -coverprofile=coverage.out ./...

# View coverage in browser
go tool cover -html=coverage.out

# View coverage by function
go tool cover -func=coverage.out

# Coverage with race detection
go test -race -coverprofile=coverage.out ./...
```

### Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬ Ã«ÂªÂ©Ã­â€˜Å“

| Ã¬Â½â€Ã«â€œÅ“ Ã¬Å“Â Ã­Ëœâ€¢ | Ã«ÂªÂ©Ã­â€˜Å“ |
|-----------|--------|
| Ã­â€¢ÂµÃ¬â€¹Â¬ Ã«Â¹â€žÃ¬Â¦Ë†Ã«â€¹Ë†Ã¬Å Â¤ Ã«Â¡Å“Ã¬Â§Â | 100% |
| ÃªÂ³ÂµÃªÂ°Å“ API | 90%+ |
| Ã¬ÂÂ¼Ã«Â°Ëœ Ã¬Â½â€Ã«â€œÅ“ | 80%+ |
| Ã¬Æ’ÂÃ¬â€žÂ±Ã«ÂÅ“ Ã¬Â½â€Ã«â€œÅ“ | Ã¬Â Å“Ã¬â„¢Â¸ |

### Ã¬Æ’ÂÃ¬â€žÂ±Ã«ÂÅ“ Ã¬Â½â€Ã«â€œÅ“Ã«Â¥Â¼ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã¬â€”ÂÃ¬â€žÅ“ Ã¬Â Å“Ã¬â„¢Â¸

```go
//go:generate mockgen -source=interface.go -destination=mock_interface.go

// In coverage profile, exclude with build tags:
// go test -cover -tags=!generate ./...
```

## HTTP Ã­â€¢Â¸Ã«â€œÂ¤Ã«Å¸Â¬ Ã­â€¦Å’Ã¬Å Â¤Ã­Å’â€¦

```go
func TestHealthHandler(t *testing.T) {
    // Create request
    req := httptest.NewRequest(http.MethodGet, "/health", nil)
    w := httptest.NewRecorder()

    // Call handler
    HealthHandler(w, req)

    // Check response
    resp := w.Result()
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        t.Errorf("got status %d; want %d", resp.StatusCode, http.StatusOK)
    }

    body, _ := io.ReadAll(resp.Body)
    if string(body) != "OK" {
        t.Errorf("got body %q; want %q", body, "OK")
    }
}

func TestAPIHandler(t *testing.T) {
    tests := []struct {
        name       string
        method     string
        path       string
        body       string
        wantStatus int
        wantBody   string
    }{
        {
            name:       "get user",
            method:     http.MethodGet,
            path:       "/users/123",
            wantStatus: http.StatusOK,
            wantBody:   `{"id":"123","name":"Alice"}`,
        },
        {
            name:       "not found",
            method:     http.MethodGet,
            path:       "/users/999",
            wantStatus: http.StatusNotFound,
        },
        {
            name:       "create user",
            method:     http.MethodPost,
            path:       "/users",
            body:       `{"name":"Bob"}`,
            wantStatus: http.StatusCreated,
        },
    }

    handler := NewAPIHandler()

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            var body io.Reader
            if tt.body != "" {
                body = strings.NewReader(tt.body)
            }

            req := httptest.NewRequest(tt.method, tt.path, body)
            req.Header.Set("Content-Type", "application/json")
            w := httptest.NewRecorder()

            handler.ServeHTTP(w, req)

            if w.Code != tt.wantStatus {
                t.Errorf("got status %d; want %d", w.Code, tt.wantStatus)
            }

            if tt.wantBody != "" && w.Body.String() != tt.wantBody {
                t.Errorf("got body %q; want %q", w.Body.String(), tt.wantBody)
            }
        })
    }
}
```

## Ã­â€¦Å’Ã¬Å Â¤Ã­Å’â€¦ Ã«Âªâ€¦Ã«Â Â¹Ã¬â€“Â´

```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run specific test
go test -run TestAdd ./...

# Run tests matching pattern
go test -run "TestUser/Create" ./...

# Run tests with race detector
go test -race ./...

# Run tests with coverage
go test -cover -coverprofile=coverage.out ./...

# Run short tests only
go test -short ./...

# Run tests with timeout
go test -timeout 30s ./...

# Run benchmarks
go test -bench=. -benchmem ./...

# Run fuzzing
go test -fuzz=FuzzParse -fuzztime=30s ./...

# Count test runs (for flaky test detection)
go test -count=10 ./...
```

## Ã«ÂªÂ¨Ã«Â²â€ Ã¬â€šÂ¬Ã«Â¡â‚¬

**Ã­â€¢Â´Ã¬â€¢Â¼ Ã­â€¢Â  ÃªÂ²Æ’:**
- Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Â¥Â¼ Ã«Â¨Â¼Ã¬Â â‚¬ Ã¬Å¾â€˜Ã¬â€žÂ± (TDD)
- Ã­ÂÂ¬ÃªÂ´â€žÃ¬Â ÂÃ¬ÂÂ¸ Ã¬Â»Â¤Ã«Â²â€žÃ«Â¦Â¬Ã¬Â§â‚¬Ã«Â¥Â¼ Ã¬Å“â€žÃ­â€¢Â´ Ã­â€¦Å’Ã¬ÂÂ´Ã«Â¸â€ Ã¬Â£Â¼Ã«Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€šÂ¬Ã¬Å¡Â©
- ÃªÂµÂ¬Ã­Ëœâ€žÃ¬ÂÂ´ Ã¬â€¢â€žÃ«â€¹Å’ Ã«Ââ„¢Ã¬Å¾â€˜Ã¬Ââ€ž Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸
- Ã­â€”Â¬Ã­ÂÂ¼ Ã­â€¢Â¨Ã¬Ë†ËœÃ¬â€”ÂÃ¬â€žÅ“ `t.Helper()` Ã¬â€šÂ¬Ã¬Å¡Â©
- Ã«Ââ€¦Ã«Â¦Â½Ã¬Â ÂÃ¬ÂÂ¸ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã¬â€”Â `t.Parallel()` Ã¬â€šÂ¬Ã¬Å¡Â©
- `t.Cleanup()`Ã¬Å“Â¼Ã«Â¡Å“ Ã«Â¦Â¬Ã¬â€ Å’Ã¬Å Â¤ Ã¬Â â€¢Ã«Â¦Â¬
- Ã¬â€¹Å“Ã«â€šËœÃ«Â¦Â¬Ã¬ËœÂ¤Ã«Â¥Â¼ Ã¬â€žÂ¤Ã«Âªâ€¦Ã­â€¢ËœÃ«Å â€ Ã¬ÂËœÃ«Â¯Â¸ Ã¬Å¾Ë†Ã«Å â€ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬ÂÂ´Ã«Â¦â€ž Ã¬â€šÂ¬Ã¬Å¡Â©

**Ã­â€¢ËœÃ¬Â§â‚¬ Ã«Â§ÂÃ¬â€¢â€žÃ¬â€¢Â¼ Ã­â€¢Â  ÃªÂ²Æ’:**
- Ã«Â¹â€žÃªÂ³ÂµÃªÂ°Å“ Ã­â€¢Â¨Ã¬Ë†ËœÃ«Â¥Â¼ Ã¬Â§ÂÃ¬Â â€˜ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ (ÃªÂ³ÂµÃªÂ°Å“ APIÃ«Â¥Â¼ Ã­â€ ÂµÃ­â€¢Â´ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸)
- Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã¬â€”ÂÃ¬â€žÅ“ `time.Sleep()` Ã¬â€šÂ¬Ã¬Å¡Â© (Ã¬Â±â€žÃ«â€žÂÃ¬ÂÂ´Ã«â€šËœ Ã¬Â¡Â°ÃªÂ±Â´ Ã¬â€šÂ¬Ã¬Å¡Â©)
- Ã«Â¶Ë†Ã¬â€¢Ë†Ã¬Â â€¢Ã­â€¢Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã«Â¬Â´Ã¬â€¹Å“ (Ã¬Ë†ËœÃ¬Â â€¢Ã­â€¢ËœÃªÂ±Â°Ã«â€šËœ Ã¬Â Å“ÃªÂ±Â°)
- Ã«ÂªÂ¨Ã«â€œÂ  ÃªÂ²Æ’Ã¬Ââ€ž Ã«ÂªÂ¨Ã­â€šÂ¹ (ÃªÂ°â‚¬Ã«Å Â¥Ã­â€¢ËœÃ«Â©Â´ Ã­â€ ÂµÃ­â€¢Â© Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬â€žÂ Ã­ËœÂ¸)
- Ã¬â€”ÂÃ«Å¸Â¬ ÃªÂ²Â½Ã«Â¡Å“ Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸ Ã¬Æ’ÂÃ«Å¾Âµ

## CI/CD Ã­â€ ÂµÃ­â€¢Â©

```yaml
# GitHub Actions example
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
      with:
        go-version: '1.22'

    - name: Run tests
      run: go test -race -coverprofile=coverage.out ./...

    - name: Check coverage
      run: |
        go tool cover -func=coverage.out | grep total | awk '{print $3}' | \
        awk -F'%' '{if ($1 < 80) exit 1}'
```

**ÃªÂ¸Â°Ã¬â€“ÂµÃ­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€**: Ã­â€¦Å’Ã¬Å Â¤Ã­Å Â¸Ã«Å â€ Ã«Â¬Â¸Ã¬â€žÅ“Ã¬Å¾â€¦Ã«â€¹Ë†Ã«â€¹Â¤. Ã¬Â½â€Ã«â€œÅ“ÃªÂ°â‚¬ Ã¬â€“Â´Ã«â€“Â»ÃªÂ²Å’ Ã¬â€šÂ¬Ã¬Å¡Â©Ã«ÂËœÃ¬â€“Â´Ã¬â€¢Â¼ Ã­â€¢ËœÃ«Å â€Ã¬Â§â‚¬Ã«Â¥Â¼ Ã«Â³Â´Ã¬â€”Â¬Ã¬Â¤ÂÃ«â€¹Ë†Ã«â€¹Â¤. Ã«Âªâ€¦Ã­â„¢â€¢Ã­â€¢ËœÃªÂ²Å’ Ã¬Å¾â€˜Ã¬â€žÂ±Ã­â€¢ËœÃªÂ³Â  Ã¬ÂµÅ“Ã¬â€¹Â  Ã¬Æ’ÂÃ­Æ’Å“Ã«Â¡Å“ Ã¬Å“Â Ã¬Â§â‚¬Ã­â€¢ËœÃ¬â€žÂ¸Ã¬Å¡â€.
