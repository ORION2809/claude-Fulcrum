---
name: jpa-patterns
description: Spring BootÃ¤Â¸Â­Ã§Å¡â€žJPA/HibernateÃ¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã§â€Â¨Ã¤ÂºÅ½Ã¥Â®Å¾Ã¤Â½â€œÃ¨Â®Â¾Ã¨Â®Â¡Ã£â‚¬ÂÃ¥â€¦Â³Ã§Â³Â»Ã¥Â¤â€žÃ§Ââ€ Ã£â‚¬ÂÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¼ËœÃ¥Å’â€“Ã£â‚¬ÂÃ¤Âºâ€¹Ã¥Å Â¡Ã§Â®Â¡Ã§Ââ€ Ã£â‚¬ÂÃ¥Â®Â¡Ã¨Â®Â¡Ã£â‚¬ÂÃ§Â´Â¢Ã¥Â¼â€¢Ã£â‚¬ÂÃ¥Ë†â€ Ã©Â¡ÂµÃ¥â€™Å’Ã¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â Ã£â‚¬â€š
origin: claude-fulcrum
---

# JPA/Hibernate Ã¦Â¨Â¡Ã¥Â¼Â

Ã§â€Â¨Ã¤ÂºÅ½ Spring Boot Ã¤Â¸Â­Ã§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Â»ÂºÃ¦Â¨Â¡Ã£â‚¬ÂÃ¥Â­ËœÃ¥â€šÂ¨Ã¥Âºâ€œÃ¥â€™Å’Ã¦â‚¬Â§Ã¨Æ’Â½Ã¨Â°Æ’Ã¤Â¼ËœÃ£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã¨Â®Â¾Ã¨Â®Â¡ JPA Ã¥Â®Å¾Ã¤Â½â€œÃ¥â€™Å’Ã¨Â¡Â¨Ã¦ËœÂ Ã¥Â°â€žÃ¦â€”Â¶
* Ã¥Â®Å¡Ã¤Â¹â€°Ã¥â€¦Â³Ã§Â³Â»Ã¦â€”Â¶ (@OneToMany, @ManyToOne, @ManyToMany)
* Ã¤Â¼ËœÃ¥Å’â€“Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦â€”Â¶ (N+1 Ã©â€”Â®Ã©Â¢ËœÃ©Â¢â€žÃ©ËœÂ²Ã£â‚¬ÂÃ¨Å½Â·Ã¥Ââ€“Ã§Â­â€“Ã§â€¢Â¥Ã£â‚¬ÂÃ¦Å â€¢Ã¥Â½Â±)
* Ã©â€¦ÂÃ§Â½Â®Ã¤Âºâ€¹Ã¥Å Â¡Ã£â‚¬ÂÃ¥Â®Â¡Ã¨Â®Â¡Ã¦Ë†â€“Ã¨Â½Â¯Ã¥Ë†Â Ã©â„¢Â¤Ã¦â€”Â¶
* Ã¨Â®Â¾Ã§Â½Â®Ã¥Ë†â€ Ã©Â¡ÂµÃ£â‚¬ÂÃ¦Å½â€™Ã¥ÂºÂÃ¦Ë†â€“Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã¥Â­ËœÃ¥â€šÂ¨Ã¥Âºâ€œÃ¦â€“Â¹Ã¦Â³â€¢Ã¦â€”Â¶
* Ã¨Â°Æ’Ã¦â€¢Â´Ã¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â  (HikariCP) Ã¦Ë†â€“Ã¤ÂºÅ’Ã§ÂºÂ§Ã§Â¼â€œÃ¥Â­ËœÃ¦â€”Â¶

## Ã¥Â®Å¾Ã¤Â½â€œÃ¨Â®Â¾Ã¨Â®Â¡

```java
@Entity
@Table(name = "markets", indexes = {
  @Index(name = "idx_markets_slug", columnList = "slug", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
public class MarketEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String name;

  @Column(nullable = false, unique = true, length = 120)
  private String slug;

  @Enumerated(EnumType.STRING)
  private MarketStatus status = MarketStatus.ACTIVE;

  @CreatedDate private Instant createdAt;
  @LastModifiedDate private Instant updatedAt;
}
```

Ã¥ÂÂ¯Ã§â€Â¨Ã¥Â®Â¡Ã¨Â®Â¡Ã¯Â¼Å¡

```java
@Configuration
@EnableJpaAuditing
class JpaConfig {}
```

## Ã¥â€¦Â³Ã¨Ââ€Ã¥â€¦Â³Ã§Â³Â»Ã¥â€™Å’ N+1 Ã©Â¢â€žÃ©ËœÂ²

```java
@OneToMany(mappedBy = "market", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PositionEntity> positions = new ArrayList<>();
```

* Ã©Â»ËœÃ¨Â®Â¤Ã¤Â½Â¿Ã§â€Â¨Ã¥Â»Â¶Ã¨Â¿Å¸Ã¥Å Â Ã¨Â½Â½Ã¯Â¼â€ºÃ©Å“â‚¬Ã¨Â¦ÂÃ¦â€”Â¶Ã¥Å“Â¨Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ `JOIN FETCH`
* Ã©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã©â€ºâ€ Ã¥ÂË†Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `EAGER`Ã¯Â¼â€ºÃ¥Â¯Â¹Ã¤ÂºÅ½Ã¨Â¯Â»Ã¥Ââ€“Ã¨Â·Â¯Ã¥Â¾â€žÃ¤Â½Â¿Ã§â€Â¨ DTO Ã¦Å â€¢Ã¥Â½Â±

```java
@Query("select m from MarketEntity m left join fetch m.positions where m.id = :id")
Optional<MarketEntity> findWithPositions(@Param("id") Long id);
```

## Ã¥Â­ËœÃ¥â€šÂ¨Ã¥Âºâ€œÃ¦Â¨Â¡Ã¥Â¼Â

```java
public interface MarketRepository extends JpaRepository<MarketEntity, Long> {
  Optional<MarketEntity> findBySlug(String slug);

  @Query("select m from MarketEntity m where m.status = :status")
  Page<MarketEntity> findByStatus(@Param("status") MarketStatus status, Pageable pageable);
}
```

* Ã¤Â½Â¿Ã§â€Â¨Ã¦Å â€¢Ã¥Â½Â±Ã¨Â¿â€ºÃ¨Â¡Å’Ã¨Â½Â»Ã©â€¡ÂÃ§ÂºÂ§Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¯Â¼Å¡

```java
public interface MarketSummary {
  Long getId();
  String getName();
  MarketStatus getStatus();
}
Page<MarketSummary> findAllBy(Pageable pageable);
```

## Ã¤Âºâ€¹Ã¥Å Â¡

* Ã¤Â½Â¿Ã§â€Â¨ `@Transactional` Ã¦Â³Â¨Ã¨Â§Â£Ã¦Å“ÂÃ¥Å Â¡Ã¦â€“Â¹Ã¦Â³â€¢
* Ã¥Â¯Â¹Ã¨Â¯Â»Ã¥Ââ€“Ã¨Â·Â¯Ã¥Â¾â€žÃ¤Â½Â¿Ã§â€Â¨ `@Transactional(readOnly = true)` Ã¤Â»Â¥Ã¨Â¿â€ºÃ¨Â¡Å’Ã¤Â¼ËœÃ¥Å’â€“
* Ã¨Â°Â¨Ã¦â€¦Å½Ã©â‚¬â€°Ã¦â€¹Â©Ã¤Â¼Â Ã¦â€™Â­Ã¨Â¡Å’Ã¤Â¸ÂºÃ¯Â¼â€ºÃ©ÂÂ¿Ã¥â€¦ÂÃ©â€¢Â¿Ã¦â€”Â¶Ã©â€”Â´Ã¨Â¿ÂÃ¨Â¡Å’Ã§Å¡â€žÃ¤Âºâ€¹Ã¥Å Â¡

```java
@Transactional
public Market updateStatus(Long id, MarketStatus status) {
  MarketEntity entity = repo.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Market"));
  entity.setStatus(status);
  return Market.from(entity);
}
```

## Ã¥Ë†â€ Ã©Â¡Âµ

```java
PageRequest page = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
Page<MarketEntity> markets = repo.findByStatus(MarketStatus.ACTIVE, page);
```

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã§Â±Â»Ã¤Â¼Â¼Ã¦Â¸Â¸Ã¦Â â€¡Ã§Å¡â€žÃ¥Ë†â€ Ã©Â¡ÂµÃ¯Â¼Å’Ã¥Å“Â¨ JPQL Ã¤Â¸Â­Ã¥Å’â€¦Ã¥ÂÂ« `id > :lastId` Ã¥Â¹Â¶Ã©â€¦ÂÃ¥ÂË†Ã¦Å½â€™Ã¥ÂºÂÃ£â‚¬â€š

## Ã§Â´Â¢Ã¥Â¼â€¢Ã¥â€™Å’Ã¦â‚¬Â§Ã¨Æ’Â½

* Ã¤Â¸ÂºÃ¥Â¸Â¸Ã§â€Â¨Ã¨Â¿â€¡Ã¦Â»Â¤Ã¥â„¢Â¨Ã¦Â·Â»Ã¥Å Â Ã§Â´Â¢Ã¥Â¼â€¢Ã¯Â¼Ë†`status`Ã£â‚¬Â`slug`Ã£â‚¬ÂÃ¥Â¤â€“Ã©â€Â®Ã¯Â¼â€°
* Ã¤Â½Â¿Ã§â€Â¨Ã¤Â¸Å½Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ¥Å’Â¹Ã©â€¦ÂÃ§Å¡â€žÃ¥Â¤ÂÃ¥ÂË†Ã§Â´Â¢Ã¥Â¼â€¢Ã¯Â¼Ë†`status, created_at`Ã¯Â¼â€°
* Ã©ÂÂ¿Ã¥â€¦Â `select *`Ã¯Â¼â€ºÃ¤Â»â€¦Ã¦Å â€¢Ã¥Â½Â±Ã©Å“â‚¬Ã¨Â¦ÂÃ§Å¡â€žÃ¥Ë†â€”
* Ã¤Â½Â¿Ã§â€Â¨ `saveAll` Ã¥â€™Å’ `hibernate.jdbc.batch_size` Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦â€°Â¹Ã©â€¡ÂÃ¥â€ â„¢Ã¥â€¦Â¥

## Ã¨Â¿Å¾Ã¦Å½Â¥Ã¦Â±Â  (HikariCP)

Ã¦Å½Â¨Ã¨ÂÂÃ¥Â±Å¾Ã¦â‚¬Â§Ã¯Â¼Å¡

```
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=5000
```

Ã¥Â¯Â¹Ã¤ÂºÅ½ PostgreSQL LOB Ã¥Â¤â€žÃ§Ââ€ Ã¯Â¼Å’Ã¦Â·Â»Ã¥Å Â Ã¯Â¼Å¡

```
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
```

## Ã§Â¼â€œÃ¥Â­Ëœ

* Ã¤Â¸â‚¬Ã§ÂºÂ§Ã§Â¼â€œÃ¥Â­ËœÃ¦ËœÂ¯Ã¦Â¯ÂÃ¤Â¸Âª EntityManager Ã§Å¡â€žÃ¯Â¼â€ºÃ©ÂÂ¿Ã¥â€¦ÂÃ¥Å“Â¨Ã¤Âºâ€¹Ã¥Å Â¡Ã¤Â¹â€¹Ã©â€”Â´Ã¤Â¿ÂÃ¦Å’ÂÃ¥Â®Å¾Ã¤Â½â€œ
* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¨Â¯Â»Ã¥Ââ€“Ã©Â¢â€˜Ã§Â¹ÂÃ§Å¡â€žÃ¥Â®Å¾Ã¤Â½â€œÃ¯Â¼Å’Ã¨Â°Â¨Ã¦â€¦Å½Ã¨â‚¬Æ’Ã¨â„¢â€˜Ã¤ÂºÅ’Ã§ÂºÂ§Ã§Â¼â€œÃ¥Â­ËœÃ¯Â¼â€ºÃ©ÂªÅ’Ã¨Â¯ÂÃ©Â©Â±Ã©â‚¬ÂÃ§Â­â€“Ã§â€¢Â¥

## Ã¨Â¿ÂÃ§Â§Â»

* Ã¤Â½Â¿Ã§â€Â¨ Flyway Ã¦Ë†â€“ LiquibaseÃ¯Â¼â€ºÃ¥Ë†â€¡Ã¥â€¹Â¿Ã¥Å“Â¨Ã§â€Å¸Ã¤ÂºÂ§Ã¤Â¸Â­Ã¤Â¾ÂÃ¨Âµâ€“ Hibernate Ã¨â€¡ÂªÃ¥Å Â¨ DDL
* Ã¤Â¿ÂÃ¦Å’ÂÃ¨Â¿ÂÃ§Â§Â»Ã§Å¡â€žÃ¥Â¹â€šÃ§Â­â€°Ã¦â‚¬Â§Ã¥â€™Å’Ã¥ÂÂ¯Ã¦Â·Â»Ã¥Å Â Ã¦â‚¬Â§Ã¯Â¼â€ºÃ©ÂÂ¿Ã¥â€¦ÂÃ¦â€”Â Ã¨Â®Â¡Ã¥Ë†â€™Ã¥Å“Â°Ã¥Ë†Â Ã©â„¢Â¤Ã¥Ë†â€”

## Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â®Â¿Ã©â€”Â®

* Ã©Â¦â€“Ã©â‚¬â€°Ã¤Â½Â¿Ã§â€Â¨ Testcontainers Ã§Å¡â€ž `@DataJpaTest` Ã¦ÂÂ¥Ã©â€¢Å“Ã¥Æ’ÂÃ§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’
* Ã¤Â½Â¿Ã§â€Â¨Ã¦â€”Â¥Ã¥Â¿â€”Ã¦â€“Â­Ã¨Â¨â‚¬ SQL Ã¦â€¢Ë†Ã§Å½â€¡Ã¯Â¼Å¡Ã¨Â®Â¾Ã§Â½Â® `logging.level.org.hibernate.SQL=DEBUG` Ã¥â€™Å’ `logging.level.org.hibernate.orm.jdbc.bind=TRACE` Ã¤Â»Â¥Ã¦Å¸Â¥Ã§Å“â€¹Ã¥Ââ€šÃ¦â€¢Â°Ã¥â‚¬Â¼

**Ã¨Â¯Â·Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¤Â¿ÂÃ¦Å’ÂÃ¥Â®Å¾Ã¤Â½â€œÃ§Â²Â¾Ã§Â®â‚¬Ã¯Â¼Å’Ã¦Å¸Â¥Ã¨Â¯Â¢Ã¦Å“â€°Ã©â€™Ë†Ã¥Â¯Â¹Ã¦â‚¬Â§Ã¯Â¼Å’Ã¤Âºâ€¹Ã¥Å Â¡Ã§Â®â‚¬Ã§Å¸Â­Ã£â‚¬â€šÃ©â‚¬Å¡Ã¨Â¿â€¡Ã¨Å½Â·Ã¥Ââ€“Ã§Â­â€“Ã§â€¢Â¥Ã¥â€™Å’Ã¦Å â€¢Ã¥Â½Â±Ã¦ÂÂ¥Ã©Â¢â€žÃ©ËœÂ² N+1 Ã©â€”Â®Ã©Â¢ËœÃ¯Â¼Å’Ã¥Â¹Â¶Ã¦Â Â¹Ã¦ÂÂ®Ã¨Â¯Â»Ã¥â€ â„¢Ã¨Â·Â¯Ã¥Â¾â€žÃ¥Â»ÂºÃ§Â«â€¹Ã§Â´Â¢Ã¥Â¼â€¢Ã£â‚¬â€š
