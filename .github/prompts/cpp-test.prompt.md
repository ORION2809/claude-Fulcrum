---
description: "Generate and run C++ tests: GoogleTest, CTest, matchers, parameterized tests, and coverage with gcov/llvm-cov."
mode: "agent"
---

# C++ Test

Generate C++ tests using GoogleTest following TDD methodology.

## Test Patterns
- **GoogleTest** (`gtest`) for unit tests
- **CTest** for test orchestration
- Parameterized tests with `TEST_P`
- Death tests with `EXPECT_DEATH`

## Structure
```cpp
#include <gtest/gtest.h>
#include "my_module.h"

TEST(MyModuleTest, ValidInput) {
    auto result = process(valid_input());
    EXPECT_EQ(result, expected_output());
}

TEST(MyModuleTest, ErrorCase) {
    EXPECT_THROW(process(invalid_input()), std::invalid_argument);
}

class MyParameterizedTest : public testing::TestWithParam<std::pair<int, int>> {};

TEST_P(MyParameterizedTest, AdditionWorks) {
    auto [input, expected] = GetParam();
    EXPECT_EQ(add(input, 1), expected);
}

INSTANTIATE_TEST_SUITE_P(Values, MyParameterizedTest,
    testing::Values(std::make_pair(1, 2), std::make_pair(0, 1)));
```

## Coverage
Run: `cmake -DCMAKE_BUILD_TYPE=Coverage .. && make && ctest && gcovr`

{{{ input }}}
