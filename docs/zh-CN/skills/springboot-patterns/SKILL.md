---
name: springboot-patterns
description: Spring BootÃ¦Å¾Â¶Ã¦Å¾â€žÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂREST APIÃ¨Â®Â¾Ã¨Â®Â¡Ã£â‚¬ÂÃ¥Ë†â€ Ã¥Â±â€šÃ¦Å“ÂÃ¥Å Â¡Ã£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¨Â®Â¿Ã©â€”Â®Ã£â‚¬ÂÃ§Â¼â€œÃ¥Â­ËœÃ£â‚¬ÂÃ¥Â¼â€šÃ¦Â­Â¥Ã¥Â¤â€žÃ§Ââ€ Ã¥â€™Å’Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢Ã£â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½Java Spring BootÃ¥ÂÅ½Ã§Â«Â¯Ã¥Â·Â¥Ã¤Â½Å“Ã£â‚¬â€š
origin: claude-fulcrum
---

# Spring Boot Ã¥Â¼â‚¬Ã¥Ââ€˜Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½Ã¥ÂÂ¯Ã¦â€°Â©Ã¥Â±â€¢Ã£â‚¬ÂÃ§â€Å¸Ã¤ÂºÂ§Ã§ÂºÂ§Ã¦Å“ÂÃ¥Å Â¡Ã§Å¡â€ž Spring Boot Ã¦Å¾Â¶Ã¦Å¾â€žÃ¥â€™Å’ API Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¤Â½Â¿Ã§â€Â¨ Spring MVC Ã¦Ë†â€“ WebFlux Ã¦Å¾â€žÃ¥Â»Âº REST API
* Ã¦Å¾â€žÃ¥Â»ÂºÃ¦Å½Â§Ã¥Ë†Â¶Ã¥â„¢Â¨ Ã¢â€ â€™ Ã¦Å“ÂÃ¥Å Â¡ Ã¢â€ â€™ Ã¤Â»â€œÃ¥Âºâ€œÃ¥Â±â€šÃ§Â»â€œÃ¦Å¾â€ž
* Ã©â€¦ÂÃ§Â½Â® Spring Data JPAÃ£â‚¬ÂÃ§Â¼â€œÃ¥Â­ËœÃ¦Ë†â€“Ã¥Â¼â€šÃ¦Â­Â¥Ã¥Â¤â€žÃ§Ââ€ 
* Ã¦Â·Â»Ã¥Å Â Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂÃ¥Â¼â€šÃ¥Â¸Â¸Ã¥Â¤â€žÃ§Ââ€ Ã¦Ë†â€“Ã¥Ë†â€ Ã©Â¡Âµ
* Ã¤Â¸ÂºÃ¥Â¼â‚¬Ã¥Ââ€˜/Ã©Â¢â€žÃ¥Ââ€˜Ã¥Â¸Æ’/Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¨Â®Â¾Ã§Â½Â®Ã©â€¦ÂÃ§Â½Â®Ã¦â€“â€¡Ã¤Â»Â¶
* Ã¤Â½Â¿Ã§â€Â¨ Spring Events Ã¦Ë†â€“ Kafka Ã¥Â®Å¾Ã§Å½Â°Ã¤Âºâ€¹Ã¤Â»Â¶Ã©Â©Â±Ã¥Å Â¨Ã¦Â¨Â¡Ã¥Â¼Â

## REST API Ã§Â»â€œÃ¦Å¾â€ž

```java
@RestController
@RequestMapping("/api/markets")
@Validated
class MarketController {
  private final MarketService marketService;

  MarketController(MarketService marketService) {
    this.marketService = marketService;
  }

  @GetMapping
  ResponseEntity<Page<MarketResponse>> list(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    Page<Market> markets = marketService.list(PageRequest.of(page, size));
    return ResponseEntity.ok(markets.map(MarketResponse::from));
  }

  @PostMapping
  ResponseEntity<MarketResponse> create(@Valid @RequestBody CreateMarketRequest request) {
    Market market = marketService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(MarketResponse.from(market));
  }
}
```

## Ã¤Â»â€œÃ¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼Â (Spring Data JPA)

```java
public interface MarketRepository extends JpaRepository<MarketEntity, Long> {
  @Query("select m from MarketEntity m where m.status = :status order by m.volume desc")
  List<MarketEntity> findActive(@Param("status") MarketStatus status, Pageable pageable);
}
```

## Ã¥Â¸Â¦Ã¤Âºâ€¹Ã¥Å Â¡Ã§Å¡â€žÃ¦Å“ÂÃ¥Å Â¡Ã¥Â±â€š

```java
@Service
public class MarketService {
  private final MarketRepository repo;

  public MarketService(MarketRepository repo) {
    this.repo = repo;
  }

  @Transactional
  public Market create(CreateMarketRequest request) {
    MarketEntity entity = MarketEntity.from(request);
    MarketEntity saved = repo.save(entity);
    return Market.from(saved);
  }
}
```

## DTO Ã¥â€™Å’Ã©ÂªÅ’Ã¨Â¯Â

```java
public record CreateMarketRequest(
    @NotBlank @Size(max = 200) String name,
    @NotBlank @Size(max = 2000) String description,
    @NotNull @FutureOrPresent Instant endDate,
    @NotEmpty List<@NotBlank String> categories) {}

public record MarketResponse(Long id, String name, MarketStatus status) {
  static MarketResponse from(Market market) {
    return new MarketResponse(market.id(), market.name(), market.status());
  }
}
```

## Ã¥Â¼â€šÃ¥Â¸Â¸Ã¥Â¤â€žÃ§Ââ€ 

```java
@ControllerAdvice
class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(e -> e.getField() + ": " + e.getDefaultMessage())
        .collect(Collectors.joining(", "));
    return ResponseEntity.badRequest().body(ApiError.validation(message));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiError> handleAccessDenied() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiError.of("Forbidden"));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiError> handleGeneric(Exception ex) {
    // Log unexpected errors with stack traces
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiError.of("Internal server error"));
  }
}
```

## Ã§Â¼â€œÃ¥Â­Ëœ

Ã©Å“â‚¬Ã¨Â¦ÂÃ¥Å“Â¨Ã©â€¦ÂÃ§Â½Â®Ã§Â±Â»Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `@EnableCaching`Ã£â‚¬â€š

```java
@Service
public class MarketCacheService {
  private final MarketRepository repo;

  public MarketCacheService(MarketRepository repo) {
    this.repo = repo;
  }

  @Cacheable(value = "market", key = "#id")
  public Market getById(Long id) {
    return repo.findById(id)
        .map(Market::from)
        .orElseThrow(() -> new EntityNotFoundException("Market not found"));
  }

  @CacheEvict(value = "market", key = "#id")
  public void evict(Long id) {}
}
```

## Ã¥Â¼â€šÃ¦Â­Â¥Ã¥Â¤â€žÃ§Ââ€ 

Ã©Å“â‚¬Ã¨Â¦ÂÃ¥Å“Â¨Ã©â€¦ÂÃ§Â½Â®Ã§Â±Â»Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `@EnableAsync`Ã£â‚¬â€š

```java
@Service
public class NotificationService {
  @Async
  public CompletableFuture<Void> sendAsync(Notification notification) {
    // send email/SMS
    return CompletableFuture.completedFuture(null);
  }
}
```

## Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢ (SLF4J)

```java
@Service
public class ReportService {
  private static final Logger log = LoggerFactory.getLogger(ReportService.class);

  public Report generate(Long marketId) {
    log.info("generate_report marketId={}", marketId);
    try {
      // logic
    } catch (Exception ex) {
      log.error("generate_report_failed marketId={}", marketId, ex);
      throw ex;
    }
    return new Report();
  }
}
```

## Ã¤Â¸Â­Ã©â€”Â´Ã¤Â»Â¶ / Ã¨Â¿â€¡Ã¦Â»Â¤Ã¥â„¢Â¨

```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    long start = System.currentTimeMillis();
    try {
      filterChain.doFilter(request, response);
    } finally {
      long duration = System.currentTimeMillis() - start;
      log.info("req method={} uri={} status={} durationMs={}",
          request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
    }
  }
}
```

## Ã¥Ë†â€ Ã©Â¡ÂµÃ¥â€™Å’Ã¦Å½â€™Ã¥ÂºÂ

```java
PageRequest page = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
Page<Market> results = marketService.list(page);
```

## Ã¥Â®Â¹Ã©â€â„¢Ã§Å¡â€žÃ¥Â¤â€“Ã©Æ’Â¨Ã¨Â°Æ’Ã§â€Â¨

```java
public <T> T withRetry(Supplier<T> supplier, int maxRetries) {
  int attempts = 0;
  while (true) {
    try {
      return supplier.get();
    } catch (Exception ex) {
      attempts++;
      if (attempts >= maxRetries) {
        throw ex;
      }
      try {
        Thread.sleep((long) Math.pow(2, attempts) * 100L);
      } catch (InterruptedException ie) {
        Thread.currentThread().interrupt();
        throw ex;
      }
    }
  }
}
```

## Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶ (Ã¨Â¿â€¡Ã¦Â»Â¤Ã¥â„¢Â¨ + Bucket4j)

**Ã¥Â®â€°Ã¥â€¦Â¨Ã©Â¡Â»Ã§Å¸Â¥**Ã¯Â¼Å¡Ã©Â»ËœÃ¨Â®Â¤Ã¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹ `X-Forwarded-For` Ã¥Â¤Â´Ã¦ËœÂ¯Ã¤Â¸ÂÃ¥ÂÂ¯Ã¤Â¿Â¡Ã§Å¡â€žÃ¯Â¼Å’Ã¥â€ºÂ Ã¤Â¸ÂºÃ¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯Ã¥ÂÂ¯Ã¤Â»Â¥Ã¤Â¼ÂªÃ©â‚¬Â Ã¥Â®Æ’Ã£â‚¬â€š
Ã¤Â»â€¦Ã¥Å“Â¨Ã¤Â»Â¥Ã¤Â¸â€¹Ã¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã¤Â½Â¿Ã§â€Â¨Ã¨Â½Â¬Ã¥Ââ€˜Ã¥Â¤Â´Ã¯Â¼Å¡

1. Ã¦â€šÂ¨Ã§Å¡â€žÃ¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¤Â½ÂÃ¤ÂºÅ½Ã¥ÂÂ¯Ã¤Â¿Â¡Ã§Å¡â€žÃ¥ÂÂÃ¥Ââ€˜Ã¤Â»Â£Ã§Ââ€ Ã¯Â¼Ë†nginxÃ£â‚¬ÂAWS ALB Ã§Â­â€°Ã¯Â¼â€°Ã¤Â¹â€¹Ã¥ÂÅ½
2. Ã¦â€šÂ¨Ã¥Â·Â²Ã¥Â°â€  `ForwardedHeaderFilter` Ã¦Â³Â¨Ã¥â€ Å’Ã¤Â¸Âº bean
3. Ã¦â€šÂ¨Ã¥Â·Â²Ã¥Å“Â¨Ã¥Âºâ€Ã§â€Â¨Ã¥Â±Å¾Ã¦â‚¬Â§Ã¤Â¸Â­Ã©â€¦ÂÃ§Â½Â®Ã¤Âºâ€  `server.forward-headers-strategy=NATIVE` Ã¦Ë†â€“ `FRAMEWORK`
4. Ã¦â€šÂ¨Ã§Å¡â€žÃ¤Â»Â£Ã§Ââ€ Ã©â€¦ÂÃ§Â½Â®Ã¤Â¸ÂºÃ¨Â¦â€ Ã§â€ºâ€“Ã¯Â¼Ë†Ã¨â‚¬Å’Ã©ÂÅ¾Ã¨Â¿Â½Ã¥Å Â Ã¯Â¼â€°`X-Forwarded-For` Ã¥Â¤Â´

Ã¥Â½â€œ `ForwardedHeaderFilter` Ã¨Â¢Â«Ã¦Â­Â£Ã§Â¡Â®Ã©â€¦ÂÃ§Â½Â®Ã¦â€”Â¶Ã¯Â¼Å’`request.getRemoteAddr()` Ã¥Â°â€ Ã¨â€¡ÂªÃ¥Å Â¨Ã¤Â»Å½Ã¨Â½Â¬Ã¥Ââ€˜Ã§Å¡â€žÃ¥Â¤Â´Ã¤Â¸Â­Ã¨Â¿â€Ã¥â€ºÅ¾Ã¦Â­Â£Ã§Â¡Â®Ã§Å¡â€žÃ¥Â®Â¢Ã¦Ë†Â·Ã§Â«Â¯ IPÃ£â‚¬â€š
Ã¦Â²Â¡Ã¦Å“â€°Ã¦Â­Â¤Ã©â€¦ÂÃ§Â½Â®Ã¦â€”Â¶Ã¯Â¼Å’Ã¨Â¯Â·Ã§â€ºÂ´Ã¦Å½Â¥Ã¤Â½Â¿Ã§â€Â¨ `request.getRemoteAddr()`Ã¢â‚¬â€Ã¢â‚¬â€Ã¥Â®Æ’Ã¨Â¿â€Ã¥â€ºÅ¾Ã§Å¡â€žÃ¦ËœÂ¯Ã§â€ºÂ´Ã¦Å½Â¥Ã¨Â¿Å¾Ã¦Å½Â¥Ã§Å¡â€ž IPÃ¯Â¼Å’Ã¨Â¿â„¢Ã¦ËœÂ¯Ã¥â€Â¯Ã¤Â¸â‚¬Ã¥ÂÂ¯Ã¤Â¿Â¡Ã§Å¡â€žÃ¥â‚¬Â¼Ã£â‚¬â€š

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  /*
   * SECURITY: This filter uses request.getRemoteAddr() to identify clients for rate limiting.
   *
   * If your application is behind a reverse proxy (nginx, AWS ALB, etc.), you MUST configure
   * Spring to handle forwarded headers properly for accurate client IP detection:
   *
   * 1. Set server.forward-headers-strategy=NATIVE (for cloud platforms) or FRAMEWORK in
   *    application.properties/yaml
   * 2. If using FRAMEWORK strategy, register ForwardedHeaderFilter:
   *
   *    @Bean
   *    ForwardedHeaderFilter forwardedHeaderFilter() {
   *        return new ForwardedHeaderFilter();
   *    }
   *
   * 3. Ensure your proxy overwrites (not appends) the X-Forwarded-For header to prevent spoofing
   * 4. Configure server.tomcat.remoteip.trusted-proxies or equivalent for your container
   *
   * Without this configuration, request.getRemoteAddr() returns the proxy IP, not the client IP.
   * Do NOT read X-Forwarded-For directlyÃ¢â‚¬â€it is trivially spoofable without trusted proxy handling.
   */
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    // Use getRemoteAddr() which returns the correct client IP when ForwardedHeaderFilter
    // is configured, or the direct connection IP otherwise. Never trust X-Forwarded-For
    // headers directly without proper proxy configuration.
    String clientIp = request.getRemoteAddr();

    Bucket bucket = buckets.computeIfAbsent(clientIp,
        k -> Bucket.builder()
            .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
            .build());

    if (bucket.tryConsume(1)) {
      filterChain.doFilter(request, response);
    } else {
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
  }
}
```

## Ã¥ÂÅ½Ã¥ÂÂ°Ã¤Â½Å“Ã¤Â¸Å¡

Ã¤Â½Â¿Ã§â€Â¨ Spring Ã§Å¡â€ž `@Scheduled` Ã¦Ë†â€“Ã¤Â¸Å½Ã©ËœÅ¸Ã¥Ë†â€”Ã¯Â¼Ë†Ã¥Â¦â€š KafkaÃ£â‚¬ÂSQSÃ£â‚¬ÂRabbitMQÃ¯Â¼â€°Ã©â€ºâ€ Ã¦Ë†ÂÃ£â‚¬â€šÃ¤Â¿ÂÃ¦Å’ÂÃ¥Â¤â€žÃ§Ââ€ Ã§Â¨â€¹Ã¥ÂºÂÃ¦ËœÂ¯Ã¥Â¹â€šÃ§Â­â€°Ã§Å¡â€žÃ¥â€™Å’Ã¥ÂÂ¯Ã¨Â§â€šÃ¥Â¯Å¸Ã§Å¡â€žÃ£â‚¬â€š

## Ã¥ÂÂ¯Ã¨Â§â€šÃ¦Âµâ€¹Ã¦â‚¬Â§

* Ã©â‚¬Å¡Ã¨Â¿â€¡ Logback Ã§Â¼â€“Ã§Â ÂÃ¥â„¢Â¨Ã¨Â¿â€ºÃ¨Â¡Å’Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢ (JSON)
* Ã¦Å’â€¡Ã¦Â â€¡Ã¯Â¼Å¡Micrometer + Prometheus/OTel
* Ã¨Â¿Â½Ã¨Â¸ÂªÃ¯Â¼Å¡Ã¥Â¸Â¦Ã¦Å“â€° OpenTelemetry Ã¦Ë†â€“ Brave Ã¥ÂÅ½Ã§Â«Â¯Ã§Å¡â€ž Micrometer Tracing

## Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã©Â»ËœÃ¨Â®Â¤Ã¨Â®Â¾Ã§Â½Â®

* Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¦Å¾â€žÃ©â‚¬Â Ã¥â€¡Â½Ã¦â€¢Â°Ã¦Â³Â¨Ã¥â€¦Â¥Ã¯Â¼Å’Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Â­â€”Ã¦Â®ÂµÃ¦Â³Â¨Ã¥â€¦Â¥
* Ã¥ÂÂ¯Ã§â€Â¨ `spring.mvc.problemdetails.enabled=true` Ã¤Â»Â¥Ã¨Å½Â·Ã¥Â¾â€” RFC 7807 Ã©â€â„¢Ã¨Â¯Â¯ (Spring Boot 3+)
* Ã¦Â Â¹Ã¦ÂÂ®Ã¥Â·Â¥Ã¤Â½Å“Ã¨Â´Å¸Ã¨Â½Â½Ã©â€¦ÂÃ§Â½Â® HikariCP Ã¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â Ã¥Â¤Â§Ã¥Â°ÂÃ¯Â¼Å’Ã¨Â®Â¾Ã§Â½Â®Ã¨Â¶â€¦Ã¦â€”Â¶
* Ã¥Â¯Â¹Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â½Â¿Ã§â€Â¨ `@Transactional(readOnly = true)`
* Ã¥Å“Â¨Ã©â‚¬â€šÃ¥Â½â€œÃ§Å¡â€žÃ¥Å“Â°Ã¦â€“Â¹Ã©â‚¬Å¡Ã¨Â¿â€¡ `@NonNull` Ã¥â€™Å’ `Optional` Ã¥Â¼ÂºÃ¥Ë†Â¶Ã¦â€°Â§Ã¨Â¡Å’Ã§Â©ÂºÃ¥â‚¬Â¼Ã¥Â®â€°Ã¥â€¦Â¨

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¤Â¿ÂÃ¦Å’ÂÃ¦Å½Â§Ã¥Ë†Â¶Ã¥â„¢Â¨Ã§Â²Â¾Ã§Â®â‚¬Ã£â‚¬ÂÃ¦Å“ÂÃ¥Å Â¡Ã¤Â¸â€œÃ¦Â³Â¨Ã£â‚¬ÂÃ¤Â»â€œÃ¥Âºâ€œÃ§Â®â‚¬Ã¥Ââ€¢Ã¯Â¼Å’Ã¥Â¹Â¶Ã©â€ºâ€ Ã¤Â¸Â­Ã¥Â¤â€žÃ§Ââ€ Ã©â€â„¢Ã¨Â¯Â¯Ã£â‚¬â€šÃ¤Â¸ÂºÃ¥ÂÂ¯Ã§Â»Â´Ã¦Å Â¤Ã¦â‚¬Â§Ã¥â€™Å’Ã¥ÂÂ¯Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â‚¬Â§Ã¨Â¿â€ºÃ¨Â¡Å’Ã¤Â¼ËœÃ¥Å’â€“Ã£â‚¬â€š
