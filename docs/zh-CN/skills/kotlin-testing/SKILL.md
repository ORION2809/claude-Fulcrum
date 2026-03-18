---
name: kotlin-testing
description: Ã¤Â½Â¿Ã§â€Â¨KotestÃ£â‚¬ÂMockKÃ£â‚¬ÂÃ¥ÂÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬ÂÃ¥Å¸ÂºÃ¤ÂºÅ½Ã¥Â±Å¾Ã¦â‚¬Â§Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€™Å’KoverÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã§Å¡â€žKotlinÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€šÃ©ÂÂµÃ¥Â¾ÂªTDDÃ¦â€“Â¹Ã¦Â³â€¢Ã¨Â®ÂºÃ¥â€™Å’Ã¥Å“Â°Ã©Ââ€œÃ§Å¡â€žKotlinÃ¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# Kotlin Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼Â

Ã©ÂÂµÃ¥Â¾Âª TDD Ã¦â€“Â¹Ã¦Â³â€¢Ã¨Â®ÂºÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ Kotest Ã¥â€™Å’ MockK Ã§Â¼â€“Ã¥â€ â„¢Ã¥ÂÂ¯Ã©ÂÂ Ã£â‚¬ÂÃ¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ¥â€¦Â¨Ã©ÂÂ¢ Kotlin Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Kotlin Ã¥â€¡Â½Ã¦â€¢Â°Ã¦Ë†â€“Ã§Â±Â»
* Ã¤Â¸ÂºÃ§Å½Â°Ã¦Å“â€° Kotlin Ã¤Â»Â£Ã§Â ÂÃ¦Â·Â»Ã¥Å Â Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡
* Ã¥Â®Å¾Ã§Å½Â°Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥Â±Å¾Ã¦â‚¬Â§Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢
* Ã¥Å“Â¨ Kotlin Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Â­Ã©ÂÂµÃ¥Â¾Âª TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ
* Ã¤Â¸ÂºÃ¤Â»Â£Ã§Â ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã©â€¦ÂÃ§Â½Â® Kover

## Ã¥Â·Â¥Ã¤Â½Å“Ã¥Å½Å¸Ã§Ââ€ 

1. **Ã§Â¡Â®Ã¥Â®Å¡Ã§â€ºÂ®Ã¦Â â€¡Ã¤Â»Â£Ã§Â Â** Ã¢â‚¬â€ Ã¦â€°Â¾Ã¥Ë†Â°Ã¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ¥â€¡Â½Ã¦â€¢Â°Ã£â‚¬ÂÃ§Â±Â»Ã¦Ë†â€“Ã¦Â¨Â¡Ã¥Ââ€”
2. **Ã§Â¼â€“Ã¥â€ â„¢ Kotest Ã¨Â§â€žÃ¨Å’Æ’** Ã¢â‚¬â€ Ã©â‚¬â€°Ã¦â€¹Â©Ã¤Â¸Å½Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Å’Æ’Ã¥â€ºÂ´Ã¥Å’Â¹Ã©â€¦ÂÃ§Å¡â€žÃ¨Â§â€žÃ¨Å’Æ’Ã¦Â Â·Ã¥Â¼ÂÃ¯Â¼Ë†StringSpecÃ£â‚¬ÂFunSpecÃ£â‚¬ÂBehaviorSpecÃ¯Â¼â€°
3. **Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹** Ã¢â‚¬â€ Ã¤Â½Â¿Ã§â€Â¨ MockK Ã¦ÂÂ¥Ã©Å¡â€Ã§Â¦Â»Ã¨Â¢Â«Ã¦Âµâ€¹Ã¥Ââ€¢Ã¥â€¦Æ’
4. **Ã¨Â¿ÂÃ¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Ë†Ã§ÂºÂ¢Ã¨â€°Â²Ã©ËœÂ¶Ã¦Â®ÂµÃ¯Â¼â€°** Ã¢â‚¬â€ Ã©ÂªÅ’Ã¨Â¯ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¦ËœÂ¯Ã¥ÂÂ¦Ã¦Å’â€°Ã©Â¢â€žÃ¦Å“Å¸Ã¥Â¤Â±Ã¨Â´Â¥
5. **Ã¥Â®Å¾Ã§Å½Â°Ã¤Â»Â£Ã§Â ÂÃ¯Â¼Ë†Ã§Â»Â¿Ã¨â€°Â²Ã©ËœÂ¶Ã¦Â®ÂµÃ¯Â¼â€°** Ã¢â‚¬â€ Ã§Â¼â€“Ã¥â€ â„¢Ã¦Å“â‚¬Ã¥Â°â€˜Ã§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ¤Â»Â¥Ã¤Â½Â¿Ã¦Âµâ€¹Ã¨Â¯â€¢Ã©â‚¬Å¡Ã¨Â¿â€¡
6. **Ã©â€¡ÂÃ¦Å¾â€ž** Ã¢â‚¬â€ Ã¦â€Â¹Ã¨Â¿â€ºÃ¥Â®Å¾Ã§Å½Â°Ã¯Â¼Å’Ã¥ÂÅ’Ã¦â€”Â¶Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©â‚¬Å¡Ã¨Â¿â€¡
7. **Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡** Ã¢â‚¬â€ Ã¨Â¿ÂÃ¨Â¡Å’ `./gradlew koverHtmlReport` Ã¥Â¹Â¶Ã©ÂªÅ’Ã¨Â¯Â 80%+ Ã§Å¡â€žÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡

## Ã§Â¤ÂºÃ¤Â¾â€¹

Ã¤Â»Â¥Ã¤Â¸â€¹Ã©Æ’Â¨Ã¥Ë†â€ Ã¥Å’â€¦Ã¥ÂÂ«Ã¦Â¯ÂÃ¤Â¸ÂªÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ§Å¡â€žÃ¨Â¯Â¦Ã§Â»â€ Ã£â‚¬ÂÃ¥ÂÂ¯Ã¨Â¿ÂÃ¨Â¡Å’Ã§Â¤ÂºÃ¤Â¾â€¹Ã¯Â¼Å¡

### Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’

* **Kotest Ã¨Â§â€žÃ¨Å’Æ’** Ã¢â‚¬â€ [Kotest Ã¨Â§â€žÃ¨Å’Æ’Ã¦Â Â·Ã¥Â¼Â](#kotest-Ã¨Â§â€žÃ¨Å’Æ’Ã¦Â Â·Ã¥Â¼Â) Ã¤Â¸Â­Ã§Å¡â€ž StringSpecÃ£â‚¬ÂFunSpecÃ£â‚¬ÂBehaviorSpecÃ£â‚¬ÂDescribeSpec Ã§Â¤ÂºÃ¤Â¾â€¹
* **Ã¦Â¨Â¡Ã¦â€¹Å¸** Ã¢â‚¬â€ [MockK](#mockk) Ã¤Â¸Â­Ã§Å¡â€ž MockK Ã¨Â®Â¾Ã§Â½Â®Ã£â‚¬ÂÃ¥ÂÂÃ§Â¨â€¹Ã¦Â¨Â¡Ã¦â€¹Å¸Ã£â‚¬ÂÃ¥Ââ€šÃ¦â€¢Â°Ã¦Ââ€¢Ã¨Å½Â·
* **TDD Ã¦Â¼â€Ã§Â»Æ’** Ã¢â‚¬â€ [Kotlin Ã§Å¡â€ž TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ](#kotlin-Ã§Å¡â€ž-tdd-Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ) Ã¤Â¸Â­ EmailValidator Ã§Å¡â€žÃ¥Â®Å’Ã¦â€¢Â´ RED/GREEN/REFACTOR Ã¥â€˜Â¨Ã¦Å“Å¸
* **Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡** Ã¢â‚¬â€ [Kover Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡](#kover-Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡) Ã¤Â¸Â­Ã§Å¡â€ž Kover Ã©â€¦ÂÃ§Â½Â®Ã¥â€™Å’Ã¥â€˜Â½Ã¤Â»Â¤
* **Ktor Ã¦Âµâ€¹Ã¨Â¯â€¢** Ã¢â‚¬â€ [Ktor testApplication Ã¦Âµâ€¹Ã¨Â¯â€¢](#ktor-testapplication-Ã¦Âµâ€¹Ã¨Â¯â€¢) Ã¤Â¸Â­Ã§Å¡â€ž testApplication Ã¨Â®Â¾Ã§Â½Â®

### Kotlin Ã§Å¡â€ž TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ

#### RED-GREEN-REFACTOR Ã¥â€˜Â¨Ã¦Å“Å¸

```
RED     -> Write a failing test first
GREEN   -> Write minimal code to pass the test
REFACTOR -> Improve code while keeping tests green
REPEAT  -> Continue with next requirement
```

#### Kotlin Ã¤Â¸Â­Ã©â‚¬ÂÃ¦Â­Â¥Ã¨Â¿â€ºÃ¨Â¡Å’ TDD

```kotlin
// Step 1: Define the interface/signature
// EmailValidator.kt
package com.example.validator

fun validateEmail(email: String): Result<String> {
    TODO("not implemented")
}

// Step 2: Write failing test (RED)
// EmailValidatorTest.kt
package com.example.validator

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.result.shouldBeFailure
import io.kotest.matchers.result.shouldBeSuccess

class EmailValidatorTest : StringSpec({
    "valid email returns success" {
        validateEmail("user@example.com").shouldBeSuccess("user@example.com")
    }

    "empty email returns failure" {
        validateEmail("").shouldBeFailure()
    }

    "email without @ returns failure" {
        validateEmail("userexample.com").shouldBeFailure()
    }
})

// Step 3: Run tests - verify FAIL
// $ ./gradlew test
// EmailValidatorTest > valid email returns success FAILED
//   kotlin.NotImplementedError: An operation is not implemented

// Step 4: Implement minimal code (GREEN)
fun validateEmail(email: String): Result<String> {
    if (email.isBlank()) return Result.failure(IllegalArgumentException("Email cannot be blank"))
    if ('@' !in email) return Result.failure(IllegalArgumentException("Email must contain @"))
    val regex = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    if (!regex.matches(email)) return Result.failure(IllegalArgumentException("Invalid email format"))
    return Result.success(email)
}

// Step 5: Run tests - verify PASS
// $ ./gradlew test
// EmailValidatorTest > valid email returns success PASSED
// EmailValidatorTest > empty email returns failure PASSED
// EmailValidatorTest > email without @ returns failure PASSED

// Step 6: Refactor if needed, verify tests still pass
```

### Kotest Ã¨Â§â€žÃ¨Å’Æ’Ã¦Â Â·Ã¥Â¼Â

#### StringSpecÃ¯Â¼Ë†Ã¦Å“â‚¬Ã§Â®â‚¬Ã¥Ââ€¢Ã¯Â¼â€°

```kotlin
class CalculatorTest : StringSpec({
    "add two positive numbers" {
        Calculator.add(2, 3) shouldBe 5
    }

    "add negative numbers" {
        Calculator.add(-1, -2) shouldBe -3
    }

    "add zero" {
        Calculator.add(0, 5) shouldBe 5
    }
})
```

#### FunSpecÃ¯Â¼Ë†Ã§Â±Â»Ã¤Â¼Â¼ JUnitÃ¯Â¼â€°

```kotlin
class UserServiceTest : FunSpec({
    val repository = mockk<UserRepository>()
    val service = UserService(repository)

    test("getUser returns user when found") {
        val expected = User(id = "1", name = "Alice")
        coEvery { repository.findById("1") } returns expected

        val result = service.getUser("1")

        result shouldBe expected
    }

    test("getUser throws when not found") {
        coEvery { repository.findById("999") } returns null

        shouldThrow<UserNotFoundException> {
            service.getUser("999")
        }
    }
})
```

#### BehaviorSpecÃ¯Â¼Ë†BDD Ã©Â£Å½Ã¦Â Â¼Ã¯Â¼â€°

```kotlin
class OrderServiceTest : BehaviorSpec({
    val repository = mockk<OrderRepository>()
    val paymentService = mockk<PaymentService>()
    val service = OrderService(repository, paymentService)

    Given("a valid order request") {
        val request = CreateOrderRequest(
            userId = "user-1",
            items = listOf(OrderItem("product-1", quantity = 2)),
        )

        When("the order is placed") {
            coEvery { paymentService.charge(any()) } returns PaymentResult.Success
            coEvery { repository.save(any()) } answers { firstArg() }

            val result = service.placeOrder(request)

            Then("it should return a confirmed order") {
                result.status shouldBe OrderStatus.CONFIRMED
            }

            Then("it should charge payment") {
                coVerify(exactly = 1) { paymentService.charge(any()) }
            }
        }

        When("payment fails") {
            coEvery { paymentService.charge(any()) } returns PaymentResult.Declined

            Then("it should throw PaymentException") {
                shouldThrow<PaymentException> {
                    service.placeOrder(request)
                }
            }
        }
    }
})
```

#### DescribeSpecÃ¯Â¼Ë†RSpec Ã©Â£Å½Ã¦Â Â¼Ã¯Â¼â€°

```kotlin
class UserValidatorTest : DescribeSpec({
    describe("validateUser") {
        val validator = UserValidator()

        context("with valid input") {
            it("accepts a normal user") {
                val user = CreateUserRequest("Alice", "alice@example.com")
                validator.validate(user).shouldBeValid()
            }
        }

        context("with invalid name") {
            it("rejects blank name") {
                val user = CreateUserRequest("", "alice@example.com")
                validator.validate(user).shouldBeInvalid()
            }

            it("rejects name exceeding max length") {
                val user = CreateUserRequest("A".repeat(256), "alice@example.com")
                validator.validate(user).shouldBeInvalid()
            }
        }
    }
})
```

### Kotest Ã¥Å’Â¹Ã©â€¦ÂÃ¥â„¢Â¨

#### Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Å’Â¹Ã©â€¦ÂÃ¥â„¢Â¨

```kotlin
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.*
import io.kotest.matchers.collections.*
import io.kotest.matchers.nulls.*

// Equality
result shouldBe expected
result shouldNotBe unexpected

// Strings
name shouldStartWith "Al"
name shouldEndWith "ice"
name shouldContain "lic"
name shouldMatch Regex("[A-Z][a-z]+")
name.shouldBeBlank()

// Collections
list shouldContain "item"
list shouldHaveSize 3
list.shouldBeSorted()
list.shouldContainAll("a", "b", "c")
list.shouldBeEmpty()

// Nulls
result.shouldNotBeNull()
result.shouldBeNull()

// Types
result.shouldBeInstanceOf<User>()

// Numbers
count shouldBeGreaterThan 0
price shouldBeInRange 1.0..100.0

// Exceptions
shouldThrow<IllegalArgumentException> {
    validateAge(-1)
}.message shouldBe "Age must be positive"

shouldNotThrow<Exception> {
    validateAge(25)
}
```

#### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¥Å’Â¹Ã©â€¦ÂÃ¥â„¢Â¨

```kotlin
fun beActiveUser() = object : Matcher<User> {
    override fun test(value: User) = MatcherResult(
        value.isActive && value.lastLogin != null,
        { "User ${value.id} should be active with a last login" },
        { "User ${value.id} should not be active" },
    )
}

// Usage
user should beActiveUser()
```

### MockK

#### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¦Â¨Â¡Ã¦â€¹Å¸

```kotlin
class UserServiceTest : FunSpec({
    val repository = mockk<UserRepository>()
    val logger = mockk<Logger>(relaxed = true) // Relaxed: returns defaults
    val service = UserService(repository, logger)

    beforeTest {
        clearMocks(repository, logger)
    }

    test("findUser delegates to repository") {
        val expected = User(id = "1", name = "Alice")
        every { repository.findById("1") } returns expected

        val result = service.findUser("1")

        result shouldBe expected
        verify(exactly = 1) { repository.findById("1") }
    }

    test("findUser returns null for unknown id") {
        every { repository.findById(any()) } returns null

        val result = service.findUser("unknown")

        result.shouldBeNull()
    }
})
```

#### Ã¥ÂÂÃ§Â¨â€¹Ã¦Â¨Â¡Ã¦â€¹Å¸

```kotlin
class AsyncUserServiceTest : FunSpec({
    val repository = mockk<UserRepository>()
    val service = UserService(repository)

    test("getUser suspending function") {
        coEvery { repository.findById("1") } returns User(id = "1", name = "Alice")

        val result = service.getUser("1")

        result.name shouldBe "Alice"
        coVerify { repository.findById("1") }
    }

    test("getUser with delay") {
        coEvery { repository.findById("1") } coAnswers {
            delay(100) // Simulate async work
            User(id = "1", name = "Alice")
        }

        val result = service.getUser("1")
        result.name shouldBe "Alice"
    }
})
```

#### Ã¥Ââ€šÃ¦â€¢Â°Ã¦Ââ€¢Ã¨Å½Â·

```kotlin
test("save captures the user argument") {
    val slot = slot<User>()
    coEvery { repository.save(capture(slot)) } returns Unit

    service.createUser(CreateUserRequest("Alice", "alice@example.com"))

    slot.captured.name shouldBe "Alice"
    slot.captured.email shouldBe "alice@example.com"
    slot.captured.id.shouldNotBeNull()
}
```

#### Ã©â€”Â´Ã¨Â°ÂÃ¥â€™Å’Ã©Æ’Â¨Ã¥Ë†â€ Ã¦Â¨Â¡Ã¦â€¹Å¸

```kotlin
test("spy on real object") {
    val realService = UserService(repository)
    val spy = spyk(realService)

    every { spy.generateId() } returns "fixed-id"

    spy.createUser(request)

    verify { spy.generateId() } // Overridden
    // Other methods use real implementation
}
```

### Ã¥ÂÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢

#### Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å’â€šÃ¨ÂµÂ·Ã¥â€¡Â½Ã¦â€¢Â°Ã§Å¡â€ž runTest

```kotlin
import kotlinx.coroutines.test.runTest

class CoroutineServiceTest : FunSpec({
    test("concurrent fetches complete together") {
        runTest {
            val service = DataService(testScope = this)

            val result = service.fetchAllData()

            result.users.shouldNotBeEmpty()
            result.products.shouldNotBeEmpty()
        }
    }

    test("timeout after delay") {
        runTest {
            val service = SlowService()

            shouldThrow<TimeoutCancellationException> {
                withTimeout(100) {
                    service.slowOperation() // Takes > 100ms
                }
            }
        }
    }
})
```

#### Ã¦Âµâ€¹Ã¨Â¯â€¢ Flow

```kotlin
import io.kotest.matchers.collections.shouldContainInOrder
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.runTest

class FlowServiceTest : FunSpec({
    test("observeUsers emits updates") {
        runTest {
            val service = UserFlowService()

            val emissions = service.observeUsers()
                .take(3)
                .toList()

            emissions shouldHaveSize 3
            emissions.last().shouldNotBeEmpty()
        }
    }

    test("searchUsers debounces input") {
        runTest {
            val service = SearchService()
            val queries = MutableSharedFlow<String>()

            val results = mutableListOf<List<User>>()
            val job = launch {
                service.searchUsers(queries).collect { results.add(it) }
            }

            queries.emit("a")
            queries.emit("ab")
            queries.emit("abc") // Only this should trigger search
            advanceTimeBy(500)

            results shouldHaveSize 1
            job.cancel()
        }
    }
})
```

#### TestDispatcher

```kotlin
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle

class DispatcherTest : FunSpec({
    test("uses test dispatcher for controlled execution") {
        val dispatcher = StandardTestDispatcher()

        runTest(dispatcher) {
            var completed = false

            launch {
                delay(1000)
                completed = true
            }

            completed shouldBe false
            advanceTimeBy(1000)
            completed shouldBe true
        }
    }
})
```

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥Â±Å¾Ã¦â‚¬Â§Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢

#### Kotest Ã¥Â±Å¾Ã¦â‚¬Â§Ã¦Âµâ€¹Ã¨Â¯â€¢

```kotlin
import io.kotest.core.spec.style.FunSpec
import io.kotest.property.Arb
import io.kotest.property.arbitrary.*
import io.kotest.property.forAll
import io.kotest.property.checkAll
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString

// Note: The serialization roundtrip test below requires the User data class
// to be annotated with @Serializable (from kotlinx.serialization).

class PropertyTest : FunSpec({
    test("string reverse is involutory") {
        forAll<String> { s ->
            s.reversed().reversed() == s
        }
    }

    test("list sort is idempotent") {
        forAll(Arb.list(Arb.int())) { list ->
            list.sorted() == list.sorted().sorted()
        }
    }

    test("serialization roundtrip preserves data") {
        checkAll(Arb.bind(Arb.string(1..50), Arb.string(5..100)) { name, email ->
            User(name = name, email = "$email@test.com")
        }) { user ->
            val json = Json.encodeToString(user)
            val decoded = Json.decodeFromString<User>(json)
            decoded shouldBe user
        }
    }
})
```

#### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã§â€Å¸Ã¦Ë†ÂÃ¥â„¢Â¨

```kotlin
val userArb: Arb<User> = Arb.bind(
    Arb.string(minSize = 1, maxSize = 50),
    Arb.email(),
    Arb.enum<Role>(),
) { name, email, role ->
    User(
        id = UserId(UUID.randomUUID().toString()),
        name = name,
        email = Email(email),
        role = role,
    )
}

val moneyArb: Arb<Money> = Arb.bind(
    Arb.long(1L..1_000_000L),
    Arb.enum<Currency>(),
) { amount, currency ->
    Money(amount, currency)
}
```

### Ã¦â€¢Â°Ã¦ÂÂ®Ã©Â©Â±Ã¥Å Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢

#### Kotest Ã¤Â¸Â­Ã§Å¡â€ž withData

```kotlin
class ParserTest : FunSpec({
    context("parsing valid dates") {
        withData(
            "2026-01-15" to LocalDate(2026, 1, 15),
            "2026-12-31" to LocalDate(2026, 12, 31),
            "2000-01-01" to LocalDate(2000, 1, 1),
        ) { (input, expected) ->
            parseDate(input) shouldBe expected
        }
    }

    context("rejecting invalid dates") {
        withData(
            nameFn = { "rejects '$it'" },
            "not-a-date",
            "2026-13-01",
            "2026-00-15",
            "",
        ) { input ->
            shouldThrow<DateParseException> {
                parseDate(input)
            }
        }
    }
})
```

### Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§â€Å¸Ã¥â€˜Â½Ã¥â€˜Â¨Ã¦Å“Å¸Ã¥â€™Å’Ã¥â€ºÂºÃ¤Â»Â¶

#### BeforeTest / AfterTest

```kotlin
class DatabaseTest : FunSpec({
    lateinit var db: Database

    beforeSpec {
        db = Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
        transaction(db) {
            SchemaUtils.create(UsersTable)
        }
    }

    afterSpec {
        transaction(db) {
            SchemaUtils.drop(UsersTable)
        }
    }

    beforeTest {
        transaction(db) {
            UsersTable.deleteAll()
        }
    }

    test("insert and retrieve user") {
        transaction(db) {
            UsersTable.insert {
                it[name] = "Alice"
                it[email] = "alice@example.com"
            }
        }

        val users = transaction(db) {
            UsersTable.selectAll().map { it[UsersTable.name] }
        }

        users shouldContain "Alice"
    }
})
```

#### Kotest Ã¦â€°Â©Ã¥Â±â€¢

```kotlin
// Reusable test extension
class DatabaseExtension : BeforeSpecListener, AfterSpecListener {
    lateinit var db: Database

    override suspend fun beforeSpec(spec: Spec) {
        db = Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1")
    }

    override suspend fun afterSpec(spec: Spec) {
        // cleanup
    }
}

class UserRepositoryTest : FunSpec({
    val dbExt = DatabaseExtension()
    register(dbExt)

    test("save and find user") {
        val repo = UserRepository(dbExt.db)
        // ...
    }
})
```

### Kover Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡

#### Gradle Ã©â€¦ÂÃ§Â½Â®

```kotlin
// build.gradle.kts
plugins {
    id("org.jetbrains.kotlinx.kover") version "0.9.7"
}

kover {
    reports {
        total {
            html { onCheck = true }
            xml { onCheck = true }
        }
        filters {
            excludes {
                classes("*.generated.*", "*.config.*")
            }
        }
        verify {
            rule {
                minBound(80) // Fail build below 80% coverage
            }
        }
    }
}
```

#### Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¥â€˜Â½Ã¤Â»Â¤

```bash
# Run tests with coverage
./gradlew koverHtmlReport

# Verify coverage thresholds
./gradlew koverVerify

# XML report for CI
./gradlew koverXmlReport

# View HTML report (use the command for your OS)
# macOS:   open build/reports/kover/html/index.html
# Linux:   xdg-open build/reports/kover/html/index.html
# Windows: start build/reports/kover/html/index.html
```

#### Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã§â€ºÂ®Ã¦Â â€¡

| Ã¤Â»Â£Ã§Â ÂÃ§Â±Â»Ã¥Å¾â€¹ | Ã§â€ºÂ®Ã¦Â â€¡ |
|-----------|--------|
| Ã¥â€¦Â³Ã©â€Â®Ã¤Â¸Å¡Ã¥Å Â¡Ã©â‚¬Â»Ã¨Â¾â€˜ | 100% |
| Ã¥â€¦Â¬Ã¥â€¦Â± API | 90%+ |
| Ã©â‚¬Å¡Ã§â€Â¨Ã¤Â»Â£Ã§Â Â | 80%+ |
| Ã§â€Å¸Ã¦Ë†ÂÃ§Å¡â€ž / Ã©â€¦ÂÃ§Â½Â®Ã¤Â»Â£Ã§Â Â | Ã¦Å½â€™Ã©â„¢Â¤ |

### Ktor testApplication Ã¦Âµâ€¹Ã¨Â¯â€¢

```kotlin
class ApiRoutesTest : FunSpec({
    test("GET /users returns list") {
        testApplication {
            application {
                configureRouting()
                configureSerialization()
            }

            val response = client.get("/users")

            response.status shouldBe HttpStatusCode.OK
            val users = response.body<List<UserResponse>>()
            users.shouldNotBeEmpty()
        }
    }

    test("POST /users creates user") {
        testApplication {
            application {
                configureRouting()
                configureSerialization()
            }

            val response = client.post("/users") {
                contentType(ContentType.Application.Json)
                setBody(CreateUserRequest("Alice", "alice@example.com"))
            }

            response.status shouldBe HttpStatusCode.Created
        }
    }
})
```

### Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€˜Â½Ã¤Â»Â¤

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests "com.example.UserServiceTest"

# Run specific test
./gradlew test --tests "com.example.UserServiceTest.getUser returns user when found"

# Run with verbose output
./gradlew test --info

# Run with coverage
./gradlew koverHtmlReport

# Run detekt (static analysis)
./gradlew detekt

# Run ktlint (formatting check)
./gradlew ktlintCheck

# Continuous testing
./gradlew test --continuous
```

### Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

**Ã¥Âºâ€Ã¥ÂÅ¡Ã¯Â¼Å¡**

* Ã¥â€¦Ë†Ã¥â€ â„¢Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Ë†TDDÃ¯Â¼â€°
* Ã¥Å“Â¨Ã¦â€¢Â´Ã¤Â¸ÂªÃ©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Â­Ã¤Â¸â‚¬Ã¨â€¡Â´Ã¥Å“Â°Ã¤Â½Â¿Ã§â€Â¨ Kotest Ã§Å¡â€žÃ¨Â§â€žÃ¨Å’Æ’Ã¦Â Â·Ã¥Â¼Â
* Ã¥Â¯Â¹Ã¦Å’â€šÃ¨ÂµÂ·Ã¥â€¡Â½Ã¦â€¢Â°Ã¤Â½Â¿Ã§â€Â¨ MockK Ã§Å¡â€ž `coEvery`/`coVerify`
* Ã¥Â¯Â¹Ã¥ÂÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â½Â¿Ã§â€Â¨ `runTest`
* Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¡Å’Ã¤Â¸ÂºÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥Â®Å¾Ã§Å½Â°
* Ã¥Â¯Â¹Ã§ÂºÂ¯Ã¥â€¡Â½Ã¦â€¢Â°Ã¤Â½Â¿Ã§â€Â¨Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¥Â±Å¾Ã¦â‚¬Â§Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢
* Ã¤Â¸ÂºÃ¦Â¸â€¦Ã¦â„¢Â°Ã¨ÂµÂ·Ã¨Â§ÂÃ¤Â½Â¿Ã§â€Â¨ `data class` Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€ºÂºÃ¤Â»Â¶

**Ã¤Â¸ÂÃ¥Âºâ€Ã¥ÂÅ¡Ã¯Â¼Å¡**

* Ã¦Â·Â·Ã¥ÂË†Ã¤Â½Â¿Ã§â€Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¡â€ Ã¦Å¾Â¶Ã¯Â¼Ë†Ã©â‚¬â€°Ã¦â€¹Â© Kotest Ã¥Â¹Â¶Ã¥ÂÅ¡Ã¦Å’ÂÃ¤Â½Â¿Ã§â€Â¨Ã¯Â¼â€°
* Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¯Â¼Ë†Ã¤Â½Â¿Ã§â€Â¨Ã§Å“Å¸Ã¥Â®Å¾Ã¥Â®Å¾Ã¤Â¾â€¹Ã¯Â¼â€°
* Ã¥Å“Â¨Ã¥ÂÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ `Thread.sleep()`Ã¯Â¼Ë†Ã¦â€Â¹Ã§â€Â¨ `advanceTimeBy`Ã¯Â¼â€°
* Ã¨Â·Â³Ã¨Â¿â€¡ TDD Ã¤Â¸Â­Ã§Å¡â€žÃ§ÂºÂ¢Ã¨â€°Â²Ã©ËœÂ¶Ã¦Â®Âµ
* Ã§â€ºÂ´Ã¦Å½Â¥Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Â§ÂÃ¦Å“â€°Ã¥â€¡Â½Ã¦â€¢Â°
* Ã¥Â¿Â½Ã§â€¢Â¥Ã¤Â¸ÂÃ§Â¨Â³Ã¥Â®Å¡Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢

### Ã¤Â¸Å½ CI/CD Ã©â€ºâ€ Ã¦Ë†Â

```yaml
# GitHub Actions example
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '21'

    - name: Run tests with coverage
      run: ./gradlew test koverXmlReport

    - name: Verify coverage
      run: ./gradlew koverVerify

    - name: Upload coverage
      uses: codecov/codecov-action@v5
      with:
        files: build/reports/kover/report.xml
        token: ${{ secrets.CODECOV_TOKEN }}
```

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â°Â±Ã¦ËœÂ¯Ã¦â€“â€¡Ã¦Â¡Â£Ã£â‚¬â€šÃ¥Â®Æ’Ã¤Â»Â¬Ã¥Â±â€¢Ã§Â¤ÂºÃ¤Âºâ€ Ã¤Â½Â Ã§Å¡â€ž Kotlin Ã¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã¥Â¦â€šÃ¤Â½â€¢Ã¤Â½Â¿Ã§â€Â¨Ã£â‚¬â€šÃ¤Â½Â¿Ã§â€Â¨ Kotest Ã¥Â¯Å’Ã¦Å“â€°Ã¨Â¡Â¨Ã§Å½Â°Ã¥Å â€ºÃ§Å¡â€žÃ¥Å’Â¹Ã©â€¦ÂÃ¥â„¢Â¨Ã¤Â½Â¿Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥ÂÂ¯Ã¨Â¯Â»Ã¯Â¼Å’Ã¥Â¹Â¶Ã¤Â½Â¿Ã§â€Â¨ MockK Ã¦ÂÂ¥Ã¦Â¸â€¦Ã¦â„¢Â°Ã¥Å“Â°Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã£â‚¬â€š
