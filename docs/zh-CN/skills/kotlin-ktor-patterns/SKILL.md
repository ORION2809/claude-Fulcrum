---
name: kotlin-ktor-patterns
description: Ktor Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã¥Å’â€¦Ã¦â€¹Â¬Ã¨Â·Â¯Ã§â€Â± DSLÃ£â‚¬ÂÃ¦Ââ€™Ã¤Â»Â¶Ã£â‚¬ÂÃ¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂKoin DIÃ£â‚¬Âkotlinx.serializationÃ£â‚¬ÂWebSockets Ã¥â€™Å’ testApplication Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬â€š
origin: claude-fulcrum
---

# Ktor Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã¦Â¨Â¡Ã¥Â¼Â

Ã¤Â½Â¿Ã§â€Â¨ Kotlin Ã¥ÂÂÃ§Â¨â€¹Ã¦Å¾â€žÃ¥Â»ÂºÃ¥ÂÂ¥Ã¥Â£Â®Ã£â‚¬ÂÃ¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã§Å¡â€ž HTTP Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã§Å¡â€žÃ§Â»Â¼Ã¥ÂË† Ktor Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¦Å¾â€žÃ¥Â»Âº Ktor HTTP Ã¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨
* Ã©â€¦ÂÃ§Â½Â® Ktor Ã¦Ââ€™Ã¤Â»Â¶Ã¯Â¼Ë†AuthÃ£â‚¬ÂCORSÃ£â‚¬ÂContentNegotiationÃ£â‚¬ÂStatusPagesÃ¯Â¼â€°
* Ã¤Â½Â¿Ã§â€Â¨ Ktor Ã¥Â®Å¾Ã§Å½Â° REST API
* Ã¤Â½Â¿Ã§â€Â¨ Koin Ã¨Â®Â¾Ã§Â½Â®Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥
* Ã¤Â½Â¿Ã§â€Â¨ testApplication Ã§Â¼â€“Ã¥â€ â„¢ Ktor Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢
* Ã¥Å“Â¨ Ktor Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ WebSocket

## Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Â»â€œÃ¦Å¾â€ž

### Ã¦Â â€¡Ã¥â€¡â€  Ktor Ã©Â¡Â¹Ã§â€ºÂ®Ã¥Â¸Æ’Ã¥Â±â‚¬

```text
src/main/kotlin/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ com/example/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Application.kt           # Entry point, module configuration
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ plugins/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Routing.kt           # Route definitions
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Serialization.kt     # Content negotiation setup
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Authentication.kt    # Auth configuration
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ StatusPages.kt       # Error handling
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ CORS.kt              # CORS configuration
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ routes/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ UserRoutes.kt        # /users endpoints
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ AuthRoutes.kt        # /auth endpoints
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ HealthRoutes.kt      # /health endpoints
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ models/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ User.kt              # Domain models
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ ApiResponse.kt       # Response envelopes
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ services/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ UserService.kt       # Business logic
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ AuthService.kt       # Auth logic
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ repositories/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ UserRepository.kt    # Data access interface
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ ExposedUserRepository.kt
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ di/
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ AppModule.kt         # Koin modules
src/test/kotlin/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ com/example/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ routes/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ UserRoutesTest.kt
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ services/
Ã¢â€â€š       Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ UserServiceTest.kt
```

### Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¥â€¦Â¥Ã¥ÂÂ£Ã§â€šÂ¹

```kotlin
// Application.kt
fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}

fun Application.module() {
    configureSerialization()
    configureAuthentication()
    configureStatusPages()
    configureCORS()
    configureDI()
    configureRouting()
}
```

## Ã¨Â·Â¯Ã§â€Â± DSL

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¨Â·Â¯Ã§â€Â±

```kotlin
// plugins/Routing.kt
fun Application.configureRouting() {
    routing {
        userRoutes()
        authRoutes()
        healthRoutes()
    }
}

// routes/UserRoutes.kt
fun Route.userRoutes() {
    val userService by inject<UserService>()

    route("/users") {
        get {
            val users = userService.getAll()
            call.respond(users)
        }

        get("/{id}") {
            val id = call.parameters["id"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing id")
            val user = userService.getById(id)
                ?: return@get call.respond(HttpStatusCode.NotFound)
            call.respond(user)
        }

        post {
            val request = call.receive<CreateUserRequest>()
            val user = userService.create(request)
            call.respond(HttpStatusCode.Created, user)
        }

        put("/{id}") {
            val id = call.parameters["id"]
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing id")
            val request = call.receive<UpdateUserRequest>()
            val user = userService.update(id, request)
                ?: return@put call.respond(HttpStatusCode.NotFound)
            call.respond(user)
        }

        delete("/{id}") {
            val id = call.parameters["id"]
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Missing id")
            val deleted = userService.delete(id)
            if (deleted) call.respond(HttpStatusCode.NoContent)
            else call.respond(HttpStatusCode.NotFound)
        }
    }
}
```

### Ã¤Â½Â¿Ã§â€Â¨Ã¨Â®Â¤Ã¨Â¯ÂÃ¨Â·Â¯Ã§â€Â±Ã§Â»â€žÃ§Â»â€¡Ã¨Â·Â¯Ã§â€Â±

```kotlin
fun Route.userRoutes() {
    route("/users") {
        // Public routes
        get { /* list users */ }
        get("/{id}") { /* get user */ }

        // Protected routes
        authenticate("jwt") {
            post { /* create user - requires auth */ }
            put("/{id}") { /* update user - requires auth */ }
            delete("/{id}") { /* delete user - requires auth */ }
        }
    }
}
```

## Ã¥â€ â€¦Ã¥Â®Â¹Ã¥ÂÂÃ¥â€¢â€ Ã¤Â¸Å½Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“

### kotlinx.serialization Ã¨Â®Â¾Ã§Â½Â®

```kotlin
// plugins/Serialization.kt
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = false
            ignoreUnknownKeys = true
            encodeDefaults = true
            explicitNulls = false
        })
    }
}
```

### Ã¥ÂÂ¯Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¦Â¨Â¡Ã¥Å¾â€¹

```kotlin
@Serializable
data class UserResponse(
    val id: String,
    val name: String,
    val email: String,
    val role: Role,
    @Serializable(with = InstantSerializer::class)
    val createdAt: Instant,
)

@Serializable
data class CreateUserRequest(
    val name: String,
    val email: String,
    val role: Role = Role.USER,
)

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null,
) {
    companion object {
        fun <T> ok(data: T): ApiResponse<T> = ApiResponse(success = true, data = data)
        fun <T> error(message: String): ApiResponse<T> = ApiResponse(success = false, error = message)
    }
}

@Serializable
data class PaginatedResponse<T>(
    val data: List<T>,
    val total: Long,
    val page: Int,
    val limit: Int,
)
```

### Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¥â„¢Â¨

```kotlin
object InstantSerializer : KSerializer<Instant> {
    override val descriptor = PrimitiveSerialDescriptor("Instant", PrimitiveKind.STRING)
    override fun serialize(encoder: Encoder, value: Instant) =
        encoder.encodeString(value.toString())
    override fun deserialize(decoder: Decoder): Instant =
        Instant.parse(decoder.decodeString())
}
```

## Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯Â

### JWT Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯Â

```kotlin
// plugins/Authentication.kt
fun Application.configureAuthentication() {
    val jwtSecret = environment.config.property("jwt.secret").getString()
    val jwtIssuer = environment.config.property("jwt.issuer").getString()
    val jwtAudience = environment.config.property("jwt.audience").getString()
    val jwtRealm = environment.config.property("jwt.realm").getString()

    install(Authentication) {
        jwt("jwt") {
            realm = jwtRealm
            verifier(
                JWT.require(Algorithm.HMAC256(jwtSecret))
                    .withAudience(jwtAudience)
                    .withIssuer(jwtIssuer)
                    .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, ApiResponse.error<Unit>("Invalid or expired token"))
            }
        }
    }
}

// Extracting user from JWT
fun ApplicationCall.userId(): String =
    principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("userId")
        ?.asString()
        ?: throw AuthenticationException("No userId in token")
```

### Ã¨Â®Â¤Ã¨Â¯ÂÃ¨Â·Â¯Ã§â€Â±

```kotlin
fun Route.authRoutes() {
    val authService by inject<AuthService>()

    route("/auth") {
        post("/login") {
            val request = call.receive<LoginRequest>()
            val token = authService.login(request.email, request.password)
                ?: return@post call.respond(
                    HttpStatusCode.Unauthorized,
                    ApiResponse.error<Unit>("Invalid credentials"),
                )
            call.respond(ApiResponse.ok(TokenResponse(token)))
        }

        post("/register") {
            val request = call.receive<RegisterRequest>()
            val user = authService.register(request)
            call.respond(HttpStatusCode.Created, ApiResponse.ok(user))
        }

        authenticate("jwt") {
            get("/me") {
                val userId = call.userId()
                val user = authService.getProfile(userId)
                call.respond(ApiResponse.ok(user))
            }
        }
    }
}
```

## Ã§Å Â¶Ã¦â‚¬ÂÃ©Â¡ÂµÃ¯Â¼Ë†Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¯Â¼â€°

```kotlin
// plugins/StatusPages.kt
fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<ContentTransformationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse.error<Unit>("Invalid request body: ${cause.message}"),
            )
        }

        exception<IllegalArgumentException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ApiResponse.error<Unit>(cause.message ?: "Bad request"),
            )
        }

        exception<AuthenticationException> { call, _ ->
            call.respond(
                HttpStatusCode.Unauthorized,
                ApiResponse.error<Unit>("Authentication required"),
            )
        }

        exception<AuthorizationException> { call, _ ->
            call.respond(
                HttpStatusCode.Forbidden,
                ApiResponse.error<Unit>("Access denied"),
            )
        }

        exception<NotFoundException> { call, cause ->
            call.respond(
                HttpStatusCode.NotFound,
                ApiResponse.error<Unit>(cause.message ?: "Resource not found"),
            )
        }

        exception<Throwable> { call, cause ->
            call.application.log.error("Unhandled exception", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ApiResponse.error<Unit>("Internal server error"),
            )
        }

        status(HttpStatusCode.NotFound) { call, status ->
            call.respond(status, ApiResponse.error<Unit>("Route not found"))
        }
    }
}
```

## CORS Ã©â€¦ÂÃ§Â½Â®

```kotlin
// plugins/CORS.kt
fun Application.configureCORS() {
    install(CORS) {
        allowHost("localhost:3000")
        allowHost("example.com", schemes = listOf("https"))
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowCredentials = true
        maxAgeInSeconds = 3600
    }
}
```

## Koin Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥

### Ã¦Â¨Â¡Ã¥Ââ€”Ã¥Â®Å¡Ã¤Â¹â€°

```kotlin
// di/AppModule.kt
val appModule = module {
    // Database
    single<Database> { DatabaseFactory.create(get()) }

    // Repositories
    single<UserRepository> { ExposedUserRepository(get()) }
    single<OrderRepository> { ExposedOrderRepository(get()) }

    // Services
    single { UserService(get()) }
    single { OrderService(get(), get()) }
    single { AuthService(get(), get()) }
}

// Application setup
fun Application.configureDI() {
    install(Koin) {
        modules(appModule)
    }
}
```

### Ã¥Å“Â¨Ã¨Â·Â¯Ã§â€Â±Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ Koin

```kotlin
fun Route.userRoutes() {
    val userService by inject<UserService>()

    route("/users") {
        get {
            val users = userService.getAll()
            call.respond(ApiResponse.ok(users))
        }
    }
}
```

### Ã§â€Â¨Ã¤ÂºÅ½Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€ž Koin

```kotlin
class UserServiceTest : FunSpec(), KoinTest {
    override fun extensions() = listOf(KoinExtension(testModule))

    private val testModule = module {
        single<UserRepository> { mockk() }
        single { UserService(get()) }
    }

    private val repository by inject<UserRepository>()
    private val service by inject<UserService>()

    init {
        test("getUser returns user") {
            coEvery { repository.findById("1") } returns testUser
            service.getById("1") shouldBe testUser
        }
    }
}
```

## Ã¨Â¯Â·Ã¦Â±â€šÃ©ÂªÅ’Ã¨Â¯Â

```kotlin
// Validate request data in routes
fun Route.userRoutes() {
    val userService by inject<UserService>()

    post("/users") {
        val request = call.receive<CreateUserRequest>()

        // Validate
        require(request.name.isNotBlank()) { "Name is required" }
        require(request.name.length <= 100) { "Name must be 100 characters or less" }
        require(request.email.matches(Regex(".+@.+\\..+"))) { "Invalid email format" }

        val user = userService.create(request)
        call.respond(HttpStatusCode.Created, ApiResponse.ok(user))
    }
}

// Or use a validation extension
fun CreateUserRequest.validate() {
    require(name.isNotBlank()) { "Name is required" }
    require(name.length <= 100) { "Name must be 100 characters or less" }
    require(email.matches(Regex(".+@.+\\..+"))) { "Invalid email format" }
}
```

## WebSocket

```kotlin
fun Application.configureWebSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = 64 * 1024 // 64 KiB Ã¢â‚¬â€ increase only if your protocol requires larger frames
        masking = false // Server-to-client frames are unmasked per RFC 6455; client-to-server are always masked by Ktor
    }
}

fun Route.chatRoutes() {
    val connections = Collections.synchronizedSet<Connection>(LinkedHashSet())

    webSocket("/chat") {
        val thisConnection = Connection(this)
        connections += thisConnection

        try {
            send("Connected! Users online: ${connections.size}")

            for (frame in incoming) {
                frame as? Frame.Text ?: continue
                val text = frame.readText()
                val message = ChatMessage(thisConnection.name, text)

                // Snapshot under lock to avoid ConcurrentModificationException
                val snapshot = synchronized(connections) { connections.toList() }
                snapshot.forEach { conn ->
                    conn.session.send(Json.encodeToString(message))
                }
            }
        } catch (e: Exception) {
            logger.error("WebSocket error", e)
        } finally {
            connections -= thisConnection
        }
    }
}

data class Connection(val session: DefaultWebSocketSession) {
    val name: String = "User-${counter.getAndIncrement()}"

    companion object {
        private val counter = AtomicInteger(0)
    }
}
```

## testApplication Ã¦Âµâ€¹Ã¨Â¯â€¢

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¨Â·Â¯Ã§â€Â±Ã¦Âµâ€¹Ã¨Â¯â€¢

```kotlin
class UserRoutesTest : FunSpec({
    test("GET /users returns list of users") {
        testApplication {
            application {
                install(Koin) { modules(testModule) }
                configureSerialization()
                configureRouting()
            }

            val response = client.get("/users")

            response.status shouldBe HttpStatusCode.OK
            val body = response.body<ApiResponse<List<UserResponse>>>()
            body.success shouldBe true
            body.data.shouldNotBeNull().shouldNotBeEmpty()
        }
    }

    test("POST /users creates a user") {
        testApplication {
            application {
                install(Koin) { modules(testModule) }
                configureSerialization()
                configureStatusPages()
                configureRouting()
            }

            val client = createClient {
                install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                    json()
                }
            }

            val response = client.post("/users") {
                contentType(ContentType.Application.Json)
                setBody(CreateUserRequest("Alice", "alice@example.com"))
            }

            response.status shouldBe HttpStatusCode.Created
        }
    }

    test("GET /users/{id} returns 404 for unknown id") {
        testApplication {
            application {
                install(Koin) { modules(testModule) }
                configureSerialization()
                configureStatusPages()
                configureRouting()
            }

            val response = client.get("/users/unknown-id")

            response.status shouldBe HttpStatusCode.NotFound
        }
    }
})
```

### Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â®Â¤Ã¨Â¯ÂÃ¨Â·Â¯Ã§â€Â±

```kotlin
class AuthenticatedRoutesTest : FunSpec({
    test("protected route requires JWT") {
        testApplication {
            application {
                install(Koin) { modules(testModule) }
                configureSerialization()
                configureAuthentication()
                configureRouting()
            }

            val response = client.post("/users") {
                contentType(ContentType.Application.Json)
                setBody(CreateUserRequest("Alice", "alice@example.com"))
            }

            response.status shouldBe HttpStatusCode.Unauthorized
        }
    }

    test("protected route succeeds with valid JWT") {
        testApplication {
            application {
                install(Koin) { modules(testModule) }
                configureSerialization()
                configureAuthentication()
                configureRouting()
            }

            val token = generateTestJWT(userId = "test-user")

            val client = createClient {
                install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json() }
            }

            val response = client.post("/users") {
                contentType(ContentType.Application.Json)
                bearerAuth(token)
                setBody(CreateUserRequest("Alice", "alice@example.com"))
            }

            response.status shouldBe HttpStatusCode.Created
        }
    }
})
```

## Ã©â€¦ÂÃ§Â½Â®

### application.yaml

```yaml
ktor:
  application:
    modules:
      - com.example.ApplicationKt.module
  deployment:
    port: 8080

jwt:
  secret: ${JWT_SECRET}
  issuer: "https://example.com"
  audience: "https://example.com/api"
  realm: "example"

database:
  url: ${DATABASE_URL}
  driver: "org.postgresql.Driver"
  maxPoolSize: 10
```

### Ã¨Â¯Â»Ã¥Ââ€“Ã©â€¦ÂÃ§Â½Â®

```kotlin
fun Application.configureDI() {
    val dbUrl = environment.config.property("database.url").getString()
    val dbDriver = environment.config.property("database.driver").getString()
    val maxPoolSize = environment.config.property("database.maxPoolSize").getString().toInt()

    install(Koin) {
        modules(module {
            single { DatabaseConfig(dbUrl, dbDriver, maxPoolSize) }
            single { DatabaseFactory.create(get()) }
        })
    }
}
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’Ã¯Â¼Å¡Ktor Ã¦Â¨Â¡Ã¥Â¼Â

| Ã¦Â¨Â¡Ã¥Â¼Â | Ã¦ÂÂÃ¨Â¿Â° |
|---------|-------------|
| `route("/path") { get { } }` | Ã¤Â½Â¿Ã§â€Â¨ DSL Ã¨Â¿â€ºÃ¨Â¡Å’Ã¨Â·Â¯Ã§â€Â±Ã¥Ë†â€ Ã§Â»â€ž |
| `call.receive<T>()` | Ã¥ÂÂÃ¥ÂºÂÃ¥Ë†â€”Ã¥Å’â€“Ã¨Â¯Â·Ã¦Â±â€šÃ¤Â½â€œ |
| `call.respond(status, body)` | Ã¥Ââ€˜Ã©â‚¬ÂÃ¥Â¸Â¦Ã§Å Â¶Ã¦â‚¬ÂÃ§Å¡â€žÃ¥â€œÂÃ¥Âºâ€ |
| `call.parameters["id"]` | Ã¨Â¯Â»Ã¥Ââ€“Ã¨Â·Â¯Ã¥Â¾â€žÃ¥Ââ€šÃ¦â€¢Â° |
| `call.request.queryParameters["q"]` | Ã¨Â¯Â»Ã¥Ââ€“Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¥Ââ€šÃ¦â€¢Â° |
| `install(Plugin) { }` | Ã¥Â®â€°Ã¨Â£â€¦Ã¥Â¹Â¶Ã©â€¦ÂÃ§Â½Â®Ã¦Ââ€™Ã¤Â»Â¶ |
| `authenticate("name") { }` | Ã¤Â½Â¿Ã§â€Â¨Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Â¿ÂÃ¦Å Â¤Ã¨Â·Â¯Ã§â€Â± |
| `by inject<T>()` | Koin Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥ |
| `testApplication { }` | Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢ |

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ktor Ã¦ËœÂ¯Ã¥â€ºÂ´Ã§Â»â€¢ Kotlin Ã¥ÂÂÃ§Â¨â€¹Ã¥â€™Å’ DSL Ã¨Â®Â¾Ã¨Â®Â¡Ã§Å¡â€žÃ£â‚¬â€šÃ¤Â¿ÂÃ¦Å’ÂÃ¨Â·Â¯Ã§â€Â±Ã§Â²Â¾Ã§Â®â‚¬Ã¯Â¼Å’Ã¥Â°â€ Ã©â‚¬Â»Ã¨Â¾â€˜Ã¦Å½Â¨Ã©â‚¬ÂÃ¥Ë†Â°Ã¦Å“ÂÃ¥Å Â¡Ã¥Â±â€šÃ¯Â¼Å’Ã¥Â¹Â¶Ã¤Â½Â¿Ã§â€Â¨ Koin Ã¨Â¿â€ºÃ¨Â¡Å’Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥Ã£â‚¬â€šÃ¤Â½Â¿Ã§â€Â¨ `testApplication` Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â»Â¥Ã¨Å½Â·Ã¥Â¾â€”Ã¥Â®Å’Ã¦â€¢Â´Ã§Å¡â€žÃ©â€ºâ€ Ã¦Ë†ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã£â‚¬â€š
