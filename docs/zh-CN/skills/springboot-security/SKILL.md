---
name: springboot-security
description: Java Spring Boot Ã¦Å“ÂÃ¥Å Â¡Ã¤Â¸Â­Ã¨Â®Â¤Ã¨Â¯Â/Ã¦Å½Ë†Ã¦ÂÆ’Ã£â‚¬ÂÃ©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂCSRFÃ£â‚¬ÂÃ¥Â¯â€ Ã©â€™Â¥Ã£â‚¬ÂÃ¦Â â€¡Ã¥Â¤Â´Ã£â‚¬ÂÃ©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã¥â€™Å’Ã¤Â¾ÂÃ¨Âµâ€“Ã¥Â®â€°Ã¥â€¦Â¨Ã¦â‚¬Â§Ã§Å¡â€ž Spring Security Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·ÂµÃ£â‚¬â€š
origin: claude-fulcrum
---

# Spring Boot Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â®Â¡Ã¦Å¸Â¥

Ã¥Å“Â¨Ã¦Â·Â»Ã¥Å Â Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂÃ¥Â¤â€žÃ§Ââ€ Ã¨Â¾â€œÃ¥â€¦Â¥Ã£â‚¬ÂÃ¥Ë†â€ºÃ¥Â»ÂºÃ§Â«Â¯Ã§â€šÂ¹Ã¦Ë†â€“Ã¥Â¤â€žÃ§Ââ€ Ã¥Â¯â€ Ã©â€™Â¥Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¦Â·Â»Ã¥Å Â Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ¯Â¼Ë†JWTÃ£â‚¬ÂOAuth2Ã£â‚¬ÂÃ¥Å¸ÂºÃ¤ÂºÅ½Ã¤Â¼Å¡Ã¨Â¯ÂÃ¯Â¼â€°
* Ã¥Â®Å¾Ã§Å½Â°Ã¦Å½Ë†Ã¦ÂÆ’Ã¯Â¼Ë†@PreAuthorizeÃ£â‚¬ÂÃ¥Å¸ÂºÃ¤ÂºÅ½Ã¨Â§â€™Ã¨â€°Â²Ã§Å¡â€žÃ¨Â®Â¿Ã©â€”Â®Ã¦Å½Â§Ã¥Ë†Â¶Ã¯Â¼â€°
* Ã©ÂªÅ’Ã¨Â¯ÂÃ§â€Â¨Ã¦Ë†Â·Ã¨Â¾â€œÃ¥â€¦Â¥Ã¯Â¼Ë†Bean ValidationÃ£â‚¬ÂÃ¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã©ÂªÅ’Ã¨Â¯ÂÃ¥â„¢Â¨Ã¯Â¼â€°
* Ã©â€¦ÂÃ§Â½Â® CORSÃ£â‚¬ÂCSRF Ã¦Ë†â€“Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â â€¡Ã¥Â¤Â´
* Ã§Â®Â¡Ã§Ââ€ Ã¥Â¯â€ Ã©â€™Â¥Ã¯Â¼Ë†VaultÃ£â‚¬ÂÃ§Å½Â¯Ã¥Â¢Æ’Ã¥ÂËœÃ©â€¡ÂÃ¯Â¼â€°
* Ã¦Â·Â»Ã¥Å Â Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶Ã¦Ë†â€“Ã¦Å¡Â´Ã¥Å â€ºÃ§Â Â´Ã¨Â§Â£Ã©ËœÂ²Ã¦Å Â¤
* Ã¦â€°Â«Ã¦ÂÂÃ¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã¤Â»Â¥Ã¦Å¸Â¥Ã¦â€°Â¾ CVE

## Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯Â

* Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¦â€”Â Ã§Å Â¶Ã¦â‚¬Â JWT Ã¦Ë†â€“Ã¥Â¸Â¦Ã¦Å“â€°Ã¦â€™Â¤Ã©â€â‚¬Ã¥Ë†â€”Ã¨Â¡Â¨Ã§Å¡â€žÃ¤Â¸ÂÃ©â‚¬ÂÃ¦ËœÅ½Ã¤Â»Â¤Ã§â€°Å’
* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¤Â¼Å¡Ã¨Â¯ÂÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `httpOnly`Ã£â‚¬Â`Secure`Ã£â‚¬Â`SameSite=Strict` cookie
* Ã¤Â½Â¿Ã§â€Â¨ `OncePerRequestFilter` Ã¦Ë†â€“Ã¨Âµâ€žÃ¦ÂºÂÃ¦Å“ÂÃ¥Å Â¡Ã¥â„¢Â¨Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Â»Â¤Ã§â€°Å’

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;

  public JwtAuthFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      Authentication auth = jwtService.authenticate(token);
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(request, response);
  }
}
```

## Ã¦Å½Ë†Ã¦ÂÆ’

* Ã¥ÂÂ¯Ã§â€Â¨Ã¦â€“Â¹Ã¦Â³â€¢Ã¥Â®â€°Ã¥â€¦Â¨Ã¯Â¼Å¡`@EnableMethodSecurity`
* Ã¤Â½Â¿Ã§â€Â¨ `@PreAuthorize("hasRole('ADMIN')")` Ã¦Ë†â€“ `@PreAuthorize("@authz.canEdit(#id)")`
* Ã©Â»ËœÃ¨Â®Â¤Ã¦â€¹â€™Ã§Â»ÂÃ¯Â¼â€ºÃ¤Â»â€¦Ã¥â€¦Â¬Ã¥Â¼â‚¬Ã¥Â¿â€¦Ã©Å“â‚¬Ã§Å¡â€ž scope

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/users")
  public List<UserDto> listUsers() {
    return userService.findAll();
  }

  @PreAuthorize("@authz.isOwner(#id, authentication)")
  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
```

## Ã¨Â¾â€œÃ¥â€¦Â¥Ã©ÂªÅ’Ã¨Â¯Â

* Ã¥Å“Â¨Ã¦Å½Â§Ã¥Ë†Â¶Ã¥â„¢Â¨Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨Ã¥Â¸Â¦Ã¦Å“â€° `@Valid` Ã§Å¡â€ž Bean Ã©ÂªÅ’Ã¨Â¯Â
* Ã¥Å“Â¨ DTO Ã¤Â¸Å Ã¥Âºâ€Ã§â€Â¨Ã§ÂºÂ¦Ã¦ÂÅ¸Ã¯Â¼Å¡`@NotBlank`Ã£â‚¬Â`@Email`Ã£â‚¬Â`@Size`Ã£â‚¬ÂÃ¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã©ÂªÅ’Ã¨Â¯ÂÃ¥â„¢Â¨
* Ã¥Å“Â¨Ã¦Â¸Â²Ã¦Å¸â€œÃ¤Â¹â€¹Ã¥â€°ÂÃ¤Â½Â¿Ã§â€Â¨Ã§â„¢Â½Ã¥ÂÂÃ¥Ââ€¢Ã¦Â¸â€¦Ã§Ââ€ Ã¤Â»Â»Ã¤Â½â€¢ HTML

```java
// BAD: No validation
@PostMapping("/users")
public User createUser(@RequestBody UserDto dto) {
  return userService.create(dto);
}

// GOOD: Validated DTO
public record CreateUserDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotNull @Min(0) @Max(150) Integer age
) {}

@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto dto) {
  return ResponseEntity.status(HttpStatus.CREATED)
      .body(userService.create(dto));
}
```

## SQL Ã¦Â³Â¨Ã¥â€¦Â¥Ã©Â¢â€žÃ©ËœÂ²

* Ã¤Â½Â¿Ã§â€Â¨ Spring Data Ã¥Â­ËœÃ¥â€šÂ¨Ã¥Âºâ€œÃ¦Ë†â€“Ã¥Ââ€šÃ¦â€¢Â°Ã¥Å’â€“Ã¦Å¸Â¥Ã¨Â¯Â¢
* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¥Å½Å¸Ã§â€Å¸Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `:param` Ã§Â»â€˜Ã¥Â®Å¡Ã¯Â¼â€ºÃ¥Ë†â€¡Ã¥â€¹Â¿Ã¦â€¹Â¼Ã¦Å½Â¥Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²

```java
// BAD: String concatenation in native query
@Query(value = "SELECT * FROM users WHERE name = '" + name + "'", nativeQuery = true)

// GOOD: Parameterized native query
@Query(value = "SELECT * FROM users WHERE name = :name", nativeQuery = true)
List<User> findByName(@Param("name") String name);

// GOOD: Spring Data derived query (auto-parameterized)
List<User> findByEmailAndActiveTrue(String email);
```

## Ã¥Â¯â€ Ã§Â ÂÃ§Â¼â€“Ã§Â Â

* Ã¥Â§â€¹Ã§Â»Ë†Ã¤Â½Â¿Ã§â€Â¨ BCrypt Ã¦Ë†â€“ Argon2 Ã¥â€œË†Ã¥Â¸Å’Ã¥Â¯â€ Ã§Â ÂÃ¢â‚¬â€Ã¢â‚¬â€Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¥Â­ËœÃ¥â€šÂ¨Ã¦ËœÅ½Ã¦â€“â€¡
* Ã¤Â½Â¿Ã§â€Â¨ `PasswordEncoder` BeanÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¦â€°â€¹Ã¥Å Â¨Ã¥â€œË†Ã¥Â¸Å’

```java
@Bean
public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder(12); // cost factor 12
}

// In service
public User register(CreateUserDto dto) {
  String hashedPassword = passwordEncoder.encode(dto.password());
  return userRepository.save(new User(dto.email(), hashedPassword));
}
```

## CSRF Ã¤Â¿ÂÃ¦Å Â¤

* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¦ÂµÂÃ¨Â§Ë†Ã¥â„¢Â¨Ã¤Â¼Å¡Ã¨Â¯ÂÃ¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¯Â¼Å’Ã¤Â¿ÂÃ¦Å’Â CSRF Ã¥ÂÂ¯Ã§â€Â¨Ã¯Â¼â€ºÃ¥Å“Â¨Ã¨Â¡Â¨Ã¥Ââ€¢/Ã¥Â¤Â´Ã¤Â¸Â­Ã¥Å’â€¦Ã¥ÂÂ«Ã¤Â»Â¤Ã§â€°Å’
* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¤Â½Â¿Ã§â€Â¨ Bearer Ã¤Â»Â¤Ã§â€°Å’Ã§Å¡â€žÃ§ÂºÂ¯ APIÃ¯Â¼Å’Ã§Â¦ÂÃ§â€Â¨ CSRF Ã¥Â¹Â¶Ã¤Â¾ÂÃ¨Âµâ€“Ã¦â€”Â Ã§Å Â¶Ã¦â‚¬ÂÃ¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯Â

```java
http
  .csrf(csrf -> csrf.disable())
  .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

## Ã¥Â¯â€ Ã©â€™Â¥Ã§Â®Â¡Ã§Ââ€ 

* Ã¦ÂºÂÃ¤Â»Â£Ã§Â ÂÃ¤Â¸Â­Ã¤Â¸ÂÃ¥Å’â€¦Ã¥ÂÂ«Ã¥Â¯â€ Ã©â€™Â¥Ã¯Â¼â€ºÃ¤Â»Å½Ã§Å½Â¯Ã¥Â¢Æ’Ã¥ÂËœÃ©â€¡ÂÃ¦Ë†â€“ vault Ã¥Å Â Ã¨Â½Â½
* Ã¤Â¿ÂÃ¦Å’Â `application.yml` Ã¤Â¸ÂÃ¥Å’â€¦Ã¥ÂÂ«Ã¥â€¡Â­Ã¦ÂÂ®Ã¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¥ÂÂ Ã¤Â½ÂÃ§Â¬Â¦
* Ã¥Â®Å¡Ã¦Å“Å¸Ã¨Â½Â®Ã¦ÂÂ¢Ã¤Â»Â¤Ã§â€°Å’Ã¥â€™Å’Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¥â€¡Â­Ã¦ÂÂ®

```yaml
# BAD: Hardcoded in application.yml
spring:
  datasource:
    password: mySecretPassword123

# GOOD: Environment variable placeholder
spring:
  datasource:
    password: ${DB_PASSWORD}

# GOOD: Spring Cloud Vault integration
spring:
  cloud:
    vault:
      uri: https://vault.example.com
      token: ${VAULT_TOKEN}
```

## Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¤Â´

```java
http
  .headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
      .policyDirectives("default-src 'self'"))
    .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
    .xssProtection(Customizer.withDefaults())
    .referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)));
```

## CORS Ã©â€¦ÂÃ§Â½Â®

* Ã¥Å“Â¨Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â¿â€¡Ã¦Â»Â¤Ã¥â„¢Â¨Ã§ÂºÂ§Ã¥Ë†Â«Ã©â€¦ÂÃ§Â½Â® CORSÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¦Å’â€°Ã¦Å½Â§Ã¥Ë†Â¶Ã¥â„¢Â¨Ã©â€¦ÂÃ§Â½Â®
* Ã©â„¢ÂÃ¥Ë†Â¶Ã¥â€¦ÂÃ¨Â®Â¸Ã§Å¡â€žÃ¦ÂÂ¥Ã¦ÂºÂÃ¢â‚¬â€Ã¢â‚¬â€Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’Ã¤Â¸Â­Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¤Â½Â¿Ã§â€Â¨ `*`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration config = new CorsConfiguration();
  config.setAllowedOrigins(List.of("https://app.example.com"));
  config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
  config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
  config.setAllowCredentials(true);
  config.setMaxAge(3600L);

  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**", config);
  return source;
}

// In SecurityFilterChain:
http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
```

## Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶

* Ã¥Å“Â¨Ã¦Ëœâ€šÃ¨Â´ÂµÃ§Å¡â€žÃ§Â«Â¯Ã§â€šÂ¹Ã¤Â¸Å Ã¥Âºâ€Ã§â€Â¨ Bucket4j Ã¦Ë†â€“Ã§Â½â€˜Ã¥â€¦Â³Ã§ÂºÂ§Ã©â„¢ÂÃ¥Ë†Â¶
* Ã¨Â®Â°Ã¥Â½â€¢Ã§ÂªÂÃ¥Ââ€˜Ã¦ÂµÂÃ©â€¡ÂÃ¥Â¹Â¶Ã¥â€˜Å Ã¨Â­Â¦Ã¯Â¼â€ºÃ¨Â¿â€Ã¥â€ºÅ¾ 429 Ã¥Â¹Â¶Ã¦ÂÂÃ¤Â¾â€ºÃ©â€¡ÂÃ¨Â¯â€¢Ã¦ÂÂÃ§Â¤Âº

```java
// Using Bucket4j for per-endpoint rate limiting
@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  private Bucket createBucket() {
    return Bucket.builder()
        .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
        .build();
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain) throws ServletException, IOException {
    String clientIp = request.getRemoteAddr();
    Bucket bucket = buckets.computeIfAbsent(clientIp, k -> createBucket());

    if (bucket.tryConsume(1)) {
      chain.doFilter(request, response);
    } else {
      response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
      response.getWriter().write("{\"error\": \"Rate limit exceeded\"}");
    }
  }
}
```

## Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã¥Â®â€°Ã¥â€¦Â¨

* Ã¥Å“Â¨ CI Ã¤Â¸Â­Ã¨Â¿ÂÃ¨Â¡Å’ OWASP Dependency Check / Snyk
* Ã¤Â¿ÂÃ¦Å’Â Spring Boot Ã¥â€™Å’ Spring Security Ã¥Å“Â¨Ã¥Ââ€”Ã¦â€Â¯Ã¦Å’ÂÃ§Å¡â€žÃ§â€°Ë†Ã¦Å“Â¬
* Ã¥Â¯Â¹Ã¥Â·Â²Ã§Å¸Â¥ CVE Ã¤Â½Â¿Ã¦Å¾â€žÃ¥Â»ÂºÃ¥Â¤Â±Ã¨Â´Â¥

## Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢Ã¥â€™Å’ PII

* Ã¥Ë†â€¡Ã¥â€¹Â¿Ã¨Â®Â°Ã¥Â½â€¢Ã¥Â¯â€ Ã©â€™Â¥Ã£â‚¬ÂÃ¤Â»Â¤Ã§â€°Å’Ã£â‚¬ÂÃ¥Â¯â€ Ã§Â ÂÃ¦Ë†â€“Ã¥Â®Å’Ã¦â€¢Â´Ã§Å¡â€ž PAN Ã¦â€¢Â°Ã¦ÂÂ®
* Ã¦â€œÂ¦Ã©â„¢Â¤Ã¦â€¢ÂÃ¦â€žÅ¸Ã¥Â­â€”Ã¦Â®ÂµÃ¯Â¼â€ºÃ¤Â½Â¿Ã§â€Â¨Ã§Â»â€œÃ¦Å¾â€žÃ¥Å’â€“ JSON Ã¦â€”Â¥Ã¥Â¿â€”Ã¨Â®Â°Ã¥Â½â€¢

## Ã¦â€“â€¡Ã¤Â»Â¶Ã¤Â¸Å Ã¤Â¼Â 

* Ã©ÂªÅ’Ã¨Â¯ÂÃ¥Â¤Â§Ã¥Â°ÂÃ£â‚¬ÂÃ¥â€ â€¦Ã¥Â®Â¹Ã§Â±Â»Ã¥Å¾â€¹Ã¥â€™Å’Ã¦â€°Â©Ã¥Â±â€¢Ã¥ÂÂ
* Ã¥Â­ËœÃ¥â€šÂ¨Ã¥Å“Â¨ Web Ã¦Â Â¹Ã§â€ºÂ®Ã¥Â½â€¢Ã¤Â¹â€¹Ã¥Â¤â€“Ã¯Â¼â€ºÃ¥Â¦â€šÃ¦Å¾Å“Ã©Å“â‚¬Ã¨Â¦ÂÃ¥Ë†â„¢Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦â€°Â«Ã¦ÂÂ

## Ã¥Ââ€˜Ã¥Â¸Æ’Ã¥â€°ÂÃ¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

* \[ ] Ã¨ÂºÂ«Ã¤Â»Â½Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Â»Â¤Ã§â€°Å’Ã¥Â·Â²Ã©ÂªÅ’Ã¨Â¯ÂÃ¥Â¹Â¶Ã¦Â­Â£Ã§Â¡Â®Ã¨Â¿â€¡Ã¦Å“Å¸
* \[ ] Ã¦Â¯ÂÃ¤Â¸ÂªÃ¦â€¢ÂÃ¦â€žÅ¸Ã¨Â·Â¯Ã¥Â¾â€žÃ©Æ’Â½Ã¦Å“â€°Ã¦Å½Ë†Ã¦ÂÆ’Ã¥Â®Ë†Ã¥ÂÂ«
* \[ ] Ã¦â€°â‚¬Ã¦Å“â€°Ã¨Â¾â€œÃ¥â€¦Â¥Ã©Æ’Â½Ã¥Â·Â²Ã©ÂªÅ’Ã¨Â¯ÂÃ¥â€™Å’Ã¦Â¸â€¦Ã§Ââ€ 
* \[ ] Ã¦Â²Â¡Ã¦Å“â€°Ã¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¦â€¹Â¼Ã¦Å½Â¥Ã§Å¡â€ž SQL
* \[ ] CSRF Ã§Â­â€“Ã§â€¢Â¥Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ§Â±Â»Ã¥Å¾â€¹
* \[ ] Ã¥Â¯â€ Ã©â€™Â¥Ã¥Â·Â²Ã¥Â¤â€“Ã©Æ’Â¨Ã¥Å’â€“Ã¯Â¼â€ºÃ¦Å“ÂªÃ¦ÂÂÃ¤ÂºÂ¤Ã¤Â»Â»Ã¤Â½â€¢Ã¥Â¯â€ Ã©â€™Â¥
* \[ ] Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â¤Â´Ã¥Â·Â²Ã©â€¦ÂÃ§Â½Â®
* \[ ] API Ã¦Å“â€°Ã©â‚¬Å¸Ã§Å½â€¡Ã©â„¢ÂÃ¥Ë†Â¶
* \[ ] Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã¥Â·Â²Ã¦â€°Â«Ã¦ÂÂÃ¥Â¹Â¶Ã¤Â¿ÂÃ¦Å’ÂÃ¦Å“â‚¬Ã¦â€“Â°
* \[ ] Ã¦â€”Â¥Ã¥Â¿â€”Ã¤Â¸ÂÃ¥Å’â€¦Ã¥ÂÂ«Ã¦â€¢ÂÃ¦â€žÅ¸Ã¦â€¢Â°Ã¦ÂÂ®

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã©Â»ËœÃ¨Â®Â¤Ã¦â€¹â€™Ã§Â»ÂÃ£â‚¬ÂÃ©ÂªÅ’Ã¨Â¯ÂÃ¨Â¾â€œÃ¥â€¦Â¥Ã£â‚¬ÂÃ¦Å“â‚¬Ã¥Â°ÂÃ¦ÂÆ’Ã©â„¢ÂÃ£â‚¬ÂÃ¤Â¼ËœÃ¥â€¦Ë†Ã©â€¡â€¡Ã§â€Â¨Ã¥Â®â€°Ã¥â€¦Â¨Ã©â€¦ÂÃ§Â½Â®Ã£â‚¬â€š
