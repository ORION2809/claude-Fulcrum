---
description: "Generate and run Kotlin tests: Kotest, MockK, coroutine testing, and Kover coverage."
agent: "agent"
---

# Kotlin Test

Generate idiomatic Kotlin tests following TDD methodology.

## Test Patterns
- **Kotest** with BehaviorSpec or FunSpec
- **MockK** for mocking
- **kotlinx-coroutines-test** for coroutine testing
- **Kover** for coverage

## Structure
```kotlin
class UserServiceTest : BehaviorSpec({
    val mockRepo = mockk<UserRepository>()
    val service = UserService(mockRepo)

    given("a valid user ID") {
        `when`("fetching the user") {
            coEvery { mockRepo.findById(1) } returns testUser

            then("returns the user") {
                val result = service.getUser(1)
                result shouldBe testUser
            }
        }
    }

    given("an invalid user ID") {
        `when`("fetching the user") {
            coEvery { mockRepo.findById(-1) } returns null

            then("throws NotFoundException") {
                shouldThrow<NotFoundException> {
                    service.getUser(-1)
                }
            }
        }
    }
})
```

## Coroutine Testing
Use `runTest` from `kotlinx-coroutines-test` for suspending functions.

{{{ input }}}
