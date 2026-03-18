---
name: python-patterns
description: Pythonic Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢Ã£â‚¬ÂPEP 8 Ã¦Â â€¡Ã¥â€¡â€ Ã£â‚¬ÂÃ§Â±Â»Ã¥Å¾â€¹Ã¦ÂÂÃ§Â¤ÂºÃ¤Â»Â¥Ã¥ÂÅ Ã¦Å¾â€žÃ¥Â»ÂºÃ§Â¨Â³Ã¥ÂÂ¥Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã¤Â¸â€Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã§Å¡â€ž Python Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# Python Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã¥â€™Å’Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Æ’Â¯Ã§â€Â¨ Python Ã¦Â¨Â¡Ã¥Â¼ÂÃ¤Â¸Å½Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Python Ã¤Â»Â£Ã§Â Â
* Ã¥Â®Â¡Ã¦Å¸Â¥ Python Ã¤Â»Â£Ã§Â Â
* Ã©â€¡ÂÃ¦Å¾â€žÃ§Å½Â°Ã¦Å“â€°Ã§Å¡â€ž Python Ã¤Â»Â£Ã§Â Â
* Ã¨Â®Â¾Ã¨Â®Â¡ Python Ã¥Å’â€¦/Ã¦Â¨Â¡Ã¥Ââ€”

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Å½Å¸Ã¥Ë†â„¢

### 1. Ã¥ÂÂ¯Ã¨Â¯Â»Ã¦â‚¬Â§Ã¥Â¾Ë†Ã©â€¡ÂÃ¨Â¦Â

Python Ã¤Â¼ËœÃ¥â€¦Ë†Ã¨â‚¬Æ’Ã¨â„¢â€˜Ã¥ÂÂ¯Ã¨Â¯Â»Ã¦â‚¬Â§Ã£â‚¬â€šÃ¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¦Â¸â€¦Ã¦â„¢Â°Ã¤Â¸â€Ã¦Ëœâ€œÃ¤ÂºÅ½Ã§Ââ€ Ã¨Â§Â£Ã£â‚¬â€š

```python
# Good: Clear and readable
def get_active_users(users: list[User]) -> list[User]:
    """Return only active users from the provided list."""
    return [user for user in users if user.is_active]


# Bad: Clever but confusing
def get_active_users(u):
    return [x for x in u if x.a]
```

### 2. Ã¦ËœÂ¾Ã¥Â¼ÂÃ¤Â¼ËœÃ¤ÂºÅ½Ã©Å¡ÂÃ¥Â¼Â

Ã©ÂÂ¿Ã¥â€¦ÂÃ©Â­â€Ã¦Â³â€¢Ã¯Â¼â€ºÃ¦Â¸â€¦Ã¦â„¢Â°Ã¨Â¯Â´Ã¦ËœÅ½Ã¤Â½Â Ã§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ¥Å“Â¨Ã¥ÂÅ¡Ã¤Â»â‚¬Ã¤Â¹Ë†Ã£â‚¬â€š

```python
# Good: Explicit configuration
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Bad: Hidden side effects
import some_module
some_module.setup()  # What does this do?
```

### 3. EAFP - Ã¨Â¯Â·Ã¦Â±â€šÃ¥Â®Â½Ã¦Ââ€¢Ã¦Â¯â€Ã¨Â¯Â·Ã¦Â±â€šÃ¨Â®Â¸Ã¥ÂÂ¯Ã¦â€ºÂ´Ã¥Â®Â¹Ã¦Ëœâ€œ

Python Ã¥â‚¬Â¾Ã¥Ââ€˜Ã¤ÂºÅ½Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¼â€šÃ¥Â¸Â¸Ã¥Â¤â€žÃ§Ââ€ Ã¨â‚¬Å’Ã©ÂÅ¾Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦ÂÂ¡Ã¤Â»Â¶Ã£â‚¬â€š

```python
# Good: EAFP style
def get_value(dictionary: dict, key: str) -> Any:
    try:
        return dictionary[key]
    except KeyError:
        return default_value

# Bad: LBYL (Look Before You Leap) style
def get_value(dictionary: dict, key: str) -> Any:
    if key in dictionary:
        return dictionary[key]
    else:
        return default_value
```

## Ã§Â±Â»Ã¥Å¾â€¹Ã¦ÂÂÃ§Â¤Âº

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã§Â±Â»Ã¥Å¾â€¹Ã¦Â³Â¨Ã¨Â§Â£

```python
from typing import Optional, List, Dict, Any

def process_user(
    user_id: str,
    data: Dict[str, Any],
    active: bool = True
) -> Optional[User]:
    """Process a user and return the updated User or None."""
    if not active:
        return None
    return User(user_id, data)
```

### Ã§Å½Â°Ã¤Â»Â£Ã§Â±Â»Ã¥Å¾â€¹Ã¦ÂÂÃ§Â¤ÂºÃ¯Â¼Ë†Python 3.9+Ã¯Â¼â€°

```python
# Python 3.9+ - Use built-in types
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Python 3.8 and earlier - Use typing module
from typing import List, Dict

def process_items(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}
```

### Ã§Â±Â»Ã¥Å¾â€¹Ã¥Ë†Â«Ã¥ÂÂÃ¥â€™Å’ TypeVar

```python
from typing import TypeVar, Union

# Type alias for complex types
JSON = Union[dict[str, Any], list[Any], str, int, float, bool, None]

def parse_json(data: str) -> JSON:
    return json.loads(data)

# Generic types
T = TypeVar('T')

def first(items: list[T]) -> T | None:
    """Return the first item or None if list is empty."""
    return items[0] if items else None
```

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥ÂÂÃ¨Â®Â®Ã§Å¡â€žÃ©Â¸Â­Ã¥Â­ÂÃ§Â±Â»Ã¥Å¾â€¹

```python
from typing import Protocol

class Renderable(Protocol):
    def render(self) -> str:
        """Render the object to a string."""

def render_all(items: list[Renderable]) -> str:
    """Render all items that implement the Renderable protocol."""
    return "\n".join(item.render() for item in items)
```

## Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Ã§â€°Â¹Ã¥Â®Å¡Ã¥Â¼â€šÃ¥Â¸Â¸Ã¥Â¤â€žÃ§Ââ€ 

```python
# Good: Catch specific exceptions
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except FileNotFoundError as e:
        raise ConfigError(f"Config file not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid JSON in config: {path}") from e

# Bad: Bare except
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except:
        return None  # Silent failure!
```

### Ã¥Â¼â€šÃ¥Â¸Â¸Ã©â€œÂ¾

```python
def process_data(data: str) -> Result:
    try:
        parsed = json.loads(data)
    except json.JSONDecodeError as e:
        # Chain exceptions to preserve the traceback
        raise ValueError(f"Failed to parse data: {data}") from e
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¥Â¼â€šÃ¥Â¸Â¸Ã¥Â±â€šÃ¦Â¬Â¡Ã§Â»â€œÃ¦Å¾â€ž

```python
class AppError(Exception):
    """Base exception for all application errors."""
    pass

class ValidationError(AppError):
    """Raised when input validation fails."""
    pass

class NotFoundError(AppError):
    """Raised when a requested resource is not found."""
    pass

# Usage
def get_user(user_id: str) -> User:
    user = db.find_user(user_id)
    if not user:
        raise NotFoundError(f"User not found: {user_id}")
    return user
```

## Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã§Â®Â¡Ã§Ââ€ Ã¥â„¢Â¨

### Ã¨Âµâ€žÃ¦ÂºÂÃ§Â®Â¡Ã§Ââ€ 

```python
# Good: Using context managers
def process_file(path: str) -> str:
    with open(path, 'r') as f:
        return f.read()

# Bad: Manual resource management
def process_file(path: str) -> str:
    f = open(path, 'r')
    try:
        return f.read()
    finally:
        f.close()
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã§Â®Â¡Ã§Ââ€ Ã¥â„¢Â¨

```python
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    """Context manager to time a block of code."""
    start = time.perf_counter()
    yield
    elapsed = time.perf_counter() - start
    print(f"{name} took {elapsed:.4f} seconds")

# Usage
with timer("data processing"):
    process_large_dataset()
```

### Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã§Â®Â¡Ã§Ââ€ Ã¥â„¢Â¨Ã§Â±Â»

```python
class DatabaseTransaction:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
        self.connection.begin_transaction()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.connection.commit()
        else:
            self.connection.rollback()
        return False  # Don't suppress exceptions

# Usage
with DatabaseTransaction(conn):
    user = conn.create_user(user_data)
    conn.create_profile(user.id, profile_data)
```

## Ã¦Å½Â¨Ã¥Â¯Â¼Ã¥Â¼ÂÃ¥â€™Å’Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨

### Ã¥Ë†â€”Ã¨Â¡Â¨Ã¦Å½Â¨Ã¥Â¯Â¼Ã¥Â¼Â

```python
# Good: List comprehension for simple transformations
names = [user.name for user in users if user.is_active]

# Bad: Manual loop
names = []
for user in users:
    if user.is_active:
        names.append(user.name)

# Complex comprehensions should be expanded
# Bad: Too complex
result = [x * 2 for x in items if x > 0 if x % 2 == 0]

# Good: Use a generator function
def filter_and_transform(items: Iterable[int]) -> list[int]:
    result = []
    for x in items:
        if x > 0 and x % 2 == 0:
            result.append(x * 2)
    return result
```

### Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼Â

```python
# Good: Generator for lazy evaluation
total = sum(x * x for x in range(1_000_000))

# Bad: Creates large intermediate list
total = sum([x * x for x in range(1_000_000)])
```

### Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨Ã¥â€¡Â½Ã¦â€¢Â°

```python
def read_large_file(path: str) -> Iterator[str]:
    """Read a large file line by line."""
    with open(path) as f:
        for line in f:
            yield line.strip()

# Usage
for line in read_large_file("huge.txt"):
    process(line)
```

## Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¥â€™Å’Ã¥â€˜Â½Ã¥ÂÂÃ¥â€¦Æ’Ã§Â»â€ž

### Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class User:
    """User entity with automatic __init__, __repr__, and __eq__."""
    id: str
    name: str
    email: str
    created_at: datetime = field(default_factory=datetime.now)
    is_active: bool = True

# Usage
user = User(
    id="123",
    name="Alice",
    email="alice@example.com"
)
```

### Ã¥Â¸Â¦Ã©ÂªÅ’Ã¨Â¯ÂÃ§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»

```python
@dataclass
class User:
    email: str
    age: int

    def __post_init__(self):
        # Validate email format
        if "@" not in self.email:
            raise ValueError(f"Invalid email: {self.email}")
        # Validate age range
        if self.age < 0 or self.age > 150:
            raise ValueError(f"Invalid age: {self.age}")
```

### Ã¥â€˜Â½Ã¥ÂÂÃ¥â€¦Æ’Ã§Â»â€ž

```python
from typing import NamedTuple

class Point(NamedTuple):
    """Immutable 2D point."""
    x: float
    y: float

    def distance(self, other: 'Point') -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

# Usage
p1 = Point(0, 0)
p2 = Point(3, 4)
print(p1.distance(p2))  # 5.0
```

## Ã¨Â£â€¦Ã©Â¥Â°Ã¥â„¢Â¨

### Ã¥â€¡Â½Ã¦â€¢Â°Ã¨Â£â€¦Ã©Â¥Â°Ã¥â„¢Â¨

```python
import functools
import time

def timer(func: Callable) -> Callable:
    """Decorator to time function execution."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

# slow_function() prints: slow_function took 1.0012s
```

### Ã¥Ââ€šÃ¦â€¢Â°Ã¥Å’â€“Ã¨Â£â€¦Ã©Â¥Â°Ã¥â„¢Â¨

```python
def repeat(times: int):
    """Decorator to repeat a function multiple times."""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

@repeat(times=3)
def greet(name: str) -> str:
    return f"Hello, {name}!"

# greet("Alice") returns ["Hello, Alice!", "Hello, Alice!", "Hello, Alice!"]
```

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã§Â±Â»Ã§Å¡â€žÃ¨Â£â€¦Ã©Â¥Â°Ã¥â„¢Â¨

```python
class CountCalls:
    """Decorator that counts how many times a function is called."""
    def __init__(self, func: Callable):
        functools.update_wrapper(self, func)
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} has been called {self.count} times")
        return self.func(*args, **kwargs)

@CountCalls
def process():
    pass

# Each call to process() prints the call count
```

## Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

### Ã§â€Â¨Ã¤ÂºÅ½ I/O Ã¥Â¯â€ Ã©â€ºâ€ Ã¥Å¾â€¹Ã¤Â»Â»Ã¥Å Â¡Ã§Å¡â€žÃ§ÂºÂ¿Ã§Â¨â€¹

```python
import concurrent.futures
import threading

def fetch_url(url: str) -> str:
    """Fetch a URL (I/O-bound operation)."""
    import urllib.request
    with urllib.request.urlopen(url) as response:
        return response.read().decode()

def fetch_all_urls(urls: list[str]) -> dict[str, str]:
    """Fetch multiple URLs concurrently using threads."""
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = {executor.submit(fetch_url, url): url for url in urls}
        results = {}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                results[url] = future.result()
            except Exception as e:
                results[url] = f"Error: {e}"
    return results
```

### Ã§â€Â¨Ã¤ÂºÅ½ CPU Ã¥Â¯â€ Ã©â€ºâ€ Ã¥Å¾â€¹Ã¤Â»Â»Ã¥Å Â¡Ã§Å¡â€žÃ¥Â¤Å¡Ã¨Â¿â€ºÃ§Â¨â€¹

```python
def process_data(data: list[int]) -> int:
    """CPU-intensive computation."""
    return sum(x ** 2 for x in data)

def process_all(datasets: list[list[int]]) -> list[int]:
    """Process multiple datasets using multiple processes."""
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(process_data, datasets))
    return results
```

### Ã§â€Â¨Ã¤ÂºÅ½Ã¥Â¹Â¶Ã¥Ââ€˜ I/O Ã§Å¡â€žÃ¥Â¼â€šÃ¦Â­Â¥/Ã§Â­â€°Ã¥Â¾â€¦

```python
import asyncio

async def fetch_async(url: str) -> str:
    """Fetch a URL asynchronously."""
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def fetch_all(urls: list[str]) -> dict[str, str]:
    """Fetch multiple URLs concurrently."""
    tasks = [fetch_async(url) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return dict(zip(urls, results))
```

## Ã¥Å’â€¦Ã§Â»â€žÃ§Â»â€¡

### Ã¦Â â€¡Ã¥â€¡â€ Ã©Â¡Â¹Ã§â€ºÂ®Ã¥Â¸Æ’Ã¥Â±â‚¬

```
myproject/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ src/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ mypackage/
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ __init__.py
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ main.py
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ api/
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ __init__.py
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ routes.py
Ã¢â€â€š       Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ models/
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ __init__.py
Ã¢â€â€š       Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ user.py
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ utils/
Ã¢â€â€š           Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ __init__.py
Ã¢â€â€š           Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ helpers.py
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ tests/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ __init__.py
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ conftest.py
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ test_api.py
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ test_models.py
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ pyproject.toml
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ README.md
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ .gitignore
```

### Ã¥Â¯Â¼Ã¥â€¦Â¥Ã§ÂºÂ¦Ã¥Â®Å¡

```python
# Good: Import order - stdlib, third-party, local
import os
import sys
from pathlib import Path

import requests
from fastapi import FastAPI

from mypackage.models import User
from mypackage.utils import format_name

# Good: Use isort for automatic import sorting
# pip install isort
```

### **init**.py Ã§â€Â¨Ã¤ÂºÅ½Ã¥Å’â€¦Ã¥Â¯Â¼Ã¥â€¡Âº

```python
# mypackage/__init__.py
"""mypackage - A sample Python package."""

__version__ = "1.0.0"

# Export main classes/functions at package level
from mypackage.models import User, Post
from mypackage.utils import format_name

__all__ = ["User", "Post", "format_name"]
```

## Ã¥â€ â€¦Ã¥Â­ËœÃ¥â€™Å’Ã¦â‚¬Â§Ã¨Æ’Â½

### Ã¤Â½Â¿Ã§â€Â¨ **slots** Ã¦ÂÂÃ©Â«ËœÃ¥â€ â€¦Ã¥Â­ËœÃ¦â€¢Ë†Ã§Å½â€¡

```python
# Bad: Regular class uses __dict__ (more memory)
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# Good: __slots__ reduces memory usage
class Point:
    __slots__ = ['x', 'y']

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

### Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨Ã§â€Â¨Ã¤ÂºÅ½Ã¥Â¤Â§Ã¦â€¢Â°Ã¦ÂÂ®

```python
# Bad: Returns full list in memory
def read_lines(path: str) -> list[str]:
    with open(path) as f:
        return [line.strip() for line in f]

# Good: Yields lines one at a time
def read_lines(path: str) -> Iterator[str]:
    with open(path) as f:
        for line in f:
            yield line.strip()
```

### Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã¥Â¾ÂªÃ§Å½Â¯Ã¤Â¸Â­Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¦â€¹Â¼Ã¦Å½Â¥

```python
# Bad: O(nÃ‚Â²) due to string immutability
result = ""
for item in items:
    result += str(item)

# Good: O(n) using join
result = "".join(str(item) for item in items)

# Good: Using StringIO for building
from io import StringIO

buffer = StringIO()
for item in items:
    buffer.write(str(item))
result = buffer.getvalue()
```

## Python Ã¥Â·Â¥Ã¥â€¦Â·Ã©â€ºâ€ Ã¦Ë†Â

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¥â€˜Â½Ã¤Â»Â¤

```bash
# Code formatting
black .
isort .

# Linting
ruff check .
pylint mypackage/

# Type checking
mypy .

# Testing
pytest --cov=mypackage --cov-report=html

# Security scanning
bandit -r .

# Dependency management
pip-audit
safety check
```

### pyproject.toml Ã©â€¦ÂÃ§Â½Â®

```toml
[project]
name = "mypackage"
version = "1.0.0"
requires-python = ">=3.9"
dependencies = [
    "requests>=2.31.0",
    "pydantic>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.5.0",
]

[tool.black]
line-length = 88
target-version = ['py39']

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "N", "W"]

[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=mypackage --cov-report=term-missing"
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’Ã¯Â¼Å¡Python Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢

| Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢ | Ã¦ÂÂÃ¨Â¿Â° |
|-------|-------------|
| EAFP | Ã¨Â¯Â·Ã¦Â±â€šÃ¥Â®Â½Ã¦Ââ€¢Ã¦Â¯â€Ã¨Â¯Â·Ã¦Â±â€šÃ¨Â®Â¸Ã¥ÂÂ¯Ã¦â€ºÂ´Ã¥Â®Â¹Ã¦Ëœâ€œ |
| Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã§Â®Â¡Ã§Ââ€ Ã¥â„¢Â¨ | Ã¤Â½Â¿Ã§â€Â¨ `with` Ã¨Â¿â€ºÃ¨Â¡Å’Ã¨Âµâ€žÃ¦ÂºÂÃ§Â®Â¡Ã§Ââ€  |
| Ã¥Ë†â€”Ã¨Â¡Â¨Ã¦Å½Â¨Ã¥Â¯Â¼Ã¥Â¼Â | Ã§â€Â¨Ã¤ÂºÅ½Ã§Â®â‚¬Ã¥Ââ€¢Ã§Å¡â€žÃ¨Â½Â¬Ã¦ÂÂ¢ |
| Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨ | Ã§â€Â¨Ã¤ÂºÅ½Ã¦Æ’Â°Ã¦â‚¬Â§Ã¦Â±â€šÃ¥â‚¬Â¼Ã¥â€™Å’Ã¥Â¤Â§Ã¦â€¢Â°Ã¦ÂÂ®Ã©â€ºâ€  |
| Ã§Â±Â»Ã¥Å¾â€¹Ã¦ÂÂÃ§Â¤Âº | Ã¦Â³Â¨Ã¨Â§Â£Ã¥â€¡Â½Ã¦â€¢Â°Ã§Â­Â¾Ã¥ÂÂ |
| Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â» | Ã§â€Â¨Ã¤ÂºÅ½Ã¥â€¦Â·Ã¦Å“â€°Ã¨â€¡ÂªÃ¥Å Â¨Ã§â€Å¸Ã¦Ë†ÂÃ¦â€“Â¹Ã¦Â³â€¢Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Â®Â¹Ã¥â„¢Â¨ |
| `__slots__` | Ã§â€Â¨Ã¤ÂºÅ½Ã¥â€ â€¦Ã¥Â­ËœÃ¤Â¼ËœÃ¥Å’â€“ |
| f-strings | Ã§â€Â¨Ã¤ÂºÅ½Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¦Â Â¼Ã¥Â¼ÂÃ¥Å’â€“Ã¯Â¼Ë†Python 3.6+Ã¯Â¼â€° |
| `pathlib.Path` | Ã§â€Â¨Ã¤ÂºÅ½Ã¨Â·Â¯Ã¥Â¾â€žÃ¦â€œÂÃ¤Â½Å“Ã¯Â¼Ë†Python 3.4+Ã¯Â¼â€° |
| `enumerate` | Ã§â€Â¨Ã¤ÂºÅ½Ã¥Â¾ÂªÃ§Å½Â¯Ã¤Â¸Â­Ã§Å¡â€žÃ§Â´Â¢Ã¥Â¼â€¢-Ã¥â€¦Æ’Ã§Â´Â Ã¥Â¯Â¹ |

## Ã¨Â¦ÂÃ©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

```python
# Bad: Mutable default arguments
def append_to(item, items=[]):
    items.append(item)
    return items

# Good: Use None and create new list
def append_to(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# Bad: Checking type with type()
if type(obj) == list:
    process(obj)

# Good: Use isinstance
if isinstance(obj, list):
    process(obj)

# Bad: Comparing to None with ==
if value == None:
    process()

# Good: Use is
if value is None:
    process()

# Bad: from module import *
from os.path import *

# Good: Explicit imports
from os.path import join, exists

# Bad: Bare except
try:
    risky_operation()
except:
    pass

# Good: Specific exception
try:
    risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
```

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Python Ã¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¥â€¦Â·Ã¦Å“â€°Ã¥ÂÂ¯Ã¨Â¯Â»Ã¦â‚¬Â§Ã£â‚¬ÂÃ¦ËœÂ¾Ã¥Â¼ÂÃ¦â‚¬Â§Ã¯Â¼Å’Ã¥Â¹Â¶Ã©ÂÂµÃ¥Â¾ÂªÃ¦Å“â‚¬Ã¥Â°ÂÃ¦â€žÂÃ¥Â¤â€“Ã¥Å½Å¸Ã¥Ë†â„¢Ã£â‚¬â€šÃ¥Â¦â€šÃ¦Å“â€°Ã§â€“â€˜Ã©â€”Â®Ã¯Â¼Å’Ã¤Â¼ËœÃ¥â€¦Ë†Ã¨â‚¬Æ’Ã¨â„¢â€˜Ã¦Â¸â€¦Ã¦â„¢Â°Ã¦â‚¬Â§Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥Â·Â§Ã¥Â¦â„¢Ã¦â‚¬Â§Ã£â‚¬â€š
