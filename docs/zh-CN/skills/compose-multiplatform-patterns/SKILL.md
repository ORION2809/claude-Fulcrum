---
name: compose-multiplatform-patterns
description: KMPÃ©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Â­Ã§Å¡â€žCompose MultiplatformÃ¥â€™Å’Jetpack ComposeÃ¦Â¨Â¡Ã¥Â¼ÂÃ¢â‚¬â€Ã¢â‚¬â€Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€ Ã£â‚¬ÂÃ¥Â¯Â¼Ã¨Ë†ÂªÃ£â‚¬ÂÃ¤Â¸Â»Ã©Â¢ËœÃ¥Å’â€“Ã£â‚¬ÂÃ¦â‚¬Â§Ã¨Æ’Â½Ã¤Â¼ËœÃ¥Å’â€“Ã¥â€™Å’Ã¥Â¹Â³Ã¥ÂÂ°Ã§â€°Â¹Ã¥Â®Å¡UIÃ£â‚¬â€š
origin: claude-fulcrum
---

# Compose Ã¥Â¤Å¡Ã¥Â¹Â³Ã¥ÂÂ°Ã¦Â¨Â¡Ã¥Â¼Â

Ã¤Â½Â¿Ã§â€Â¨ Compose Multiplatform Ã¥â€™Å’ Jetpack Compose Ã¦Å¾â€žÃ¥Â»ÂºÃ¨Â·Â¨ AndroidÃ£â‚¬ÂiOSÃ£â‚¬ÂÃ¦Â¡Å’Ã©ÂÂ¢Ã¥â€™Å’ Web Ã§Å¡â€žÃ¥â€¦Â±Ã¤ÂºÂ« UI Ã§Å¡â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€šÃ¦Â¶ÂµÃ§â€ºâ€“Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€ Ã£â‚¬ÂÃ¥Â¯Â¼Ã¨Ë†ÂªÃ£â‚¬ÂÃ¤Â¸Â»Ã©Â¢ËœÃ¥â€™Å’Ã¦â‚¬Â§Ã¨Æ’Â½Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¦Å¾â€žÃ¥Â»Âº Compose UIÃ¯Â¼Ë†Jetpack Compose Ã¦Ë†â€“ Compose MultiplatformÃ¯Â¼â€°
* Ã¤Â½Â¿Ã§â€Â¨ ViewModel Ã¥â€™Å’ Compose Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€  UI Ã§Å Â¶Ã¦â‚¬Â
* Ã¥Å“Â¨ KMP Ã¦Ë†â€“ Android Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Â­Ã¥Â®Å¾Ã§Å½Â°Ã¥Â¯Â¼Ã¨Ë†Âª
* Ã¨Â®Â¾Ã¨Â®Â¡Ã¥ÂÂ¯Ã¥Â¤ÂÃ§â€Â¨Ã§Å¡â€žÃ¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã¥â€™Å’Ã¨Â®Â¾Ã¨Â®Â¡Ã§Â³Â»Ã§Â»Å¸
* Ã¤Â¼ËœÃ¥Å’â€“Ã©â€¡ÂÃ§Â»â€žÃ¥â€™Å’Ã¦Â¸Â²Ã¦Å¸â€œÃ¦â‚¬Â§Ã¨Æ’Â½

## Ã§Å Â¶Ã¦â‚¬ÂÃ§Â®Â¡Ã§Ââ€ 

### ViewModel + Ã¥Ââ€¢Ã¤Â¸â‚¬Ã§Å Â¶Ã¦â‚¬ÂÃ¥Â¯Â¹Ã¨Â±Â¡

Ã¤Â½Â¿Ã§â€Â¨Ã¥Ââ€¢Ã¤Â¸ÂªÃ¦â€¢Â°Ã¦ÂÂ®Ã§Â±Â»Ã¨Â¡Â¨Ã§Â¤ÂºÃ¥Â±ÂÃ¥Â¹â€¢Ã§Å Â¶Ã¦â‚¬ÂÃ£â‚¬â€šÃ¥Â°â€ Ã¥â€¦Â¶Ã¦Å¡Â´Ã©Å“Â²Ã¤Â¸Âº `StateFlow` Ã¥Â¹Â¶Ã¥Å“Â¨ Compose Ã¤Â¸Â­Ã¦â€Â¶Ã©â€ºâ€ Ã¯Â¼Å¡

```kotlin
data class ItemListState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = ""
)

class ItemListViewModel(
    private val getItems: GetItemsUseCase
) : ViewModel() {
    private val _state = MutableStateFlow(ItemListState())
    val state: StateFlow<ItemListState> = _state.asStateFlow()

    fun onSearch(query: String) {
        _state.update { it.copy(searchQuery = query) }
        loadItems(query)
    }

    private fun loadItems(query: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            getItems(query).fold(
                onSuccess = { items -> _state.update { it.copy(items = items, isLoading = false) } },
                onFailure = { e -> _state.update { it.copy(error = e.message, isLoading = false) } }
            )
        }
    }
}
```

### Ã¥Å“Â¨ Compose Ã¤Â¸Â­Ã¦â€Â¶Ã©â€ºâ€ Ã§Å Â¶Ã¦â‚¬Â

```kotlin
@Composable
fun ItemListScreen(viewModel: ItemListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    ItemListContent(
        state = state,
        onSearch = viewModel::onSearch
    )
}

@Composable
private fun ItemListContent(
    state: ItemListState,
    onSearch: (String) -> Unit
) {
    // Stateless composable Ã¢â‚¬â€ easy to preview and test
}
```

### Ã¤Âºâ€¹Ã¤Â»Â¶Ã¦Å½Â¥Ã¦â€Â¶Ã¥â„¢Â¨Ã¦Â¨Â¡Ã¥Â¼Â

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¥Â¤ÂÃ¦Ââ€šÃ¥Â±ÂÃ¥Â¹â€¢Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¯â€ Ã¥Â°ÂÃ¦Å½Â¥Ã¥ÂÂ£Ã¨Â¡Â¨Ã§Â¤ÂºÃ¤Âºâ€¹Ã¤Â»Â¶Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥Â¤Å¡Ã¤Â¸ÂªÃ¥â€ºÅ¾Ã¨Â°Æ’ lambdaÃ¯Â¼Å¡

```kotlin
sealed interface ItemListEvent {
    data class Search(val query: String) : ItemListEvent
    data class Delete(val itemId: String) : ItemListEvent
    data object Refresh : ItemListEvent
}

// In ViewModel
fun onEvent(event: ItemListEvent) {
    when (event) {
        is ItemListEvent.Search -> onSearch(event.query)
        is ItemListEvent.Delete -> deleteItem(event.itemId)
        is ItemListEvent.Refresh -> loadItems(_state.value.searchQuery)
    }
}

// In Composable Ã¢â‚¬â€ single lambda instead of many
ItemListContent(
    state = state,
    onEvent = viewModel::onEvent
)
```

## Ã¥Â¯Â¼Ã¨Ë†Âª

### Ã§Â±Â»Ã¥Å¾â€¹Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¯Â¼Ã¨Ë†ÂªÃ¯Â¼Ë†Compose Navigation 2.8+Ã¯Â¼â€°

Ã¥Â°â€ Ã¨Â·Â¯Ã§â€Â±Ã¥Â®Å¡Ã¤Â¹â€°Ã¤Â¸Âº `@Serializable` Ã¥Â¯Â¹Ã¨Â±Â¡Ã¯Â¼Å¡

```kotlin
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)
@Serializable data object SettingsRoute

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController, startDestination = HomeRoute) {
        composable<HomeRoute> {
            HomeScreen(onNavigateToDetail = { id -> navController.navigate(DetailRoute(id)) })
        }
        composable<DetailRoute> { backStackEntry ->
            val route = backStackEntry.toRoute<DetailRoute>()
            DetailScreen(id = route.id)
        }
        composable<SettingsRoute> { SettingsScreen() }
    }
}
```

### Ã¥Â¯Â¹Ã¨Â¯ÂÃ¦Â¡â€ Ã¥â€™Å’Ã¥Âºâ€¢Ã©Æ’Â¨Ã¦Å Â½Ã¥Â±â€°Ã¥Â¯Â¼Ã¨Ë†Âª

Ã¤Â½Â¿Ã§â€Â¨ `dialog()` Ã¥â€™Å’Ã¨Â¦â€ Ã§â€ºâ€“Ã¥Â±â€šÃ¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥â€˜Â½Ã¤Â»Â¤Ã¥Â¼ÂÃ§Å¡â€žÃ¦ËœÂ¾Ã§Â¤Âº/Ã©Å¡ÂÃ¨â€”ÂÃ¯Â¼Å¡

```kotlin
NavHost(navController, startDestination = HomeRoute) {
    composable<HomeRoute> { /* ... */ }
    dialog<ConfirmDeleteRoute> { backStackEntry ->
        val route = backStackEntry.toRoute<ConfirmDeleteRoute>()
        ConfirmDeleteDialog(
            itemId = route.itemId,
            onConfirm = { navController.popBackStack() },
            onDismiss = { navController.popBackStack() }
        )
    }
}
```

## Ã¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã¨Â®Â¾Ã¨Â®Â¡

### Ã¥Å¸ÂºÃ¤ÂºÅ½Ã¦Â§Â½Ã¤Â½ÂÃ§Å¡â€ž API

Ã¤Â½Â¿Ã§â€Â¨Ã¦Â§Â½Ã¤Â½ÂÃ¥Ââ€šÃ¦â€¢Â°Ã¨Â®Â¾Ã¨Â®Â¡Ã¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã¤Â»Â¥Ã¨Å½Â·Ã¥Â¾â€”Ã§ÂÂµÃ¦Â´Â»Ã¦â‚¬Â§Ã¯Â¼Å¡

```kotlin
@Composable
fun AppCard(
    modifier: Modifier = Modifier,
    header: @Composable () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
    actions: @Composable RowScope.() -> Unit = {}
) {
    Card(modifier = modifier) {
        Column {
            header()
            Column(content = content)
            Row(horizontalArrangement = Arrangement.End, content = actions)
        }
    }
}
```

### Ã¤Â¿Â®Ã©Â¥Â°Ã§Â¬Â¦Ã©Â¡ÂºÃ¥ÂºÂ

Ã¤Â¿Â®Ã©Â¥Â°Ã§Â¬Â¦Ã©Â¡ÂºÃ¥ÂºÂÃ¥Â¾Ë†Ã©â€¡ÂÃ¨Â¦Â Ã¢â‚¬â€Ã¢â‚¬â€ Ã¦Å’â€°Ã¦Â­Â¤Ã©Â¡ÂºÃ¥ÂºÂÃ¥Âºâ€Ã§â€Â¨Ã¯Â¼Å¡

```kotlin
Text(
    text = "Hello",
    modifier = Modifier
        .padding(16.dp)          // 1. Layout (padding, size)
        .clip(RoundedCornerShape(8.dp))  // 2. Shape
        .background(Color.White) // 3. Drawing (background, border)
        .clickable { }           // 4. Interaction
)
```

## KMP Ã¥Â¹Â³Ã¥ÂÂ°Ã§â€°Â¹Ã¥Â®Å¡ UI

### Ã¥Â¹Â³Ã¥ÂÂ°Ã¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã§Å¡â€ž expect/actual

```kotlin
// commonMain
@Composable
expect fun PlatformStatusBar(darkIcons: Boolean)

// androidMain
@Composable
actual fun PlatformStatusBar(darkIcons: Boolean) {
    val systemUiController = rememberSystemUiController()
    SideEffect { systemUiController.setStatusBarColor(Color.Transparent, darkIcons) }
}

// iosMain
@Composable
actual fun PlatformStatusBar(darkIcons: Boolean) {
    // iOS handles this via UIKit interop or Info.plist
}
```

## Ã¦â‚¬Â§Ã¨Æ’Â½

### Ã§â€Â¨Ã¤ÂºÅ½Ã¥ÂÂ¯Ã¨Â·Â³Ã¨Â¿â€¡Ã©â€¡ÂÃ§Â»â€žÃ§Å¡â€žÃ§Â¨Â³Ã¥Â®Å¡Ã§Â±Â»Ã¥Å¾â€¹

Ã¥Â½â€œÃ¦â€°â‚¬Ã¦Å“â€°Ã¥Â±Å¾Ã¦â‚¬Â§Ã©Æ’Â½Ã§Â¨Â³Ã¥Â®Å¡Ã¦â€”Â¶Ã¯Â¼Å’Ã¥Â°â€ Ã§Â±Â»Ã¦Â â€¡Ã¨Â®Â°Ã¤Â¸Âº `@Stable` Ã¦Ë†â€“ `@Immutable`Ã¯Â¼Å¡

```kotlin
@Immutable
data class ItemUiModel(
    val id: String,
    val title: String,
    val description: String,
    val progress: Float
)
```

### Ã¦Â­Â£Ã§Â¡Â®Ã¤Â½Â¿Ã§â€Â¨ `key()` Ã¥â€™Å’Ã¦Æ’Â°Ã¦â‚¬Â§Ã¥Ë†â€”Ã¨Â¡Â¨

```kotlin
LazyColumn {
    items(
        items = items,
        key = { it.id }  // Stable keys enable item reuse and animations
    ) { item ->
        ItemRow(item = item)
    }
}
```

### Ã¤Â½Â¿Ã§â€Â¨ `derivedStateOf` Ã¥Â»Â¶Ã¨Â¿Å¸Ã¨Â¯Â»Ã¥Ââ€“

```kotlin
val listState = rememberLazyListState()
val showScrollToTop by remember {
    derivedStateOf { listState.firstVisibleItemIndex > 5 }
}
```

### Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã©â€¡ÂÃ§Â»â€žÃ¤Â¸Â­Ã¥Ë†â€ Ã©â€¦ÂÃ¥â€ â€¦Ã¥Â­Ëœ

```kotlin
// BAD Ã¢â‚¬â€ new lambda and list every recomposition
items.filter { it.isActive }.forEach { ActiveItem(it, onClick = { handle(it) }) }

// GOOD Ã¢â‚¬â€ key each item so callbacks stay attached to the right row
val activeItems = remember(items) { items.filter { it.isActive } }
activeItems.forEach { item ->
    key(item.id) {
        ActiveItem(item, onClick = { handle(item) })
    }
}
```

## Ã¤Â¸Â»Ã©Â¢Ëœ

### Material 3 Ã¥Å Â¨Ã¦â‚¬ÂÃ¤Â¸Â»Ã©Â¢Ëœ

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            if (darkTheme) dynamicDarkColorScheme(LocalContext.current)
            else dynamicLightColorScheme(LocalContext.current)
        }
        darkTheme -> darkColorScheme()
        else -> lightColorScheme()
    }

    MaterialTheme(colorScheme = colorScheme, content = content)
}
```

## Ã¥Âºâ€Ã©ÂÂ¿Ã¥â€¦ÂÃ§Å¡â€žÃ¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

* Ã¥Å“Â¨ ViewModel Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ `mutableStateOf`Ã¯Â¼Å’Ã¨â‚¬Å’ `MutableStateFlow` Ã©â€¦ÂÃ¥ÂË† `collectAsStateWithLifecycle` Ã¥Â¯Â¹Ã§â€Å¸Ã¥â€˜Â½Ã¥â€˜Â¨Ã¦Å“Å¸Ã¦â€ºÂ´Ã¥Â®â€°Ã¥â€¦Â¨
* Ã¥Â°â€  `NavController` Ã¦Â·Â±Ã¥â€¦Â¥Ã¤Â¼Â Ã©â‚¬â€™Ã¥Ë†Â°Ã¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã¤Â¸Â­ Ã¢â‚¬â€Ã¢â‚¬â€ Ã¥Âºâ€Ã¤Â¼Â Ã©â‚¬â€™ lambda Ã¥â€ºÅ¾Ã¨Â°Æ’
* Ã¥Å“Â¨ `@Composable` Ã¥â€¡Â½Ã¦â€¢Â°Ã¤Â¸Â­Ã¨Â¿â€ºÃ¨Â¡Å’Ã§Â¹ÂÃ©â€¡ÂÃ¨Â®Â¡Ã§Â®â€” Ã¢â‚¬â€Ã¢â‚¬â€ Ã¥Âºâ€Ã§Â§Â»Ã¨â€¡Â³ ViewModel Ã¦Ë†â€“ `remember {}`
* Ã¤Â½Â¿Ã§â€Â¨ `LaunchedEffect(Unit)` Ã¤Â½Å“Ã¤Â¸Âº ViewModel Ã¥Ë†ÂÃ¥Â§â€¹Ã¥Å’â€“Ã§Å¡â€žÃ¦â€ºÂ¿Ã¤Â»Â£ Ã¢â‚¬â€Ã¢â‚¬â€ Ã¥Å“Â¨Ã¦Å¸ÂÃ¤Âºâ€ºÃ¨Â®Â¾Ã§Â½Â®Ã¤Â¸Â­Ã¯Â¼Å’Ã¥Â®Æ’Ã¤Â¼Å¡Ã¥Å“Â¨Ã©â€¦ÂÃ§Â½Â®Ã¦â€ºÂ´Ã¦â€Â¹Ã¦â€”Â¶Ã©â€¡ÂÃ¦â€“Â°Ã¨Â¿ÂÃ¨Â¡Å’
* Ã¥Å“Â¨Ã¥ÂÂ¯Ã§Â»â€žÃ¥ÂË†Ã©Â¡Â¹Ã¥Ââ€šÃ¦â€¢Â°Ã¤Â¸Â­Ã¥Ë†â€ºÃ¥Â»ÂºÃ¦â€“Â°Ã§Å¡â€žÃ¥Â¯Â¹Ã¨Â±Â¡Ã¥Â®Å¾Ã¤Â¾â€¹ Ã¢â‚¬â€Ã¢â‚¬â€ Ã¤Â¼Å¡Ã¥Â¯Â¼Ã¨â€¡Â´Ã¤Â¸ÂÃ¥Â¿â€¦Ã¨Â¦ÂÃ§Å¡â€žÃ©â€¡ÂÃ§Â»â€ž

## Ã¥Ââ€šÃ¨â‚¬Æ’Ã¨Âµâ€žÃ¦â€“â„¢

Ã¦Å¸Â¥Ã§Å“â€¹Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`android-clean-architecture` Ã¤Âºâ€ Ã¨Â§Â£Ã¦Â¨Â¡Ã¥Ââ€”Ã§Â»â€œÃ¦Å¾â€žÃ¥â€™Å’Ã¥Ë†â€ Ã¥Â±â€šÃ£â‚¬â€š
Ã¦Å¸Â¥Ã§Å“â€¹Ã¦Å â‚¬Ã¨Æ’Â½Ã¯Â¼Å¡`kotlin-coroutines-flows` Ã¤Âºâ€ Ã¨Â§Â£Ã¥ÂÂÃ§Â¨â€¹Ã¥â€™Å’ Flow Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
