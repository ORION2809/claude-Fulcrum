---
name: cpp-testing
description: Ã¤Â»â€¦Ã§â€Â¨Ã¤ÂºÅ½Ã§Â¼â€“Ã¥â€ â„¢/Ã¦â€ºÂ´Ã¦â€“Â°/Ã¤Â¿Â®Ã¥Â¤ÂC++Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬ÂÃ©â€¦ÂÃ§Â½Â®GoogleTest/CTestÃ£â‚¬ÂÃ¨Â¯Å Ã¦â€“Â­Ã¥Â¤Â±Ã¨Â´Â¥Ã¦Ë†â€“Ã¤Â¸ÂÃ§Â¨Â³Ã¥Â®Å¡Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Å’Ã¦Ë†â€“Ã¦Â·Â»Ã¥Å Â Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡/Ã¦Â¶Ë†Ã¦Â¯â€™Ã¥â„¢Â¨Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã£â‚¬â€š
origin: claude-fulcrum
---

# C++ Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Ë†Ã¤Â»Â£Ã§Ââ€ Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼â€°

Ã©â€™Ë†Ã¥Â¯Â¹Ã§Å½Â°Ã¤Â»Â£ C++Ã¯Â¼Ë†C++17/20Ã¯Â¼â€°Ã§Å¡â€žÃ¤Â»Â£Ã§Ââ€ Ã¥Â¯Â¼Ã¥Ââ€˜Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ GoogleTest/GoogleMock Ã¥â€™Å’ CMake/CTestÃ£â‚¬â€š

## Ã¤Â½Â¿Ã§â€Â¨Ã¦â€”Â¶Ã¦Å“Âº

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž C++ Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Ë†â€“Ã¤Â¿Â®Ã¥Â¤ÂÃ§Å½Â°Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢
* Ã¤Â¸Âº C++ Ã§Â»â€žÃ¤Â»Â¶Ã¨Â®Â¾Ã¨Â®Â¡Ã¥Ââ€¢Ã¥â€¦Æ’/Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¦â€ Ã§â€ºâ€“
* Ã¦Â·Â»Ã¥Å Â Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¦â€ Ã§â€ºâ€“Ã£â‚¬ÂCI Ã©â€”Â¨Ã¦Å½Â§Ã¦Ë†â€“Ã¥â€ºÅ¾Ã¥Â½â€™Ã¤Â¿ÂÃ¦Å Â¤
* Ã©â€¦ÂÃ§Â½Â® CMake/CTest Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ¤Â»Â¥Ã¥Â®Å¾Ã§Å½Â°Ã¤Â¸â‚¬Ã¨â€¡Â´Ã§Å¡â€žÃ¦â€°Â§Ã¨Â¡Å’
* Ã¨Â°Æ’Ã¦Å¸Â¥Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¤Â±Ã¨Â´Â¥Ã¦Ë†â€“Ã¥ÂÂ¶Ã¥Ââ€˜Ã¦â‚¬Â§Ã¨Â¡Å’Ã¤Â¸Âº
* Ã¥ÂÂ¯Ã§â€Â¨Ã§â€Â¨Ã¤ÂºÅ½Ã¥â€ â€¦Ã¥Â­Ëœ/Ã§Â«Å¾Ã¦â‚¬ÂÃ¨Â¯Å Ã¦â€“Â­Ã§Å¡â€žÃ¦Â¶Ë†Ã¦Â¯â€™Ã¥â€°â€š

### Ã¤Â¸ÂÃ©â‚¬â€šÃ§â€Â¨Ã¦â€”Â¶Ã¦Å“Âº

* Ã¥Å“Â¨Ã¤Â¸ÂÃ¤Â¿Â®Ã¦â€Â¹Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¥Â®Å¾Ã§Å½Â°Ã¦â€“Â°Ã§Å¡â€žÃ¤ÂºÂ§Ã¥â€œÂÃ¥Å Å¸Ã¨Æ’Â½
* Ã¤Â¸Å½Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¦â€ Ã§â€ºâ€“Ã¦Ë†â€“Ã¥Â¤Â±Ã¨Â´Â¥Ã¦â€”Â Ã¥â€¦Â³Ã§Å¡â€žÃ¥Â¤Â§Ã¨Â§â€žÃ¦Â¨Â¡Ã©â€¡ÂÃ¦Å¾â€ž
* Ã¦Â²Â¡Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€ºÅ¾Ã¥Â½â€™Ã©Å“â‚¬Ã¨Â¦ÂÃ©ÂªÅ’Ã¨Â¯ÂÃ§Å¡â€žÃ¦â‚¬Â§Ã¨Æ’Â½Ã¨Â°Æ’Ã¤Â¼Ëœ
* Ã©ÂÅ¾ C++ Ã©Â¡Â¹Ã§â€ºÂ®Ã¦Ë†â€“Ã©ÂÅ¾Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â»Â»Ã¥Å Â¡

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¦Â¦â€šÃ¥Â¿Âµ

* **TDD Ã¥Â¾ÂªÃ§Å½Â¯**Ã¯Â¼Å¡Ã§ÂºÂ¢ Ã¢â€ â€™ Ã§Â»Â¿ Ã¢â€ â€™ Ã©â€¡ÂÃ¦Å¾â€žÃ¯Â¼Ë†Ã¥â€¦Ë†Ã¥â€ â„¢Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Å’Ã¦Å“â‚¬Ã¥Â°ÂÃ¥Å’â€“Ã¤Â¿Â®Ã¥Â¤ÂÃ¯Â¼Å’Ã§â€žÂ¶Ã¥ÂÅ½Ã¦Â¸â€¦Ã§Ââ€ Ã¯Â¼â€°Ã£â‚¬â€š
* **Ã©Å¡â€Ã§Â¦Â»**Ã¯Â¼Å¡Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥Ã¥â€™Å’Ã¤Â»Â¿Ã¥Ë†Â¶Ã¥â€œÂÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥â€¦Â¨Ã¥Â±â‚¬Ã§Å Â¶Ã¦â‚¬ÂÃ£â‚¬â€š
* **Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¸Æ’Ã¥Â±â‚¬**Ã¯Â¼Å¡`tests/unit`Ã£â‚¬Â`tests/integration`Ã£â‚¬Â`tests/testdata`Ã£â‚¬â€š
* **Mock Ã¤Â¸Å½ Fake**Ã¯Â¼Å¡Mock Ã§â€Â¨Ã¤ÂºÅ½Ã¤ÂºÂ¤Ã¤Âºâ€™Ã¯Â¼Å’Fake Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å“â€°Ã§Å Â¶Ã¦â‚¬ÂÃ¨Â¡Å’Ã¤Â¸ÂºÃ£â‚¬â€š
* **CTest Ã¥Ââ€˜Ã§Å½Â°**Ã¯Â¼Å¡Ã¤Â½Â¿Ã§â€Â¨ `gtest_discover_tests()` Ã¨Â¿â€ºÃ¨Â¡Å’Ã§Â¨Â³Ã¥Â®Å¡Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Ââ€˜Ã§Å½Â°Ã£â‚¬â€š
* **CI Ã¤Â¿Â¡Ã¥ÂÂ·**Ã¯Â¼Å¡Ã¥â€¦Ë†Ã¨Â¿ÂÃ¨Â¡Å’Ã¥Â­ÂÃ©â€ºâ€ Ã¯Â¼Å’Ã§â€žÂ¶Ã¥ÂÅ½Ã¤Â½Â¿Ã§â€Â¨ `--output-on-failure` Ã¨Â¿ÂÃ¨Â¡Å’Ã¥Â®Å’Ã¦â€¢Â´Ã¥Â¥â€”Ã¤Â»Â¶Ã£â‚¬â€š

## TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

Ã©ÂÂµÃ¥Â¾Âª RED Ã¢â€ â€™ GREEN Ã¢â€ â€™ REFACTOR Ã¥Â¾ÂªÃ§Å½Â¯Ã¯Â¼Å¡

1. **RED**Ã¯Â¼Å¡Ã§Â¼â€“Ã¥â€ â„¢Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¦Ââ€¢Ã¨Å½Â·Ã¦â€“Â°Ã¨Â¡Å’Ã¤Â¸ÂºÃ§Å¡â€žÃ¥Â¤Â±Ã¨Â´Â¥Ã¦Âµâ€¹Ã¨Â¯â€¢
2. **GREEN**Ã¯Â¼Å¡Ã¥Â®Å¾Ã§Å½Â°Ã¦Å“â‚¬Ã¥Â°ÂÃ§Å¡â€žÃ¦â€ºÂ´Ã¦â€Â¹Ã¤Â»Â¥Ã¤Â½Â¿Ã¥â€¦Â¶Ã©â‚¬Å¡Ã¨Â¿â€¡
3. **REFACTOR**Ã¯Â¼Å¡Ã¥Å“Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¿ÂÃ¦Å’ÂÃ©â‚¬Å¡Ã¨Â¿â€¡Ã§Å¡â€žÃ¥ÂÅ’Ã¦â€”Â¶Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Â¸â€¦Ã§Ââ€ 

```cpp
// tests/add_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // Provided by production code.

TEST(AddTest, AddsTwoNumbers) { // RED
  EXPECT_EQ(Add(2, 3), 5);
}

// src/add.cpp
int Add(int a, int b) { // GREEN
  return a + b;
}

// REFACTOR: simplify/rename once tests pass
```

## Ã¤Â»Â£Ã§Â ÂÃ§Â¤ÂºÃ¤Â¾â€¹

### Ã¥Å¸ÂºÃ§Â¡â‚¬Ã¥Ââ€¢Ã¥â€¦Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢ (gtest)

```cpp
// tests/calculator_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // Provided by production code.

TEST(CalculatorTest, AddsTwoNumbers) {
    EXPECT_EQ(Add(2, 3), 5);
}
```

### Ã¥Â¤Â¹Ã¥â€¦Â· (gtest)

```cpp
// tests/user_store_test.cpp
// Pseudocode stub: replace UserStore/User with project types.
#include <gtest/gtest.h>
#include <memory>
#include <optional>
#include <string>

struct User { std::string name; };
class UserStore {
public:
    explicit UserStore(std::string /*path*/) {}
    void Seed(std::initializer_list<User> /*users*/) {}
    std::optional<User> Find(const std::string &/*name*/) { return User{"alice"}; }
};

class UserStoreTest : public ::testing::Test {
protected:
    void SetUp() override {
        store = std::make_unique<UserStore>(":memory:");
        store->Seed({{"alice"}, {"bob"}});
    }

    std::unique_ptr<UserStore> store;
};

TEST_F(UserStoreTest, FindsExistingUser) {
    auto user = store->Find("alice");
    ASSERT_TRUE(user.has_value());
    EXPECT_EQ(user->name, "alice");
}
```

### Mock (gmock)

```cpp
// tests/notifier_test.cpp
#include <gmock/gmock.h>
#include <gtest/gtest.h>
#include <string>

class Notifier {
public:
    virtual ~Notifier() = default;
    virtual void Send(const std::string &message) = 0;
};

class MockNotifier : public Notifier {
public:
    MOCK_METHOD(void, Send, (const std::string &message), (override));
};

class Service {
public:
    explicit Service(Notifier &notifier) : notifier_(notifier) {}
    void Publish(const std::string &message) { notifier_.Send(message); }

private:
    Notifier &notifier_;
};

TEST(ServiceTest, SendsNotifications) {
    MockNotifier notifier;
    Service service(notifier);

    EXPECT_CALL(notifier, Send("hello")).Times(1);
    service.Publish("hello");
}
```

### CMake/CTest Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥â€¦Â¥Ã©â€”Â¨

```cmake
# CMakeLists.txt (excerpt)
cmake_minimum_required(VERSION 3.20)
project(example LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
# Prefer project-locked versions. If using a tag, use a pinned version per project policy.
set(GTEST_VERSION v1.17.0) # Adjust to project policy.
FetchContent_Declare(
  googletest
  # Google Test framework (official repository)
  URL https://github.com/google/googletest/archive/refs/tags/${GTEST_VERSION}.zip
)
FetchContent_MakeAvailable(googletest)

add_executable(example_tests
  tests/calculator_test.cpp
  src/calculator.cpp
)
target_link_libraries(example_tests GTest::gtest GTest::gmock GTest::gtest_main)

enable_testing()
include(GoogleTest)
gtest_discover_tests(example_tests)
```

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j
ctest --test-dir build --output-on-failure
```

## Ã¨Â¿ÂÃ¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢

```bash
ctest --test-dir build --output-on-failure
ctest --test-dir build -R ClampTest
ctest --test-dir build -R "UserStoreTest.*" --output-on-failure
```

```bash
./build/example_tests --gtest_filter=ClampTest.*
./build/example_tests --gtest_filter=UserStoreTest.FindsExistingUser
```

## Ã¨Â°Æ’Ã¨Â¯â€¢Ã¥Â¤Â±Ã¨Â´Â¥

1. Ã¤Â½Â¿Ã§â€Â¨ gtest Ã¨Â¿â€¡Ã¦Â»Â¤Ã¥â„¢Â¨Ã©â€¡ÂÃ¦â€“Â°Ã¨Â¿ÂÃ¨Â¡Å’Ã¥Ââ€¢Ã¤Â¸ÂªÃ¥Â¤Â±Ã¨Â´Â¥Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬â€š
2. Ã¥Å“Â¨Ã¥Â¤Â±Ã¨Â´Â¥Ã§Å¡â€žÃ¦â€“Â­Ã¨Â¨â‚¬Ã¥â€˜Â¨Ã¥â€ºÂ´Ã¦Â·Â»Ã¥Å Â Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢Ã£â‚¬â€š
3. Ã¥ÂÂ¯Ã§â€Â¨Ã¦Â¶Ë†Ã¦Â¯â€™Ã¥â€°â€šÃ¥ÂÅ½Ã©â€¡ÂÃ¦â€“Â°Ã¨Â¿ÂÃ¨Â¡Å’Ã£â‚¬â€š
4. Ã¦Â Â¹Ã¦Å“Â¬Ã¥Å½Å¸Ã¥â€ºÂ Ã¤Â¿Â®Ã¥Â¤ÂÃ¥ÂÅ½Ã¯Â¼Å’Ã¦â€°Â©Ã¥Â±â€¢Ã¥Ë†Â°Ã¥Â®Å’Ã¦â€¢Â´Ã¥Â¥â€”Ã¤Â»Â¶Ã£â‚¬â€š

## Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡

Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã§â€ºÂ®Ã¦Â â€¡Ã§ÂºÂ§Ã¥Ë†Â«Ã§Å¡â€žÃ¨Â®Â¾Ã§Â½Â®Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥â€¦Â¨Ã¥Â±â‚¬Ã¦Â â€¡Ã¥Â¿â€”Ã£â‚¬â€š

```cmake
option(ENABLE_COVERAGE "Enable coverage flags" OFF)

if(ENABLE_COVERAGE)
  if(CMAKE_CXX_COMPILER_ID MATCHES "GNU")
    target_compile_options(example_tests PRIVATE --coverage)
    target_link_options(example_tests PRIVATE --coverage)
  elseif(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(example_tests PRIVATE -fprofile-instr-generate -fcoverage-mapping)
    target_link_options(example_tests PRIVATE -fprofile-instr-generate)
  endif()
endif()
```

GCC + gcov + lcovÃ¯Â¼Å¡

```bash
cmake -S . -B build-cov -DENABLE_COVERAGE=ON
cmake --build build-cov -j
ctest --test-dir build-cov
lcov --capture --directory build-cov --output-file coverage.info
lcov --remove coverage.info '/usr/*' --output-file coverage.info
genhtml coverage.info --output-directory coverage
```

Clang + llvm-covÃ¯Â¼Å¡

```bash
cmake -S . -B build-llvm -DENABLE_COVERAGE=ON -DCMAKE_CXX_COMPILER=clang++
cmake --build build-llvm -j
LLVM_PROFILE_FILE="build-llvm/default.profraw" ctest --test-dir build-llvm
llvm-profdata merge -sparse build-llvm/default.profraw -o build-llvm/default.profdata
llvm-cov report build-llvm/example_tests -instr-profile=build-llvm/default.profdata
```

## Ã¦Â¶Ë†Ã¦Â¯â€™Ã¥â€°â€š

```cmake
option(ENABLE_ASAN "Enable AddressSanitizer" OFF)
option(ENABLE_UBSAN "Enable UndefinedBehaviorSanitizer" OFF)
option(ENABLE_TSAN "Enable ThreadSanitizer" OFF)

if(ENABLE_ASAN)
  add_compile_options(-fsanitize=address -fno-omit-frame-pointer)
  add_link_options(-fsanitize=address)
endif()
if(ENABLE_UBSAN)
  add_compile_options(-fsanitize=undefined -fno-omit-frame-pointer)
  add_link_options(-fsanitize=undefined)
endif()
if(ENABLE_TSAN)
  add_compile_options(-fsanitize=thread)
  add_link_options(-fsanitize=thread)
endif()
```

## Ã¥ÂÂ¶Ã¥Ââ€˜Ã¦â‚¬Â§Ã¦Âµâ€¹Ã¨Â¯â€¢Ã©ËœÂ²Ã¦Å Â¤

* Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¤Â½Â¿Ã§â€Â¨ `sleep` Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥ÂÅ’Ã¦Â­Â¥Ã¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¦ÂÂ¡Ã¤Â»Â¶Ã¥ÂËœÃ©â€¡ÂÃ¦Ë†â€“Ã©â€”Â¨Ã©â€”Â©Ã£â‚¬â€š
* Ã¤Â¸ÂºÃ¦Â¯ÂÃ¤Â¸ÂªÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Ë†â€ºÃ¥Â»ÂºÃ¥â€Â¯Ã¤Â¸â‚¬Ã§Å¡â€žÃ¤Â¸Â´Ã¦â€”Â¶Ã§â€ºÂ®Ã¥Â½â€¢Ã¥Â¹Â¶Ã¥Â§â€¹Ã§Â»Ë†Ã¦Â¸â€¦Ã§Ââ€ Ã¥Â®Æ’Ã¤Â»Â¬Ã£â‚¬â€š
* Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã¥Ââ€¢Ã¥â€¦Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸Â­Ã¤Â¾ÂÃ¨Âµâ€“Ã§Å“Å¸Ã¥Â®Å¾Ã¦â€”Â¶Ã©â€”Â´Ã£â‚¬ÂÃ§Â½â€˜Ã§Â»Å“Ã¦Ë†â€“Ã¦â€“â€¡Ã¤Â»Â¶Ã§Â³Â»Ã§Â»Å¸Ã£â‚¬â€š
* Ã¥Â¯Â¹Ã©Å¡ÂÃ¦Å“ÂºÃ¥Å’â€“Ã¨Â¾â€œÃ¥â€¦Â¥Ã¤Â½Â¿Ã§â€Â¨Ã§Â¡Â®Ã¥Â®Å¡Ã¦â‚¬Â§Ã§Â§ÂÃ¥Â­ÂÃ£â‚¬â€š

## Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

### Ã¥Âºâ€Ã¨Â¯Â¥Ã¥ÂÅ¡

* Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ§Â¡Â®Ã¥Â®Å¡Ã¦â‚¬Â§Ã¥â€™Å’Ã©Å¡â€Ã§Â¦Â»Ã¦â‚¬Â§
* Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥â€¦Â¨Ã¥Â±â‚¬Ã¥ÂËœÃ©â€¡Â
* Ã¥Â¯Â¹Ã¥â€°ÂÃ§Â½Â®Ã¦ÂÂ¡Ã¤Â»Â¶Ã¤Â½Â¿Ã§â€Â¨ `ASSERT_*`Ã¯Â¼Å’Ã¥Â¯Â¹Ã¥Â¤Å¡Ã¤Â¸ÂªÃ¦Â£â‚¬Ã¦Å¸Â¥Ã¤Â½Â¿Ã§â€Â¨ `EXPECT_*`
* Ã¥Å“Â¨ CTest Ã¦Â â€¡Ã§Â­Â¾Ã¦Ë†â€“Ã§â€ºÂ®Ã¥Â½â€¢Ã¤Â¸Â­Ã¥Ë†â€ Ã§Â¦Â»Ã¥Ââ€¢Ã¥â€¦Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸Å½Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢
* Ã¥Å“Â¨ CI Ã¤Â¸Â­Ã¨Â¿ÂÃ¨Â¡Å’Ã¦Â¶Ë†Ã¦Â¯â€™Ã¥â€°â€šÃ¤Â»Â¥Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥â€ â€¦Ã¥Â­ËœÃ¥â€™Å’Ã§Â«Å¾Ã¦â‚¬ÂÃ¦Â£â‚¬Ã¦Âµâ€¹

### Ã¤Â¸ÂÃ¥Âºâ€Ã¨Â¯Â¥Ã¥ÂÅ¡

* Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Å“Â¨Ã¥Ââ€¢Ã¥â€¦Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸Â­Ã¤Â¾ÂÃ¨Âµâ€“Ã§Å“Å¸Ã¥Â®Å¾Ã¦â€”Â¶Ã©â€”Â´Ã¦Ë†â€“Ã§Â½â€˜Ã§Â»Å“
* Ã¥Â½â€œÃ¥ÂÂ¯Ã¤Â»Â¥Ã¤Â½Â¿Ã§â€Â¨Ã¦ÂÂ¡Ã¤Â»Â¶Ã¥ÂËœÃ©â€¡ÂÃ¦â€”Â¶Ã¯Â¼Å’Ã¤Â¸ÂÃ¨Â¦ÂÃ¤Â½Â¿Ã§â€Â¨Ã§ÂÂ¡Ã§Å“Â Ã¤Â½Å“Ã¤Â¸ÂºÃ¥ÂÅ’Ã¦Â­Â¥Ã¦â€°â€¹Ã¦Â®Âµ
* Ã¤Â¸ÂÃ¨Â¦ÂÃ¨Â¿â€¡Ã¥ÂºÂ¦Ã¦Â¨Â¡Ã¦â€¹Å¸Ã§Â®â‚¬Ã¥Ââ€¢Ã§Å¡â€žÃ¥â‚¬Â¼Ã¥Â¯Â¹Ã¨Â±Â¡
* Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Â¯Â¹Ã©ÂÅ¾Ã¥â€¦Â³Ã©â€Â®Ã¦â€”Â¥Ã¥Â¿â€”Ã¤Â½Â¿Ã§â€Â¨Ã¨â€žâ€ Ã¥Â¼Â±Ã§Å¡â€žÃ¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¥Å’Â¹Ã©â€¦Â

### Ã¥Â¸Â¸Ã¨Â§ÂÃ©â„¢Â·Ã©ËœÂ±

* **Ã¤Â½Â¿Ã§â€Â¨Ã¥â€ºÂºÃ¥Â®Å¡Ã§Å¡â€žÃ¤Â¸Â´Ã¦â€”Â¶Ã¨Â·Â¯Ã¥Â¾â€ž** Ã¢â€ â€™ Ã¤Â¸ÂºÃ¦Â¯ÂÃ¤Â¸ÂªÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§â€Å¸Ã¦Ë†ÂÃ¥â€Â¯Ã¤Â¸â‚¬Ã§Å¡â€žÃ¤Â¸Â´Ã¦â€”Â¶Ã§â€ºÂ®Ã¥Â½â€¢Ã¥Â¹Â¶Ã¦Â¸â€¦Ã§Ââ€ Ã¥Â®Æ’Ã¤Â»Â¬Ã£â‚¬â€š
* **Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Å’â€šÃ©â€™Å¸Ã¦â€”Â¶Ã©â€”Â´** Ã¢â€ â€™ Ã¦Â³Â¨Ã¥â€¦Â¥Ã¦â€”Â¶Ã©â€™Å¸Ã¦Ë†â€“Ã¤Â½Â¿Ã§â€Â¨Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¦â€”Â¶Ã©â€”Â´Ã¦ÂºÂÃ£â‚¬â€š
* **Ã¥ÂÂ¶Ã¥Ââ€˜Ã¦â‚¬Â§Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Âµâ€¹Ã¨Â¯â€¢** Ã¢â€ â€™ Ã¤Â½Â¿Ã§â€Â¨Ã¦ÂÂ¡Ã¤Â»Â¶Ã¥ÂËœÃ©â€¡Â/Ã©â€”Â¨Ã©â€”Â©Ã¥â€™Å’Ã¦Å“â€°Ã§â€¢Å’Ã§Â­â€°Ã¥Â¾â€¦Ã£â‚¬â€š
* **Ã©Å¡ÂÃ¨â€”ÂÃ§Å¡â€žÃ¥â€¦Â¨Ã¥Â±â‚¬Ã§Å Â¶Ã¦â‚¬Â** Ã¢â€ â€™ Ã¥Å“Â¨Ã¥Â¤Â¹Ã¥â€¦Â·Ã¤Â¸Â­Ã©â€¡ÂÃ§Â½Â®Ã¥â€¦Â¨Ã¥Â±â‚¬Ã§Å Â¶Ã¦â‚¬ÂÃ¦Ë†â€“Ã§Â§Â»Ã©â„¢Â¤Ã¥â€¦Â¨Ã¥Â±â‚¬Ã¥ÂËœÃ©â€¡ÂÃ£â‚¬â€š
* **Ã¨Â¿â€¡Ã¥ÂºÂ¦Ã¦Â¨Â¡Ã¦â€¹Å¸** Ã¢â€ â€™ Ã¥Â¯Â¹Ã¦Å“â€°Ã§Å Â¶Ã¦â‚¬ÂÃ¨Â¡Å’Ã¤Â¸ÂºÃ¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨ FakeÃ¯Â¼Å’Ã¤Â»â€¦Ã¥Â¯Â¹Ã¤ÂºÂ¤Ã¤Âºâ€™Ã¨Â¿â€ºÃ¨Â¡Å’ MockÃ£â‚¬â€š
* **Ã§Â¼ÂºÃ¥Â°â€˜Ã¦Â¶Ë†Ã¦Â¯â€™Ã¥â€°â€šÃ¨Â¿ÂÃ¨Â¡Å’** Ã¢â€ â€™ Ã¥Å“Â¨ CI Ã¤Â¸Â­Ã¦Â·Â»Ã¥Å Â  ASan/UBSan/TSan Ã¦Å¾â€žÃ¥Â»ÂºÃ£â‚¬â€š
* **Ã¤Â»â€¦Ã¥Å“Â¨Ã¨Â°Æ’Ã¨Â¯â€¢Ã§â€°Ë†Ã¦Å“Â¬Ã¤Â¸Å Ã¨Â®Â¡Ã§Â®â€”Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡** Ã¢â€ â€™ Ã§Â¡Â®Ã¤Â¿ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã§â€ºÂ®Ã¦Â â€¡Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸â‚¬Ã¨â€¡Â´Ã§Å¡â€žÃ¦Â â€¡Ã¥Â¿â€”Ã£â‚¬â€š

## Ã¥ÂÂ¯Ã©â‚¬â€°Ã©â„¢â€žÃ¥Â½â€¢Ã¯Â¼Å¡Ã¦Â¨Â¡Ã§Â³Å Ã¦Âµâ€¹Ã¨Â¯â€¢ / Ã¥Â±Å¾Ã¦â‚¬Â§Ã¦Âµâ€¹Ã¨Â¯â€¢

Ã¤Â»â€¦Ã¥Å“Â¨Ã©Â¡Â¹Ã§â€ºÂ®Ã¥Â·Â²Ã¦â€Â¯Ã¦Å’Â LLVM/libFuzzer Ã¦Ë†â€“Ã¥Â±Å¾Ã¦â‚¬Â§Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Âºâ€œÃ¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã£â‚¬â€š

* **libFuzzer**Ã¯Â¼Å¡Ã¦Å“â‚¬Ã©â‚¬â€šÃ¥ÂË† I/O Ã¦Å“â‚¬Ã¥Â°â€˜Ã§Å¡â€žÃ§ÂºÂ¯Ã¥â€¡Â½Ã¦â€¢Â°Ã£â‚¬â€š
* **RapidCheck**Ã¯Â¼Å¡Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥Â±Å¾Ã¦â‚¬Â§Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Å’Ã§â€Â¨Ã¤ÂºÅ½Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Â¸ÂÃ¥ÂËœÃ©â€¡ÂÃ£â‚¬â€š

Ã¦Å“â‚¬Ã¥Â°ÂÃ§Å¡â€ž libFuzzer Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¡â€ Ã¦Å¾Â¶Ã¯Â¼Ë†Ã¤Â¼ÂªÃ¤Â»Â£Ã§Â ÂÃ¯Â¼Å¡Ã¦â€ºÂ¿Ã¦ÂÂ¢ ParseConfigÃ¯Â¼â€°Ã¯Â¼Å¡

```cpp
#include <cstddef>
#include <cstdint>
#include <string>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    std::string input(reinterpret_cast<const char *>(data), size);
    // ParseConfig(input); // project function
    return 0;
}
```

## GoogleTest Ã§Å¡â€žÃ¦â€ºÂ¿Ã¤Â»Â£Ã¦â€“Â¹Ã¦Â¡Ë†

* **Catch2**Ã¯Â¼Å¡Ã¤Â»â€¦Ã¥Â¤Â´Ã¦â€“â€¡Ã¤Â»Â¶Ã¯Â¼Å’Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¦â‚¬Â§Ã¥Â¼ÂºÃ§Å¡â€žÃ¥Å’Â¹Ã©â€¦ÂÃ¥â„¢Â¨
* **doctest**Ã¯Â¼Å¡Ã¨Â½Â»Ã©â€¡ÂÃ§ÂºÂ§Ã¯Â¼Å’Ã§Â¼â€“Ã¨Â¯â€˜Ã¥Â¼â‚¬Ã©â€â‚¬Ã¦Å“â‚¬Ã¥Â°Â
