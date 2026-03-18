---
name: kotlin-coroutines-flows
description: KotlinÃ¥ÂÂÃ§Â¨â€¹Ã¤Â¸Å½FlowÃ¥Å“Â¨AndroidÃ¥â€™Å’KMPÃ¤Â¸Â­Ã§Å¡â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ¢â‚¬â€Ã¢â‚¬â€Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã£â‚¬ÂFlowÃ¦â€œÂÃ¤Â½Å“Ã§Â¬Â¦Ã£â‚¬ÂStateFlowÃ£â‚¬ÂÃ©â€â„¢Ã¨Â¯Â¯Ã¥Â¤â€žÃ§Ââ€ Ã¥â€™Å’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬â€š
origin: claude-fulcrum
---

# Kotlin Ã¥ÂÂÃ§Â¨â€¹Ã¤Â¸Å½ Flow

Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ Android Ã¥â€™Å’ Kotlin Ã¥Â¤Å¡Ã¥Â¹Â³Ã¥ÂÂ°Ã©Â¡Â¹Ã§â€ºÂ®Ã§Å¡â€žÃ§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂÃ¥Å¸ÂºÃ¤ÂºÅ½ Flow Ã§Å¡â€žÃ¥â€œÂÃ¥Âºâ€Ã¥Â¼ÂÃ¦ÂµÂÃ¤Â»Â¥Ã¥ÂÅ Ã¥ÂÂÃ§Â¨â€¹Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¤Â½Â¿Ã§â€Â¨ Kotlin Ã¥ÂÂÃ§Â¨â€¹Ã§Â¼â€“Ã¥â€ â„¢Ã¥Â¼â€šÃ¦Â­Â¥Ã¤Â»Â£Ã§Â Â
* Ã¤Â½Â¿Ã§â€Â¨ FlowÃ£â‚¬ÂStateFlow Ã¦Ë†â€“ SharedFlow Ã¥Â®Å¾Ã§Å½Â°Ã¥â€œÂÃ¥Âºâ€Ã¥Â¼ÂÃ¦â€¢Â°Ã¦ÂÂ®
* Ã¥Â¤â€žÃ§Ââ€ Ã¥Â¹Â¶Ã¥Ââ€˜Ã¦â€œÂÃ¤Â½Å“Ã¯Â¼Ë†Ã¥Â¹Â¶Ã¨Â¡Å’Ã¥Å Â Ã¨Â½Â½Ã£â‚¬ÂÃ©ËœÂ²Ã¦Å â€“Ã£â‚¬ÂÃ©â€¡ÂÃ¨Â¯â€¢Ã¯Â¼â€°
* Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥ÂÂÃ§Â¨â€¹Ã¥â€™Å’ Flow
* Ã§Â®Â¡Ã§Ââ€ Ã¥ÂÂÃ§Â¨â€¹Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã¤Â¸Å½Ã¥Ââ€“Ã¦Â¶Ë†

## Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜

### Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã¥Â±â€šÃ§ÂºÂ§

```
Application
  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ viewModelScope (ViewModel)
        Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ coroutineScope { } (structured child)
              Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ async { } (concurrent task)
              Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ async { } (concurrent task)
```

Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Â¹Â¶Ã¥Ââ€˜Ã¢â‚¬â€Ã¢â‚¬â€Ã§Â»ÂÃ¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨ `GlobalScope`Ã¯Â¼Å¡

```kotlin
// BAD
GlobalScope.launch { fetchData() }

// GOOD Ã¢â‚¬â€ scoped to ViewModel lifecycle
viewModelScope.launch { fetchData() }

// GOOD Ã¢â‚¬â€ scoped to composable lifecycle
LaunchedEffect(key) { fetchData() }
```

### Ã¥Â¹Â¶Ã¨Â¡Å’Ã¥Ë†â€ Ã¨Â§Â£

Ã¤Â½Â¿Ã§â€Â¨ `coroutineScope` + `async` Ã¥Â¤â€žÃ§Ââ€ Ã¥Â¹Â¶Ã¨Â¡Å’Ã¥Â·Â¥Ã¤Â½Å“Ã¯Â¼Å¡

```kotlin
suspend fun loadDashboard(): Dashboard = coroutineScope {
    val items = async { itemRepository.getRecent() }
    val stats = async { statsRepository.getToday() }
    val profile = async { userRepository.getCurrent() }
    Dashboard(
        items = items.await(),
        stats = stats.await(),
        profile = profile.await()
    )
}
```

### SupervisorScope

Ã¥Â½â€œÃ¥Â­ÂÃ¥ÂÂÃ§Â¨â€¹Ã¥Â¤Â±Ã¨Â´Â¥Ã¤Â¸ÂÃ¥Âºâ€Ã¥Ââ€“Ã¦Â¶Ë†Ã¥ÂÅ’Ã§ÂºÂ§Ã¥ÂÂÃ§Â¨â€¹Ã¦â€”Â¶Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `supervisorScope`Ã¯Â¼Å¡

```kotlin
suspend fun syncAll() = supervisorScope {
    launch { syncItems() }       // failure here won't cancel syncStats
    launch { syncStats() }
    launch { syncSettings() }
}
```

## Flow Ã¦Â¨Â¡Ã¥Â¼Â

### Cold Flow Ã¢â‚¬â€Ã¢â‚¬â€ Ã¤Â¸â‚¬Ã¦Â¬Â¡Ã¦â‚¬Â§Ã¦â€œÂÃ¤Â½Å“Ã¥Ë†Â°Ã¦ÂµÂÃ§Å¡â€žÃ¨Â½Â¬Ã¦ÂÂ¢

```kotlin
fun observeItems(): Flow<List<Item>> = flow {
    // Re-emits whenever the database changes
    itemDao.observeAll()
        .map { entities -> entities.map { it.toDomain() } }
        .collect { emit(it) }
}
```

### Ã§â€Â¨Ã¤ÂºÅ½ UI Ã§Å Â¶Ã¦â‚¬ÂÃ§Å¡â€ž StateFlow

```kotlin
class DashboardViewModel(
    observeProgress: ObserveUserProgressUseCase
) : ViewModel() {
    val progress: StateFlow<UserProgress> = observeProgress()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = UserProgress.EMPTY
        )
}
```

`WhileSubscribed(5_000)` Ã¤Â¼Å¡Ã¥Å“Â¨Ã¦Å“â‚¬Ã¥ÂÅ½Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¨Â®Â¢Ã©Ëœâ€¦Ã¨â‚¬â€¦Ã§Â¦Â»Ã¥Â¼â‚¬Ã¥ÂÅ½Ã¯Â¼Å’Ã¤Â¿ÂÃ¦Å’ÂÃ¤Â¸Å Ã¦Â¸Â¸Ã¦Â´Â»Ã¥Å Â¨ 5 Ã§Â§â€™Ã¢â‚¬â€Ã¢â‚¬â€Ã¥ÂÂ¯Ã¥Å“Â¨Ã©â€¦ÂÃ§Â½Â®Ã¦â€ºÂ´Ã¦â€Â¹Ã¦â€”Â¶Ã¥Â­ËœÃ¦Â´Â»Ã¨â‚¬Å’Ã¦â€”Â Ã©Å“â‚¬Ã©â€¡ÂÃ¥ÂÂ¯Ã£â‚¬â€š

### Ã§Â»â€žÃ¥ÂË†Ã¥Â¤Å¡Ã¤Â¸Âª Flow

```kotlin
val uiState: StateFlow<HomeState> = combine(
    itemRepository.observeItems(),
    settingsRepository.observeTheme(),
    userRepository.observeProfile()
) { items, theme, profile ->
    HomeState(items = items, theme = theme, profile = profile)
}.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HomeState())
```

### Flow Ã¦â€œÂÃ¤Â½Å“Ã§Â¬Â¦

```kotlin
// Debounce search input
searchQuery
    .debounce(300)
    .distinctUntilChanged()
    .flatMapLatest { query -> repository.search(query) }
    .catch { emit(emptyList()) }
    .collect { results -> _state.update { it.copy(results = results) } }

// Retry with exponential backoff
fun fetchWithRetry(): Flow<Data> = flow { emit(api.fetch()) }
    .retryWhen { cause, attempt ->
        if (cause is IOException && attempt < 3) {
            delay(1000L * (1 shl attempt.toInt()))
            true
        } else {
            false
        }
    }
```

### Ã§â€Â¨Ã¤ÂºÅ½Ã¤Â¸â‚¬Ã¦Â¬Â¡Ã¦â‚¬Â§Ã¤Âºâ€¹Ã¤Â»Â¶Ã§Å¡â€ž SharedFlow

```kotlin
class ItemListViewModel : ViewModel() {
    private val _effects = MutableSharedFlow<Effect>()
    val effects: SharedFlow<Effect> = _effects.asSharedFlow()

    sealed interface Effect {
        data class ShowSnackbar(val message: String) : Effect
        data class NavigateTo(val route: String) : Effect
    }

    private fun deleteItem(id: String) {
        viewModelScope.launch {
            repository.delete(id)
            _effects.emit(Effect.ShowSnackbar("Item deleted"))
        }
    }
}

// Collect in Composable
LaunchedEffect(Unit) {
    viewModel.effects.collect { effect ->
        when (effect) {
            is Effect.ShowSnackbar -> snackbarHostState.showSnackbar(effect.message)
            is Effect.NavigateTo -> navController.navigate(effect.route)
        }
    }
}
```

## Ã¨Â°Æ’Ã¥ÂºÂ¦Ã¥â„¢Â¨

```kotlin
// CPU-intensive work
withContext(Dispatchers.Default) { parseJson(largePayload) }

// IO-bound work
withContext(Dispatchers.IO) { database.query() }

// Main thread (UI) Ã¢â‚¬â€ default in viewModelScope
withContext(Dispatchers.Main) { updateUi() }
```

Ã¥Å“Â¨ KMP Ã¤Â¸Â­Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `Dispatchers.Default` Ã¥â€™Å’ `Dispatchers.Main`Ã¯Â¼Ë†Ã¥Å“Â¨Ã¦â€°â‚¬Ã¦Å“â€°Ã¥Â¹Â³Ã¥ÂÂ°Ã¤Â¸Å Ã¥ÂÂ¯Ã§â€Â¨Ã¯Â¼â€°Ã£â‚¬â€š`Dispatchers.IO` Ã¤Â»â€¦Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ JVM/AndroidÃ¢â‚¬â€Ã¢â‚¬â€Ã¥Å“Â¨Ã¥â€¦Â¶Ã¤Â»â€“Ã¥Â¹Â³Ã¥ÂÂ°Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `Dispatchers.Default` Ã¦Ë†â€“Ã©â‚¬Å¡Ã¨Â¿â€¡Ã¤Â¾ÂÃ¨Âµâ€“Ã¦Â³Â¨Ã¥â€¦Â¥Ã¦ÂÂÃ¤Â¾â€ºÃ£â‚¬â€š

## Ã¥Ââ€“Ã¦Â¶Ë†

### Ã¥ÂÂÃ¤Â½Å“Ã¥Â¼ÂÃ¥Ââ€“Ã¦Â¶Ë†

Ã©â€¢Â¿Ã¦â€”Â¶Ã©â€”Â´Ã¨Â¿ÂÃ¨Â¡Å’Ã§Å¡â€žÃ¥Â¾ÂªÃ§Å½Â¯Ã¥Â¿â€¦Ã©Â¡Â»Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¥Ââ€“Ã¦Â¶Ë†Ã§Å Â¶Ã¦â‚¬ÂÃ¯Â¼Å¡

```kotlin
suspend fun processItems(items: List<Item>) = coroutineScope {
    for (item in items) {
        ensureActive()  // throws CancellationException if cancelled
        process(item)
    }
}
```

### Ã¤Â½Â¿Ã§â€Â¨ try/finally Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Â¸â€¦Ã§Ââ€ 

```kotlin
viewModelScope.launch {
    try {
        _state.update { it.copy(isLoading = true) }
        val data = repository.fetch()
        _state.update { it.copy(data = data) }
    } finally {
        _state.update { it.copy(isLoading = false) }  // always runs, even on cancellation
    }
}
```

## Ã¦Âµâ€¹Ã¨Â¯â€¢

### Ã¤Â½Â¿Ã§â€Â¨ Turbine Ã¦Âµâ€¹Ã¨Â¯â€¢ StateFlow

```kotlin
@Test
fun `search updates item list`() = runTest {
    val fakeRepository = FakeItemRepository().apply { emit(testItems) }
    val viewModel = ItemListViewModel(GetItemsUseCase(fakeRepository))

    viewModel.state.test {
        assertEquals(ItemListState(), awaitItem())  // initial

        viewModel.onSearch("query")
        val loading = awaitItem()
        assertTrue(loading.isLoading)

        val loaded = awaitItem()
        assertFalse(loaded.isLoading)
        assertEquals(1, loaded.items.size)
    }
}
```

### Ã¤Â½Â¿Ã§â€Â¨ TestDispatcher Ã¦Âµâ€¹Ã¨Â¯â€¢

```kotlin
@Test
fun `parallel load completes correctly`() = runTest {
    val viewModel = DashboardViewModel(
        itemRepo = FakeItemRepo(),
        statsRepo = FakeStatsRepo()
    )

    viewModel.load()
    advanceUntilIdle()

    val state = viewModel.state.value
    assertNotNull(state.items)
    assertNotNull(state.stats)
}
```

### Ã¦Â¨Â¡Ã¦â€¹Å¸ Flow

```kotlin
class FakeItemRepository : ItemRepository {
    private val _items = MutableStateFlow<List<Item>>(emptyList())

    override fun observeItems(): Flow<List<Item>> = _items

    fun emit(items: List<Item>) { _items.value = items }

    override suspend fun getItemsByCategory(category: String): Result<List<Item>> {
        return Result.success(_items.value.filter { it.category == category })
    }
}
```

## Ã¥Âºâ€Ã©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

* Ã¤Â½Â¿Ã§â€Â¨ `GlobalScope`Ã¢â‚¬â€Ã¢â‚¬â€Ã¤Â¼Å¡Ã¥Â¯Â¼Ã¨â€¡Â´Ã¥ÂÂÃ§Â¨â€¹Ã¦Â³â€žÃ¦Â¼ÂÃ¯Â¼Å’Ã¤Â¸â€Ã¦â€”Â Ã¦Â³â€¢Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¥Ââ€“Ã¦Â¶Ë†
* Ã¥Å“Â¨Ã¦Â²Â¡Ã¦Å“â€°Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¤ÂºÅ½ `init {}` Ã¤Â¸Â­Ã¦â€Â¶Ã©â€ºâ€  FlowÃ¢â‚¬â€Ã¢â‚¬â€Ã¥Âºâ€Ã¤Â½Â¿Ã§â€Â¨ `viewModelScope.launch`
* Ã¥Â°â€  `MutableStateFlow` Ã¤Â¸Å½Ã¥ÂÂ¯Ã¥ÂËœÃ©â€ºâ€ Ã¥ÂË†Ã¤Â¸â‚¬Ã¨ÂµÂ·Ã¤Â½Â¿Ã§â€Â¨Ã¢â‚¬â€Ã¢â‚¬â€Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸ÂÃ¥ÂÂ¯Ã¥ÂËœÃ¥â€°Â¯Ã¦Å“Â¬Ã¯Â¼Å¡`_state.update { it.copy(list = it.list + newItem) }`
* Ã¦Ââ€¢Ã¨Å½Â· `CancellationException`Ã¢â‚¬â€Ã¢â‚¬â€Ã¥Âºâ€Ã¨Â®Â©Ã¥â€¦Â¶Ã¤Â¼Â Ã¦â€™Â­Ã¤Â»Â¥Ã¥Â®Å¾Ã§Å½Â°Ã¦Â­Â£Ã§Â¡Â®Ã§Å¡â€žÃ¥Ââ€“Ã¦Â¶Ë†
* Ã¤Â½Â¿Ã§â€Â¨ `flowOn(Dispatchers.Main)` Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦â€Â¶Ã©â€ºâ€ Ã¢â‚¬â€Ã¢â‚¬â€Ã¦â€Â¶Ã©â€ºâ€ Ã¨Â°Æ’Ã¥ÂºÂ¦Ã¥â„¢Â¨Ã¦ËœÂ¯Ã¨Â°Æ’Ã§â€Â¨Ã¦â€“Â¹Ã§Å¡â€žÃ¨Â°Æ’Ã¥ÂºÂ¦Ã¥â„¢Â¨
* Ã¥Å“Â¨ `@Composable` Ã¤Â¸Â­Ã¥Ë†â€ºÃ¥Â»Âº `Flow` Ã¨â‚¬Å’Ã¤Â¸ÂÃ¤Â½Â¿Ã§â€Â¨ `remember`Ã¢â‚¬â€Ã¢â‚¬â€Ã¦Â¯ÂÃ¦Â¬Â¡Ã©â€¡ÂÃ§Â»â€žÃ©Æ’Â½Ã¤Â¼Å¡Ã©â€¡ÂÃ¦â€“Â°Ã¥Ë†â€ºÃ¥Â»Âº Flow

## Ã¥Ââ€šÃ¨â‚¬Æ’

Ã¥â€¦Â³Ã¤ÂºÅ½ Flow Ã¥Å“Â¨ UI Ã¥Â±â€šÃ§Å¡â€žÃ¦Â¶Ë†Ã¨Â´Â¹Ã¯Â¼Å’Ã¨Â¯Â·Ã¥Ââ€šÃ©Ëœâ€¦Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`compose-multiplatform-patterns`Ã£â‚¬â€š
Ã¥â€¦Â³Ã¤ÂºÅ½Ã¥ÂÂÃ§Â¨â€¹Ã¥Å“Â¨Ã¥Ââ€žÃ¥Â±â€šÃ¤Â¸Â­Ã§Å¡â€žÃ©â‚¬â€šÃ§â€Â¨Ã¤Â½ÂÃ§Â½Â®Ã¯Â¼Å’Ã¨Â¯Â·Ã¥Ââ€šÃ©Ëœâ€¦Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`android-clean-architecture`Ã£â‚¬â€š
