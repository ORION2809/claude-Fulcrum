---
name: kotlin-patterns
description: Ã¦Æ’Â¯Ã§â€Â¨Ã§Å¡â€žKotlinÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂÃ¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ¥â€™Å’Ã§ÂºÂ¦Ã¥Â®Å¡Ã¯Â¼Å’Ã§â€Â¨Ã¤ÂºÅ½Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã¤Â¸â€Ã¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã§Å¡â€žKotlinÃ¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¯Â¼Å’Ã¥Å’â€¦Ã¦â€¹Â¬Ã¥ÂÂÃ§Â¨â€¹Ã£â‚¬ÂÃ§Â©ÂºÃ¥Â®â€°Ã¥â€¦Â¨Ã¥â€™Å’DSLÃ¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨Ã£â‚¬â€š
origin: claude-fulcrum
---

# Kotlin Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ©Â«ËœÃ¦â€¢Ë†Ã£â‚¬ÂÃ¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Å¡â€žÃ¦Æ’Â¯Ã§â€Â¨ Kotlin Ã¦Â¨Â¡Ã¥Â¼ÂÃ¤Â¸Å½Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š

## Ã¤Â½Â¿Ã§â€Â¨Ã¦â€”Â¶Ã¦Å“Âº

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Kotlin Ã¤Â»Â£Ã§Â Â
* Ã¥Â®Â¡Ã¦Å¸Â¥ Kotlin Ã¤Â»Â£Ã§Â Â
* Ã©â€¡ÂÃ¦Å¾â€žÃ§Å½Â°Ã¦Å“â€°Ã§Å¡â€ž Kotlin Ã¤Â»Â£Ã§Â Â
* Ã¨Â®Â¾Ã¨Â®Â¡ Kotlin Ã¦Â¨Â¡Ã¥Ââ€”Ã¦Ë†â€“Ã¥Âºâ€œ
* Ã©â€¦ÂÃ§Â½Â® Gradle Kotlin DSL Ã¦Å¾â€žÃ¥Â»Âº

## Ã¥Â·Â¥Ã¤Â½Å“Ã¥Å½Å¸Ã§Ââ€ 

Ã¦Å“Â¬Ã¦Å â‚¬Ã¨Æ’Â½Ã¥Å“Â¨Ã¤Â¸Æ’Ã¤Â¸ÂªÃ¥â€¦Â³Ã©â€Â®Ã©Â¢â€ Ã¥Å¸Å¸Ã¥Â¼ÂºÃ¥Ë†Â¶Ã¦â€°Â§Ã¨Â¡Å’Ã¦Æ’Â¯Ã§â€Â¨Ã§Å¡â€ž Kotlin Ã§ÂºÂ¦Ã¥Â®Å¡Ã¯Â¼Å¡Ã¤Â½Â¿Ã§â€Â¨Ã§Â±Â»Ã¥Å¾â€¹Ã§Â³Â»Ã§Â»Å¸Ã¥â€™Å’Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â°Æ’Ã§â€Â¨Ã¨Â¿ÂÃ§Â®â€”Ã§Â¬Â¦Ã¥Â®Å¾Ã§Å½Â°Ã§Â©ÂºÃ¥Â®â€°Ã¥â€¦Â¨Ã¯Â¼â€ºÃ©â‚¬Å¡Ã¨Â¿â€¡Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã§Å¡â€ž `val` Ã¥â€™Å’ `copy()` Ã¥Â®Å¾Ã§Å½Â°Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¦â‚¬Â§Ã¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¥Â¯â€ Ã¥Â°ÂÃ§Â±Â»Ã¥â€™Å’Ã¦Å½Â¥Ã¥ÂÂ£Ã¥Â®Å¾Ã§Å½Â°Ã§Â©Â·Ã¤Â¸Â¾Ã§Â±Â»Ã¥Å¾â€¹Ã¥Â±â€šÃ¦Â¬Â¡Ã§Â»â€œÃ¦Å¾â€žÃ¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¥ÂÂÃ§Â¨â€¹Ã¥â€™Å’ `Flow` Ã¥Â®Å¾Ã§Å½Â°Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¦â€°Â©Ã¥Â±â€¢Ã¥â€¡Â½Ã¦â€¢Â°Ã¥Å“Â¨Ã¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨Ã§Â»Â§Ã¦â€°Â¿Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¦Â·Â»Ã¥Å Â Ã¨Â¡Å’Ã¤Â¸ÂºÃ¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨ `@DslMarker` Ã¥â€™Å’ lambda Ã¦Å½Â¥Ã¦â€Â¶Ã¥â„¢Â¨Ã¦Å¾â€žÃ¥Â»ÂºÃ§Â±Â»Ã¥Å¾â€¹Ã¥Â®â€°Ã¥â€¦Â¨Ã§Å¡â€ž DSLÃ¯Â¼â€ºÃ¤Â»Â¥Ã¥ÂÅ Ã¤Â½Â¿Ã§â€Â¨ Gradle Kotlin DSL Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Å¾â€žÃ¥Â»ÂºÃ©â€¦ÂÃ§Â½Â®Ã£â‚¬â€š

## Ã§Â¤ÂºÃ¤Â¾â€¹

**Ã¤Â½Â¿Ã§â€Â¨ Elvis Ã¨Â¿ÂÃ§Â®â€”Ã§Â¬Â¦Ã¥Â®Å¾Ã§Å½Â°Ã§Â©ÂºÃ¥Â®â€°Ã¥â€¦Â¨Ã¯Â¼Å¡**

```kotlin
fun getUserEmail(userId: String): String {
    val user = userRepository.findById(userId)
    return user?.email ?: "unknown@example.com"
}
```

**Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¯â€ Ã¥Â°ÂÃ§Â±Â»Ã¥Â¤â€žÃ§Ââ€ Ã§Â©Â·Ã¤Â¸Â¾Ã§Â»â€œÃ¦Å¾Å“Ã¯Â¼Å¡**

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Failure(val error: AppError) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}
```

**Ã¤Â½Â¿Ã§â€Â¨ async/await Ã¥Â®Å¾Ã§Å½Â°Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã¯Â¼Å¡**

```kotlin
suspend fun fetchUserWithPosts(userId: String): UserProfile =
    coroutineScope {
        val user = async { userService.getUser(userId) }
        val posts = async { postService.getUserPosts(userId) }
        UserProfile(user = user.await(), posts = posts.await())
    }
```

## Ã¦Â Â¸Ã¥Â¿Æ’Ã¥Å½Å¸Ã¥Ë†â„¢

### 1. Ã§Â©ÂºÃ¥Â®â€°Ã¥â€¦Â¨

Kotlin Ã§Å¡â€žÃ§Â±Â»Ã¥Å¾â€¹Ã§Â³Â»Ã§Â»Å¸Ã¥Å’ÂºÃ¥Ë†â€ Ã¥ÂÂ¯Ã§Â©ÂºÃ¥â€™Å’Ã¤Â¸ÂÃ¥ÂÂ¯Ã§Â©ÂºÃ§Â±Â»Ã¥Å¾â€¹Ã£â‚¬â€šÃ¥â€¦â€¦Ã¥Ë†â€ Ã¥Ë†Â©Ã§â€Â¨Ã¥Â®Æ’Ã£â‚¬â€š

```kotlin
// Good: Use non-nullable types by default
fun getUser(id: String): User {
    return userRepository.findById(id)
        ?: throw UserNotFoundException("User $id not found")
}

// Good: Safe calls and Elvis operator
fun getUserEmail(userId: String): String {
    val user = userRepository.findById(userId)
    return user?.email ?: "unknown@example.com"
}

// Bad: Force-unwrapping nullable types
fun getUserEmail(userId: String): String {
    val user = userRepository.findById(userId)
    return user!!.email // Throws NPE if null
}
```

### 2. Ã©Â»ËœÃ¨Â®Â¤Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¦â‚¬Â§

Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨ `val` Ã¨â‚¬Å’Ã©ÂÅ¾ `var`Ã¯Â¼Å’Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ©â€ºâ€ Ã¥ÂË†Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥ÂÂ¯Ã¥ÂËœÃ©â€ºâ€ Ã¥ÂË†Ã£â‚¬â€š

```kotlin
// Good: Immutable data
data class User(
    val id: String,
    val name: String,
    val email: String,
)

// Good: Transform with copy()
fun updateEmail(user: User, newEmail: String): User =
    user.copy(email = newEmail)

// Good: Immutable collections
val users: List<User> = listOf(user1, user2)
val filtered = users.filter { it.email.isNotBlank() }

// Bad: Mutable state
var currentUser: User? = null // Avoid mutable global state
val mutableUsers = mutableListOf<User>() // Avoid unless truly needed
```

### 3. Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼ÂÃ¤Â½â€œÃ¥â€™Å’Ã¥Ââ€¢Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼ÂÃ¥â€¡Â½Ã¦â€¢Â°

Ã¤Â½Â¿Ã§â€Â¨Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼ÂÃ¤Â½â€œÃ§Â¼â€“Ã¥â€ â„¢Ã§Â®â‚¬Ã¦Â´ÂÃ£â‚¬ÂÃ¥ÂÂ¯Ã¨Â¯Â»Ã§Å¡â€žÃ¥â€¡Â½Ã¦â€¢Â°Ã£â‚¬â€š

```kotlin
// Good: Expression body
fun isAdult(age: Int): Boolean = age >= 18

fun formatFullName(first: String, last: String): String =
    "$first $last".trim()

fun User.displayName(): String =
    name.ifBlank { email.substringBefore('@') }

// Good: When as expression
fun statusMessage(code: Int): String = when (code) {
    200 -> "OK"
    404 -> "Not Found"
    500 -> "Internal Server Error"
    else -> "Unknown status: $code"
}

// Bad: Unnecessary block body
fun isAdult(age: Int): Boolean {
    return age >= 18
}
```

### 4. Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã§â€Â¨Ã¤ÂºÅ½Ã¥â‚¬Â¼Ã¥Â¯Â¹Ã¨Â±Â¡

Ã¤Â½Â¿Ã§â€Â¨Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¨Â¡Â¨Ã§Â¤ÂºÃ¤Â¸Â»Ã¨Â¦ÂÃ¥Å’â€¦Ã¥ÂÂ«Ã¦â€¢Â°Ã¦ÂÂ®Ã§Å¡â€žÃ§Â±Â»Ã¥Å¾â€¹Ã£â‚¬â€š

```kotlin
// Good: Data class with copy, equals, hashCode, toString
data class CreateUserRequest(
    val name: String,
    val email: String,
    val role: Role = Role.USER,
)

// Good: Value class for type safety (zero overhead at runtime)
@JvmInline
value class UserId(val value: String) {
    init {
        require(value.isNotBlank()) { "UserId cannot be blank" }
    }
}

@JvmInline
value class Email(val value: String) {
    init {
        require('@' in value) { "Invalid email: $value" }
    }
}

fun getUser(id: UserId): User = userRepository.findById(id)
```

## Ã¥Â¯â€ Ã¥Â°ÂÃ§Â±Â»Ã¥â€™Å’Ã¦Å½Â¥Ã¥ÂÂ£

### Ã¥Â»ÂºÃ¦Â¨Â¡Ã¥Ââ€”Ã©â„¢ÂÃ§Å¡â€žÃ¥Â±â€šÃ¦Â¬Â¡Ã§Â»â€œÃ¦Å¾â€ž

```kotlin
// Good: Sealed class for exhaustive when
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Failure(val error: AppError) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}

fun <T> Result<T>.getOrNull(): T? = when (this) {
    is Result.Success -> data
    is Result.Failure -> null
    is Result.Loading -> null
}

fun <T> Result<T>.getOrThrow(): T = when (this) {
    is Result.Success -> data
    is Result.Failure -> throw error.toException()
    is Result.Loading -> throw IllegalStateException("Still loading")
}
```

### Ã§â€Â¨Ã¤ÂºÅ½ API Ã¥â€œÂÃ¥Âºâ€Ã§Å¡â€žÃ¥Â¯â€ Ã¥Â°ÂÃ¦Å½Â¥Ã¥ÂÂ£

```kotlin
sealed interface ApiError {
    val message: String

    data class NotFound(override val message: String) : ApiError
    data class Unauthorized(override val message: String) : ApiError
    data class Validation(
        override val message: String,
        val field: String,
    ) : ApiError
    data class Internal(
        override val message: String,
        val cause: Throwable? = null,
    ) : ApiError
}

fun ApiError.toStatusCode(): Int = when (this) {
    is ApiError.NotFound -> 404
    is ApiError.Unauthorized -> 401
    is ApiError.Validation -> 422
    is ApiError.Internal -> 500
}
```

## Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã¥â€¡Â½Ã¦â€¢Â°

### Ã¤Â½â€¢Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã¥Ââ€žÃ¤Â¸ÂªÃ¥â€¡Â½Ã¦â€¢Â°

```kotlin
// let: Transform nullable or scoped result
val length: Int? = name?.let { it.trim().length }

// apply: Configure an object (returns the object)
val user = User().apply {
    name = "Alice"
    email = "alice@example.com"
}

// also: Side effects (returns the object)
val user = createUser(request).also { logger.info("Created user: ${it.id}") }

// run: Execute a block with receiver (returns result)
val result = connection.run {
    prepareStatement(sql)
    executeQuery()
}

// with: Non-extension form of run
val csv = with(StringBuilder()) {
    appendLine("name,email")
    users.forEach { appendLine("${it.name},${it.email}") }
    toString()
}
```

### Ã¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

```kotlin
// Bad: Nesting scope functions
user?.let { u ->
    u.address?.let { addr ->
        addr.city?.let { city ->
            println(city) // Hard to read
        }
    }
}

// Good: Chain safe calls instead
val city = user?.address?.city
city?.let { println(it) }
```

## Ã¦â€°Â©Ã¥Â±â€¢Ã¥â€¡Â½Ã¦â€¢Â°

### Ã¥Å“Â¨Ã¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨Ã§Â»Â§Ã¦â€°Â¿Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¦Â·Â»Ã¥Å Â Ã¥Å Å¸Ã¨Æ’Â½

```kotlin
// Good: Domain-specific extensions
fun String.toSlug(): String =
    lowercase()
        .replace(Regex("[^a-z0-9\\s-]"), "")
        .replace(Regex("\\s+"), "-")
        .trim('-')

fun Instant.toLocalDate(zone: ZoneId = ZoneId.systemDefault()): LocalDate =
    atZone(zone).toLocalDate()

// Good: Collection extensions
fun <T> List<T>.second(): T = this[1]

fun <T> List<T>.secondOrNull(): T? = getOrNull(1)

// Good: Scoped extensions (not polluting global namespace)
class UserService {
    private fun User.isActive(): Boolean =
        status == Status.ACTIVE && lastLogin.isAfter(Instant.now().minus(30, ChronoUnit.DAYS))

    fun getActiveUsers(): List<User> = userRepository.findAll().filter { it.isActive() }
}
```

## Ã¥ÂÂÃ§Â¨â€¹

### Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜

```kotlin
// Good: Structured concurrency with coroutineScope
suspend fun fetchUserWithPosts(userId: String): UserProfile =
    coroutineScope {
        val userDeferred = async { userService.getUser(userId) }
        val postsDeferred = async { postService.getUserPosts(userId) }

        UserProfile(
            user = userDeferred.await(),
            posts = postsDeferred.await(),
        )
    }

// Good: supervisorScope when children can fail independently
suspend fun fetchDashboard(userId: String): Dashboard =
    supervisorScope {
        val user = async { userService.getUser(userId) }
        val notifications = async { notificationService.getRecent(userId) }
        val recommendations = async { recommendationService.getFor(userId) }

        Dashboard(
            user = user.await(),
            notifications = try {
                notifications.await()
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                emptyList()
            },
            recommendations = try {
                recommendations.await()
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                emptyList()
            },
        )
    }
```

### Flow Ã§â€Â¨Ã¤ÂºÅ½Ã¥â€œÂÃ¥Âºâ€Ã¥Â¼ÂÃ¦ÂµÂ

```kotlin
// Good: Cold flow with proper error handling
fun observeUsers(): Flow<List<User>> = flow {
    while (currentCoroutineContext().isActive) {
        val users = userRepository.findAll()
        emit(users)
        delay(5.seconds)
    }
}.catch { e ->
    logger.error("Error observing users", e)
    emit(emptyList())
}

// Good: Flow operators
fun searchUsers(query: Flow<String>): Flow<List<User>> =
    query
        .debounce(300.milliseconds)
        .distinctUntilChanged()
        .filter { it.length >= 2 }
        .mapLatest { q -> userRepository.search(q) }
        .catch { emit(emptyList()) }
```

### Ã¥Ââ€“Ã¦Â¶Ë†Ã¤Â¸Å½Ã¦Â¸â€¦Ã§Ââ€ 

```kotlin
// Good: Respect cancellation
suspend fun processItems(items: List<Item>) {
    items.forEach { item ->
        ensureActive() // Check cancellation before expensive work
        processItem(item)
    }
}

// Good: Cleanup with try/finally
suspend fun acquireAndProcess() {
    val resource = acquireResource()
    try {
        resource.process()
    } finally {
        withContext(NonCancellable) {
            resource.release() // Always release, even on cancellation
        }
    }
}
```

## Ã¥Â§â€Ã¦â€°Ëœ

### Ã¥Â±Å¾Ã¦â‚¬Â§Ã¥Â§â€Ã¦â€°Ëœ

```kotlin
// Lazy initialization
val expensiveData: List<User> by lazy {
    userRepository.findAll()
}

// Observable property
var name: String by Delegates.observable("initial") { _, old, new ->
    logger.info("Name changed from '$old' to '$new'")
}

// Map-backed properties
class Config(private val map: Map<String, Any?>) {
    val host: String by map
    val port: Int by map
    val debug: Boolean by map
}

val config = Config(mapOf("host" to "localhost", "port" to 8080, "debug" to true))
```

### Ã¦Å½Â¥Ã¥ÂÂ£Ã¥Â§â€Ã¦â€°Ëœ

```kotlin
// Good: Delegate interface implementation
class LoggingUserRepository(
    private val delegate: UserRepository,
    private val logger: Logger,
) : UserRepository by delegate {
    // Only override what you need to add logging to
    override suspend fun findById(id: String): User? {
        logger.info("Finding user by id: $id")
        return delegate.findById(id).also {
            logger.info("Found user: ${it?.name ?: "null"}")
        }
    }
}
```

## DSL Ã¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨

### Ã§Â±Â»Ã¥Å¾â€¹Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨

```kotlin
// Good: DSL with @DslMarker
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class HTML {
    private val children = mutableListOf<Element>()

    fun head(init: Head.() -> Unit) {
        children += Head().apply(init)
    }

    fun body(init: Body.() -> Unit) {
        children += Body().apply(init)
    }

    override fun toString(): String = children.joinToString("\n")
}

fun html(init: HTML.() -> Unit): HTML = HTML().apply(init)

// Usage
val page = html {
    head { title("My Page") }
    body {
        h1("Welcome")
        p("Hello, World!")
    }
}
```

### Ã©â€¦ÂÃ§Â½Â® DSL

```kotlin
data class ServerConfig(
    val host: String = "0.0.0.0",
    val port: Int = 8080,
    val ssl: SslConfig? = null,
    val database: DatabaseConfig? = null,
)

data class SslConfig(val certPath: String, val keyPath: String)
data class DatabaseConfig(val url: String, val maxPoolSize: Int = 10)

class ServerConfigBuilder {
    var host: String = "0.0.0.0"
    var port: Int = 8080
    private var ssl: SslConfig? = null
    private var database: DatabaseConfig? = null

    fun ssl(certPath: String, keyPath: String) {
        ssl = SslConfig(certPath, keyPath)
    }

    fun database(url: String, maxPoolSize: Int = 10) {
        database = DatabaseConfig(url, maxPoolSize)
    }

    fun build(): ServerConfig = ServerConfig(host, port, ssl, database)
}

fun serverConfig(init: ServerConfigBuilder.() -> Unit): ServerConfig =
    ServerConfigBuilder().apply(init).build()

// Usage
val config = serverConfig {
    host = "0.0.0.0"
    port = 443
    ssl("/certs/cert.pem", "/certs/key.pem")
    database("jdbc:postgresql://localhost:5432/mydb", maxPoolSize = 20)
}
```

## Ã§â€Â¨Ã¤ÂºÅ½Ã¦Æ’Â°Ã¦â‚¬Â§Ã¦Â±â€šÃ¥â‚¬Â¼Ã§Å¡â€žÃ¥ÂºÂÃ¥Ë†â€”

```kotlin
// Good: Use sequences for large collections with multiple operations
val result = users.asSequence()
    .filter { it.isActive }
    .map { it.email }
    .filter { it.endsWith("@company.com") }
    .take(10)
    .toList()

// Good: Generate infinite sequences
val fibonacci: Sequence<Long> = sequence {
    var a = 0L
    var b = 1L
    while (true) {
        yield(a)
        val next = a + b
        a = b
        b = next
    }
}

val first20 = fibonacci.take(20).toList()
```

## Gradle Kotlin DSL

### build.gradle.kts Ã©â€¦ÂÃ§Â½Â®

```kotlin
// Check for latest versions: https://kotlinlang.org/docs/releases.html
plugins {
    kotlin("jvm") version "2.3.10"
    kotlin("plugin.serialization") version "2.3.10"
    id("io.ktor.plugin") version "3.4.0"
    id("org.jetbrains.kotlinx.kover") version "0.9.7"
    id("io.gitlab.arturbosch.detekt") version "1.23.8"
}

group = "com.example"
version = "1.0.0"

kotlin {
    jvmToolchain(21)
}

dependencies {
    // Ktor
    implementation("io.ktor:ktor-server-core:3.4.0")
    implementation("io.ktor:ktor-server-netty:3.4.0")
    implementation("io.ktor:ktor-server-content-negotiation:3.4.0")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.4.0")

    // Exposed
    implementation("org.jetbrains.exposed:exposed-core:1.0.0")
    implementation("org.jetbrains.exposed:exposed-dao:1.0.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0")
    implementation("org.jetbrains.exposed:exposed-kotlin-datetime:1.0.0")

    // Koin
    implementation("io.insert-koin:koin-ktor:4.2.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")

    // Testing
    testImplementation("io.kotest:kotest-runner-junit5:6.1.4")
    testImplementation("io.kotest:kotest-assertions-core:6.1.4")
    testImplementation("io.kotest:kotest-property:6.1.4")
    testImplementation("io.mockk:mockk:1.14.9")
    testImplementation("io.ktor:ktor-server-test-host:3.4.0")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.2")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

detekt {
    config.setFrom(files("config/detekt/detekt.yml"))
    buildUponDefaultConfig = true
}
```

## Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¦Â¨Â¡Ã¥Â¼Â

### Ã§â€Â¨Ã¤ÂºÅ½Ã©Â¢â€ Ã¥Å¸Å¸Ã¦â€œÂÃ¤Â½Å“Ã§Å¡â€ž Result Ã§Â±Â»Ã¥Å¾â€¹

```kotlin
// Good: Use Kotlin's Result or a custom sealed class
suspend fun createUser(request: CreateUserRequest): Result<User> = runCatching {
    require(request.name.isNotBlank()) { "Name cannot be blank" }
    require('@' in request.email) { "Invalid email format" }

    val user = User(
        id = UserId(UUID.randomUUID().toString()),
        name = request.name,
        email = Email(request.email),
    )
    userRepository.save(user)
    user
}

// Good: Chain results
val displayName = createUser(request)
    .map { it.name }
    .getOrElse { "Unknown" }
```

### require, check, error

```kotlin
// Good: Preconditions with clear messages
fun withdraw(account: Account, amount: Money): Account {
    require(amount.value > 0) { "Amount must be positive: $amount" }
    check(account.balance >= amount) { "Insufficient balance: ${account.balance} < $amount" }

    return account.copy(balance = account.balance - amount)
}
```

## Ã©â€ºâ€ Ã¥ÂË†Ã¦â€œÂÃ¤Â½Å“

### Ã¦Æ’Â¯Ã§â€Â¨Ã§Å¡â€žÃ©â€ºâ€ Ã¥ÂË†Ã¥Â¤â€žÃ§Ââ€ 

```kotlin
// Good: Chained operations
val activeAdminEmails: List<String> = users
    .filter { it.role == Role.ADMIN && it.isActive }
    .sortedBy { it.name }
    .map { it.email }

// Good: Grouping and aggregation
val usersByRole: Map<Role, List<User>> = users.groupBy { it.role }

val oldestByRole: Map<Role, User?> = users.groupBy { it.role }
    .mapValues { (_, users) -> users.minByOrNull { it.createdAt } }

// Good: Associate for map creation
val usersById: Map<UserId, User> = users.associateBy { it.id }

// Good: Partition for splitting
val (active, inactive) = users.partition { it.isActive }
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’Ã¯Â¼Å¡Kotlin Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢

| Ã¦Æ’Â¯Ã§â€Â¨Ã¦Â³â€¢ | Ã¦ÂÂÃ¨Â¿Â° |
|-------|-------------|
| `val` Ã¤Â¼ËœÃ¤ÂºÅ½ `var` | Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¥ÂËœÃ©â€¡Â |
| `data class` | Ã§â€Â¨Ã¤ÂºÅ½Ã¥â€¦Â·Ã¦Å“â€° equals/hashCode/copy Ã§Å¡â€žÃ¥â‚¬Â¼Ã¥Â¯Â¹Ã¨Â±Â¡ |
| `sealed class/interface` | Ã§â€Â¨Ã¤ÂºÅ½Ã¥Ââ€”Ã©â„¢ÂÃ§Å¡â€žÃ§Â±Â»Ã¥Å¾â€¹Ã¥Â±â€šÃ¦Â¬Â¡Ã§Â»â€œÃ¦Å¾â€ž |
| `value class` | Ã§â€Â¨Ã¤ÂºÅ½Ã©â€ºÂ¶Ã¥Â¼â‚¬Ã©â€â‚¬Ã§Å¡â€žÃ§Â±Â»Ã¥Å¾â€¹Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Å’â€¦Ã¨Â£â€¦Ã¥â„¢Â¨ |
| Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼Â `when` | Ã§Â©Â·Ã¤Â¸Â¾Ã¦Â¨Â¡Ã¥Â¼ÂÃ¥Å’Â¹Ã©â€¦Â |
| Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â°Æ’Ã§â€Â¨ `?.` | Ã§Â©ÂºÃ¥Â®â€°Ã¥â€¦Â¨Ã§Å¡â€žÃ¦Ë†ÂÃ¥â€˜ËœÃ¨Â®Â¿Ã©â€”Â® |
| Elvis `?:` | Ã¤Â¸ÂºÃ¥ÂÂ¯Ã§Â©ÂºÃ§Â±Â»Ã¥Å¾â€¹Ã¦ÂÂÃ¤Â¾â€ºÃ©Â»ËœÃ¨Â®Â¤Ã¥â‚¬Â¼ |
| `let`/`apply`/`also`/`run`/`with` | Ã§â€Â¨Ã¤ÂºÅ½Ã§Â¼â€“Ã¥â€ â„¢Ã§Â®â‚¬Ã¦Â´ÂÃ¤Â»Â£Ã§Â ÂÃ§Å¡â€žÃ¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã¥â€¡Â½Ã¦â€¢Â° |
| Ã¦â€°Â©Ã¥Â±â€¢Ã¥â€¡Â½Ã¦â€¢Â° | Ã¥Å“Â¨Ã¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨Ã§Â»Â§Ã¦â€°Â¿Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¦Â·Â»Ã¥Å Â Ã¨Â¡Å’Ã¤Â¸Âº |
| `copy()` | Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¤Â¸Å Ã§Å¡â€žÃ¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¦â€ºÂ´Ã¦â€“Â° |
| `require`/`check` | Ã¥â€°ÂÃ§Â½Â®Ã¦ÂÂ¡Ã¤Â»Â¶Ã¦â€“Â­Ã¨Â¨â‚¬ |
| Ã¥ÂÂÃ§Â¨â€¹ `async`/`await` | Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦â€°Â§Ã¨Â¡Å’ |
| `Flow` | Ã¥â€ Â·Ã¥â€œÂÃ¥Âºâ€Ã¥Â¼ÂÃ¦ÂµÂ |
| `sequence` | Ã¦Æ’Â°Ã¦â‚¬Â§Ã¦Â±â€šÃ¥â‚¬Â¼ |
| Ã¥Â§â€Ã¦â€°Ëœ `by` | Ã¥Å“Â¨Ã¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨Ã§Â»Â§Ã¦â€°Â¿Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã©â€¡ÂÃ§â€Â¨Ã¥Â®Å¾Ã§Å½Â° |

## Ã¥Âºâ€Ã©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

```kotlin
// Bad: Force-unwrapping nullable types
val name = user!!.name

// Bad: Platform type leakage from Java
fun getLength(s: String) = s.length // Safe
fun getLength(s: String?) = s?.length ?: 0 // Handle nulls from Java

// Bad: Mutable data classes
data class MutableUser(var name: String, var email: String)

// Bad: Using exceptions for control flow
try {
    val user = findUser(id)
} catch (e: NotFoundException) {
    // Don't use exceptions for expected cases
}

// Good: Use nullable return or Result
val user: User? = findUserOrNull(id)

// Bad: Ignoring coroutine scope
GlobalScope.launch { /* Avoid GlobalScope */ }

// Good: Use structured concurrency
coroutineScope {
    launch { /* Properly scoped */ }
}

// Bad: Deeply nested scope functions
user?.let { u ->
    u.address?.let { a ->
        a.city?.let { c -> process(c) }
    }
}

// Good: Direct null-safe chain
user?.address?.city?.let { process(it) }
```

**Ã¨Â¯Â·Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Kotlin Ã¤Â»Â£Ã§Â ÂÃ¥Âºâ€Ã§Â®â‚¬Ã¦Â´ÂÃ¤Â½â€ Ã¥ÂÂ¯Ã¨Â¯Â»Ã£â‚¬â€šÃ¥Ë†Â©Ã§â€Â¨Ã§Â±Â»Ã¥Å¾â€¹Ã§Â³Â»Ã§Â»Å¸Ã§Â¡Â®Ã¤Â¿ÂÃ¥Â®â€°Ã¥â€¦Â¨Ã¯Â¼Å’Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¦â‚¬Â§Ã¯Â¼Å’Ã¥Â¹Â¶Ã¤Â½Â¿Ã§â€Â¨Ã¥ÂÂÃ§Â¨â€¹Ã¥Â¤â€žÃ§Ââ€ Ã¥Â¹Â¶Ã¥Ââ€˜Ã£â‚¬â€šÃ¥Â¦â€šÃ¦Å“â€°Ã§â€“â€˜Ã©â€”Â®Ã¯Â¼Å’Ã¨Â®Â©Ã§Â¼â€“Ã¨Â¯â€˜Ã¥â„¢Â¨Ã¥Â¸Â®Ã¥Å Â©Ã¤Â½Â Ã£â‚¬â€š
