---
name: android-clean-architecture
description: Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½AndroidÃ¥â€™Å’KotlinÃ¥Â¤Å¡Ã¥Â¹Â³Ã¥ÂÂ°Ã©Â¡Â¹Ã§â€ºÂ®Ã§Å¡â€žClean ArchitectureÃ¦Â¨Â¡Ã¥Â¼ÂÃ¢â‚¬â€Ã¢â‚¬â€Ã¦Â¨Â¡Ã¥Ââ€”Ã§Â»â€œÃ¦Å¾â€žÃ£â‚¬ÂÃ¤Â¾ÂÃ¨Âµâ€“Ã¨Â§â€žÃ¥Ë†â„¢Ã£â‚¬ÂÃ§â€Â¨Ã¤Â¾â€¹Ã£â‚¬ÂÃ¤Â»â€œÃ¥Âºâ€œÃ¤Â»Â¥Ã¥ÂÅ Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Â±â€šÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
origin: claude-fulcrum
---

# Android Ã¦â€¢Â´Ã¦Â´ÂÃ¦Å¾Â¶Ã¦Å¾â€ž

Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ Android Ã¥â€™Å’ KMP Ã©Â¡Â¹Ã§â€ºÂ®Ã§Å¡â€žÃ¦â€¢Â´Ã¦Â´ÂÃ¦Å¾Â¶Ã¦Å¾â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€šÃ¦Â¶ÂµÃ§â€ºâ€“Ã¦Â¨Â¡Ã¥Ââ€”Ã¨Â¾Â¹Ã§â€¢Å’Ã£â‚¬ÂÃ¤Â¾ÂÃ¨Âµâ€“Ã¥ÂÂÃ¨Â½Â¬Ã£â‚¬ÂUseCase/Repository Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã¤Â»Â¥Ã¥ÂÅ Ã¤Â½Â¿Ã§â€Â¨ RoomÃ£â‚¬ÂSQLDelight Ã¥â€™Å’ Ktor Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Â±â€šÃ¨Â®Â¾Ã¨Â®Â¡Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¦Å¾â€žÃ¥Â»Âº Android Ã¦Ë†â€“ KMP Ã©Â¡Â¹Ã§â€ºÂ®Ã¦Â¨Â¡Ã¥Ââ€”Ã§Â»â€œÃ¦Å¾â€ž
* Ã¥Â®Å¾Ã§Å½Â° UseCasesÃ£â‚¬ÂRepositories Ã¦Ë†â€“ DataSources
* Ã¨Â®Â¾Ã¨Â®Â¡Ã¥Ââ€žÃ¥Â±â€šÃ¯Â¼Ë†Ã©Â¢â€ Ã¥Å¸Å¸Ã¥Â±â€šÃ£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Â±â€šÃ£â‚¬ÂÃ¨Â¡Â¨Ã§Â¤ÂºÃ¥Â±â€šÃ¯Â¼â€°Ã¤Â¹â€¹Ã©â€”Â´Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¦ÂµÂ
* Ã¤Â½Â¿Ã§â€Â¨ Koin Ã¦Ë†â€“ Hilt Ã¨Â®Â¾Ã§Â½Â®Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥
* Ã¥Å“Â¨Ã¥Ë†â€ Ã¥Â±â€šÃ¦Å¾Â¶Ã¦Å¾â€žÃ¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ RoomÃ£â‚¬ÂSQLDelight Ã¦Ë†â€“ Ktor

## Ã¦Â¨Â¡Ã¥Ââ€”Ã§Â»â€œÃ¦Å¾â€ž

### Ã¦Å½Â¨Ã¨ÂÂÃ¥Â¸Æ’Ã¥Â±â‚¬

```
project/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ app/                  # Android entry point, DI wiring, Application class
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ core/                 # Shared utilities, base classes, error types
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ domain/               # UseCases, domain models, repository interfaces (pure Kotlin)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ data/                 # Repository implementations, DataSources, DB, network
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ presentation/         # Screens, ViewModels, UI models, navigation
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ design-system/        # Reusable Compose components, theme, typography
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ feature/              # Feature modules (optional, for larger projects)
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ auth/
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ settings/
    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ profile/
```

### Ã¤Â¾ÂÃ¨Âµâ€“Ã¨Â§â€žÃ¥Ë†â„¢

```
app Ã¢â€ â€™ presentation, domain, data, core
presentation Ã¢â€ â€™ domain, design-system, core
data Ã¢â€ â€™ domain, core
domain Ã¢â€ â€™ core (or no dependencies)
core Ã¢â€ â€™ (nothing)
```

**Ã¥â€¦Â³Ã©â€Â®**Ã¯Â¼Å¡`domain` Ã§Â»ÂÃ¤Â¸ÂÃ¨Æ’Â½Ã¤Â¾ÂÃ¨Âµâ€“ `data`Ã£â‚¬Â`presentation` Ã¦Ë†â€“Ã¤Â»Â»Ã¤Â½â€¢Ã¦Â¡â€ Ã¦Å¾Â¶Ã£â‚¬â€šÃ¥Â®Æ’Ã¤Â»â€¦Ã¥Å’â€¦Ã¥ÂÂ«Ã§ÂºÂ¯ Kotlin Ã¤Â»Â£Ã§Â ÂÃ£â‚¬â€š

## Ã©Â¢â€ Ã¥Å¸Å¸Ã¥Â±â€š

### UseCase Ã¦Â¨Â¡Ã¥Â¼Â

Ã¦Â¯ÂÃ¤Â¸Âª UseCase Ã¤Â»Â£Ã¨Â¡Â¨Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¤Â¸Å¡Ã¥Å Â¡Ã¦â€œÂÃ¤Â½Å“Ã£â‚¬â€šÃ¤Â½Â¿Ã§â€Â¨ `operator fun invoke` Ã¤Â»Â¥Ã¨Å½Â·Ã¥Â¾â€”Ã§Â®â‚¬Ã¦Â´ÂÃ§Å¡â€žÃ¨Â°Æ’Ã§â€Â¨Ã§â€šÂ¹Ã¯Â¼Å¡

```kotlin
class GetItemsByCategoryUseCase(
    private val repository: ItemRepository
) {
    suspend operator fun invoke(category: String): Result<List<Item>> {
        return repository.getItemsByCategory(category)
    }
}

// Flow-based UseCase for reactive streams
class ObserveUserProgressUseCase(
    private val repository: UserRepository
) {
    operator fun invoke(userId: String): Flow<UserProgress> {
        return repository.observeProgress(userId)
    }
}
```

### Ã©Â¢â€ Ã¥Å¸Å¸Ã¦Â¨Â¡Ã¥Å¾â€¹

Ã©Â¢â€ Ã¥Å¸Å¸Ã¦Â¨Â¡Ã¥Å¾â€¹Ã¦ËœÂ¯Ã¦â„¢Â®Ã©â‚¬Å¡Ã§Å¡â€ž Kotlin Ã¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¢â‚¬â€Ã¢â‚¬â€Ã¦Â²Â¡Ã¦Å“â€°Ã¦Â¡â€ Ã¦Å¾Â¶Ã¦Â³Â¨Ã¨Â§Â£Ã¯Â¼Å¡

```kotlin
data class Item(
    val id: String,
    val title: String,
    val description: String,
    val tags: List<String>,
    val status: Status,
    val category: String
)

enum class Status { DRAFT, ACTIVE, ARCHIVED }
```

### Ã¤Â»â€œÃ¥Âºâ€œÃ¦Å½Â¥Ã¥ÂÂ£

Ã¥Å“Â¨Ã©Â¢â€ Ã¥Å¸Å¸Ã¥Â±â€šÃ¥Â®Å¡Ã¤Â¹â€°Ã¯Â¼Å’Ã¥Å“Â¨Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Â±â€šÃ¥Â®Å¾Ã§Å½Â°Ã¯Â¼Å¡

```kotlin
interface ItemRepository {
    suspend fun getItemsByCategory(category: String): Result<List<Item>>
    suspend fun saveItem(item: Item): Result<Unit>
    fun observeItems(): Flow<List<Item>>
}
```

## Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Â±â€š

### Ã¤Â»â€œÃ¥Âºâ€œÃ¥Â®Å¾Ã§Å½Â°

Ã¥ÂÂÃ¨Â°Æ’Ã¦Å“Â¬Ã¥Å“Â°Ã¥â€™Å’Ã¨Â¿Å“Ã§Â¨â€¹Ã¦â€¢Â°Ã¦ÂÂ®Ã¦ÂºÂÃ¯Â¼Å¡

```kotlin
class ItemRepositoryImpl(
    private val localDataSource: ItemLocalDataSource,
    private val remoteDataSource: ItemRemoteDataSource
) : ItemRepository {

    override suspend fun getItemsByCategory(category: String): Result<List<Item>> {
        return runCatching {
            val remote = remoteDataSource.fetchItems(category)
            localDataSource.insertItems(remote.map { it.toEntity() })
            localDataSource.getItemsByCategory(category).map { it.toDomain() }
        }
    }

    override suspend fun saveItem(item: Item): Result<Unit> {
        return runCatching {
            localDataSource.insertItems(listOf(item.toEntity()))
        }
    }

    override fun observeItems(): Flow<List<Item>> {
        return localDataSource.observeAll().map { entities ->
            entities.map { it.toDomain() }
        }
    }
}
```

### Ã¦ËœÂ Ã¥Â°â€žÃ¥â„¢Â¨Ã¦Â¨Â¡Ã¥Â¼Â

Ã¥Â°â€ Ã¦ËœÂ Ã¥Â°â€žÃ¥â„¢Â¨Ã¤Â½Å“Ã¤Â¸ÂºÃ¦â€°Â©Ã¥Â±â€¢Ã¥â€¡Â½Ã¦â€¢Â°Ã¦â€Â¾Ã¥Å“Â¨Ã¦â€¢Â°Ã¦ÂÂ®Ã¦Â¨Â¡Ã¥Å¾â€¹Ã©â„¢â€žÃ¨Â¿â€˜Ã¯Â¼Å¡

```kotlin
// In data layer
fun ItemEntity.toDomain() = Item(
    id = id,
    title = title,
    description = description,
    tags = tags.split("|"),
    status = Status.valueOf(status),
    category = category
)

fun ItemDto.toEntity() = ItemEntity(
    id = id,
    title = title,
    description = description,
    tags = tags.joinToString("|"),
    status = status,
    category = category
)
```

### Room Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œ (Android)

```kotlin
@Entity(tableName = "items")
data class ItemEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val tags: String,
    val status: String,
    val category: String
)

@Dao
interface ItemDao {
    @Query("SELECT * FROM items WHERE category = :category")
    suspend fun getByCategory(category: String): List<ItemEntity>

    @Upsert
    suspend fun upsert(items: List<ItemEntity>)

    @Query("SELECT * FROM items")
    fun observeAll(): Flow<List<ItemEntity>>
}
```

### SQLDelight (KMP)

```sql
-- Item.sq
CREATE TABLE ItemEntity (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL
);

getByCategory:
SELECT * FROM ItemEntity WHERE category = ?;

upsert:
INSERT OR REPLACE INTO ItemEntity (id, title, description, tags, status, category)
VALUES (?, ?, ?, ?, ?, ?);

observeAll:
SELECT * FROM ItemEntity;
```

### Ktor Ã§Â½â€˜Ã§Â»Å“Ã¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯ (KMP)

```kotlin
class ItemRemoteDataSource(private val client: HttpClient) {

    suspend fun fetchItems(category: String): List<ItemDto> {
        return client.get("api/items") {
            parameter("category", category)
        }.body()
    }
}

// HttpClient setup with content negotiation
val httpClient = HttpClient {
    install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
    install(Logging) { level = LogLevel.HEADERS }
    defaultRequest { url("https://api.example.com/") }
}
```

## Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥

### Koin (Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ KMP)

```kotlin
// Domain module
val domainModule = module {
    factory { GetItemsByCategoryUseCase(get()) }
    factory { ObserveUserProgressUseCase(get()) }
}

// Data module
val dataModule = module {
    single<ItemRepository> { ItemRepositoryImpl(get(), get()) }
    single { ItemLocalDataSource(get()) }
    single { ItemRemoteDataSource(get()) }
}

// Presentation module
val presentationModule = module {
    viewModelOf(::ItemListViewModel)
    viewModelOf(::DashboardViewModel)
}
```

### Hilt (Ã¤Â»â€¦Ã©â„¢Â Android)

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindItemRepository(impl: ItemRepositoryImpl): ItemRepository
}

@HiltViewModel
class ItemListViewModel @Inject constructor(
    private val getItems: GetItemsByCategoryUseCase
) : ViewModel()
```

## Ã©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ 

### Result/Try Ã¦Â¨Â¡Ã¥Â¼Â

Ã¤Â½Â¿Ã§â€Â¨ `Result<T>` Ã¦Ë†â€“Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¥Â¯â€ Ã¥Â°ÂÃ§Â±Â»Ã¥Å¾â€¹Ã¨Â¿â€ºÃ¨Â¡Å’Ã©â€â„¢Ã¨Â¯Â¯Ã¤Â¼Â Ã¦â€™Â­Ã¯Â¼Å¡

```kotlin
sealed interface Try<out T> {
    data class Success<T>(val value: T) : Try<T>
    data class Failure(val error: AppError) : Try<Nothing>
}

sealed interface AppError {
    data class Network(val message: String) : AppError
    data class Database(val message: String) : AppError
    data object Unauthorized : AppError
}

// In ViewModel Ã¢â‚¬â€ map to UI state
viewModelScope.launch {
    when (val result = getItems(category)) {
        is Try.Success -> _state.update { it.copy(items = result.value, isLoading = false) }
        is Try.Failure -> _state.update { it.copy(error = result.error.toMessage(), isLoading = false) }
    }
}
```

## Ã§ÂºÂ¦Ã¥Â®Å¡Ã¦Ââ€™Ã¤Â»Â¶ (Gradle)

Ã¥Â¯Â¹Ã¤ÂºÅ½ KMP Ã©Â¡Â¹Ã§â€ºÂ®Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨Ã§ÂºÂ¦Ã¥Â®Å¡Ã¦Ââ€™Ã¤Â»Â¶Ã¤Â»Â¥Ã¥â€¡ÂÃ¥Â°â€˜Ã¦Å¾â€žÃ¥Â»ÂºÃ¦â€“â€¡Ã¤Â»Â¶Ã©â€¡ÂÃ¥Â¤ÂÃ¯Â¼Å¡

```kotlin
// build-logic/src/main/kotlin/kmp-library.gradle.kts
plugins {
    id("org.jetbrains.kotlin.multiplatform")
}

kotlin {
    androidTarget()
    iosX64(); iosArm64(); iosSimulatorArm64()
    sourceSets {
        commonMain.dependencies { /* shared deps */ }
        commonTest.dependencies { implementation(kotlin("test")) }
    }
}
```

Ã¥Å“Â¨Ã¦Â¨Â¡Ã¥Ââ€”Ã¤Â¸Â­Ã¥Âºâ€Ã§â€Â¨Ã¯Â¼Å¡

```kotlin
// domain/build.gradle.kts
plugins { id("kmp-library") }
```

## Ã¥Âºâ€Ã©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

* Ã¥Å“Â¨ `domain` Ã¤Â¸Â­Ã¥Â¯Â¼Ã¥â€¦Â¥ Android Ã¦Â¡â€ Ã¦Å¾Â¶Ã§Â±Â»Ã¢â‚¬â€Ã¢â‚¬â€Ã¤Â¿ÂÃ¦Å’ÂÃ¥â€¦Â¶Ã¤Â¸ÂºÃ§ÂºÂ¯ Kotlin
* Ã¥Ââ€˜ UI Ã¥Â±â€šÃ¦Å¡Â´Ã©Å“Â²Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¥Â®Å¾Ã¤Â½â€œÃ¦Ë†â€“ DTOÃ¢â‚¬â€Ã¢â‚¬â€Ã¥Â§â€¹Ã§Â»Ë†Ã¦ËœÂ Ã¥Â°â€žÃ¥Ë†Â°Ã©Â¢â€ Ã¥Å¸Å¸Ã¦Â¨Â¡Ã¥Å¾â€¹
* Ã¥Â°â€ Ã¤Â¸Å¡Ã¥Å Â¡Ã©â‚¬Â»Ã¨Â¾â€˜Ã¦â€Â¾Ã¥Å“Â¨ ViewModels Ã¤Â¸Â­Ã¢â‚¬â€Ã¢â‚¬â€Ã¦ÂÂÃ¥Ââ€“Ã¥Ë†Â° UseCases
* Ã¤Â½Â¿Ã§â€Â¨ `GlobalScope` Ã¦Ë†â€“Ã©ÂÅ¾Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥ÂÂÃ§Â¨â€¹Ã¢â‚¬â€Ã¢â‚¬â€Ã¤Â½Â¿Ã§â€Â¨ `viewModelScope` Ã¦Ë†â€“Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜
* Ã¨â€¡Æ’Ã¨â€šÂ¿Ã§Å¡â€žÃ¤Â»â€œÃ¥Âºâ€œÃ¥Â®Å¾Ã§Å½Â°Ã¢â‚¬â€Ã¢â‚¬â€Ã¦â€¹â€ Ã¥Ë†â€ Ã¤Â¸ÂºÃ¤Â¸â€œÃ¦Â³Â¨Ã§Å¡â€ž DataSources
* Ã¥Â¾ÂªÃ§Å½Â¯Ã¦Â¨Â¡Ã¥Ââ€”Ã¤Â¾ÂÃ¨Âµâ€“Ã¢â‚¬â€Ã¢â‚¬â€Ã¥Â¦â€šÃ¦Å¾Å“ A Ã¤Â¾ÂÃ¨Âµâ€“ BÃ¯Â¼Å’Ã¥Ë†â„¢ B Ã§Â»ÂÃ¤Â¸ÂÃ¨Æ’Â½Ã¤Â¾ÂÃ¨Âµâ€“ A

## Ã¥Ââ€šÃ¨â‚¬Æ’

Ã¦Å¸Â¥Ã§Å“â€¹Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`compose-multiplatform-patterns` Ã¤Âºâ€ Ã¨Â§Â£ UI Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
Ã¦Å¸Â¥Ã§Å“â€¹Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`kotlin-coroutines-flows` Ã¤Âºâ€ Ã¨Â§Â£Ã¥Â¼â€šÃ¦Â­Â¥Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
