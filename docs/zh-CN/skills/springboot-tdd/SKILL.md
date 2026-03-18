---
name: springboot-tdd
description: Ã¤Â½Â¿Ã§â€Â¨JUnit 5Ã£â‚¬ÂMockitoÃ£â‚¬ÂMockMvcÃ£â‚¬ÂTestcontainersÃ¥â€™Å’JaCoCoÃ¨Â¿â€ºÃ¨Â¡Å’Spring BootÃ§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©Â©Â±Ã¥Å Â¨Ã¥Â¼â‚¬Ã¥Ââ€˜Ã£â‚¬â€šÃ©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½Ã¦Â·Â»Ã¥Å Â Ã¥Å Å¸Ã¨Æ’Â½Ã£â‚¬ÂÃ¤Â¿Â®Ã¥Â¤ÂÃ©â€â„¢Ã¨Â¯Â¯Ã¦Ë†â€“Ã©â€¡ÂÃ¦Å¾â€žÃ¦â€”Â¶Ã£â‚¬â€š
origin: claude-fulcrum
---

# Spring Boot TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ§Â¨â€¹

Ã©â‚¬â€šÃ§â€Â¨Ã¤ÂºÅ½ Spring Boot Ã¦Å“ÂÃ¥Å Â¡Ã£â‚¬ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡ 80%+Ã¯Â¼Ë†Ã¥Ââ€¢Ã¥â€¦Æ’ + Ã©â€ºâ€ Ã¦Ë†ÂÃ¯Â¼â€°Ã§Å¡â€ž TDD Ã¦Å’â€¡Ã¥Ââ€”Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨

* Ã¦â€“Â°Ã¥Å Å¸Ã¨Æ’Â½Ã¦Ë†â€“Ã§Â«Â¯Ã§â€šÂ¹
* Ã©â€â„¢Ã¨Â¯Â¯Ã¤Â¿Â®Ã¥Â¤ÂÃ¦Ë†â€“Ã©â€¡ÂÃ¦Å¾â€ž
* Ã¦Â·Â»Ã¥Å Â Ã¦â€¢Â°Ã¦ÂÂ®Ã¨Â®Â¿Ã©â€”Â®Ã©â‚¬Â»Ã¨Â¾â€˜Ã¦Ë†â€“Ã¥Â®â€°Ã¥â€¦Â¨Ã¨Â§â€žÃ¥Ë†â„¢

## Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ§Â¨â€¹

1. Ã¥â€¦Ë†Ã¥â€ â„¢Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Ë†Ã¥Â®Æ’Ã¤Â»Â¬Ã¥Âºâ€Ã¨Â¯Â¥Ã¥Â¤Â±Ã¨Â´Â¥Ã¯Â¼â€°
2. Ã¥Â®Å¾Ã§Å½Â°Ã¦Å“â‚¬Ã¥Â°ÂÃ¤Â»Â£Ã§Â ÂÃ¤Â»Â¥Ã©â‚¬Å¡Ã¨Â¿â€¡Ã¦Âµâ€¹Ã¨Â¯â€¢
3. Ã¥Å“Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã©â‚¬Å¡Ã¨Â¿â€¡Ã¥ÂÅ½Ã¨Â¿â€ºÃ¨Â¡Å’Ã©â€¡ÂÃ¦Å¾â€ž
4. Ã¥Â¼ÂºÃ¥Ë†Â¶Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¯Â¼Ë†JaCoCoÃ¯Â¼â€°

## Ã¥Ââ€¢Ã¥â€¦Æ’Ã¦Âµâ€¹Ã¨Â¯â€¢ (JUnit 5 + Mockito)

```java
@ExtendWith(MockitoExtension.class)
class MarketServiceTest {
  @Mock MarketRepository repo;
  @InjectMocks MarketService service;

  @Test
  void createsMarket() {
    CreateMarketRequest req = new CreateMarketRequest("name", "desc", Instant.now(), List.of("cat"));
    when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

    Market result = service.create(req);

    assertThat(result.name()).isEqualTo("name");
    verify(repo).save(any());
  }
}
```

Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å¡

* Arrange-Act-Assert
* Ã©ÂÂ¿Ã¥â€¦ÂÃ©Æ’Â¨Ã¥Ë†â€ Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¯Â¼â€ºÃ¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¦ËœÂ¾Ã¥Â¼ÂÃ¦Â¡Â©
* Ã¤Â½Â¿Ã§â€Â¨ `@ParameterizedTest` Ã¥Â¤â€žÃ§Ââ€ Ã¥ÂËœÃ¤Â½â€œ

## Web Ã¥Â±â€šÃ¦Âµâ€¹Ã¨Â¯â€¢ (MockMvc)

```java
@WebMvcTest(MarketController.class)
class MarketControllerTest {
  @Autowired MockMvc mockMvc;
  @MockBean MarketService marketService;

  @Test
  void returnsMarkets() throws Exception {
    when(marketService.list(any())).thenReturn(Page.empty());

    mockMvc.perform(get("/api/markets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").isArray());
  }
}
```

## Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢ (SpringBootTest)

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MarketIntegrationTest {
  @Autowired MockMvc mockMvc;

  @Test
  void createsMarket() throws Exception {
    mockMvc.perform(post("/api/markets")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
          {"name":"Test","description":"Desc","endDate":"2030-01-01T00:00:00Z","categories":["general"]}
        """))
      .andExpect(status().isCreated());
  }
}
```

## Ã¦Å’ÂÃ¤Â¹â€¦Ã¥Â±â€šÃ¦Âµâ€¹Ã¨Â¯â€¢ (DataJpaTest)

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfig.class)
class MarketRepositoryTest {
  @Autowired MarketRepository repo;

  @Test
  void savesAndFinds() {
    MarketEntity entity = new MarketEntity();
    entity.setName("Test");
    repo.save(entity);

    Optional<MarketEntity> found = repo.findByName("Test");
    assertThat(found).isPresent();
  }
}
```

## Testcontainers

* Ã¥Â¯Â¹ Postgres/Redis Ã¤Â½Â¿Ã§â€Â¨Ã¥ÂÂ¯Ã¥Â¤ÂÃ§â€Â¨Ã§Å¡â€žÃ¥Â®Â¹Ã¥â„¢Â¨Ã¤Â»Â¥Ã©â€¢Å“Ã¥Æ’ÂÃ§â€Å¸Ã¤ÂºÂ§Ã§Å½Â¯Ã¥Â¢Æ’
* Ã©â‚¬Å¡Ã¨Â¿â€¡ `@DynamicPropertySource` Ã¨Â¿Å¾Ã¦Å½Â¥Ã¯Â¼Å’Ã¥Â°â€  JDBC URL Ã¦Â³Â¨Ã¥â€¦Â¥ Spring Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡

## Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡ (JaCoCo)

Maven Ã§â€°â€¡Ã¦Â®ÂµÃ¯Â¼Å¡

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <executions>
    <execution>
      <goals><goal>prepare-agent</goal></goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>verify</phase>
      <goals><goal>report</goal></goals>
    </execution>
  </executions>
</plugin>
```

## Ã¦â€“Â­Ã¨Â¨â‚¬

* Ã¤Â¸ÂºÃ¥ÂÂ¯Ã¨Â¯Â»Ã¦â‚¬Â§Ã¯Â¼Å’Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨ AssertJ (`assertThat`)
* Ã¥Â¯Â¹Ã¤ÂºÅ½ JSON Ã¥â€œÂÃ¥Âºâ€Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `jsonPath`
* Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¥Â¼â€šÃ¥Â¸Â¸Ã¯Â¼Å¡`assertThatThrownBy(...)`

## Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€¢Â°Ã¦ÂÂ®Ã¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨

```java
class MarketBuilder {
  private String name = "Test";
  MarketBuilder withName(String name) { this.name = name; return this; }
  Market build() { return new Market(null, name, MarketStatus.ACTIVE); }
}
```

## CI Ã¥â€˜Â½Ã¤Â»Â¤

* Maven: `mvn -T 4 test` Ã¦Ë†â€“ `mvn verify`
* Gradle: `./gradlew test jacocoTestReport`

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¿Â«Ã©â‚¬Å¸Ã£â‚¬ÂÃ©Å¡â€Ã§Â¦Â»Ã¤Â¸â€Ã§Â¡Â®Ã¥Â®Å¡Ã£â‚¬â€šÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¡Å’Ã¤Â¸ÂºÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥Â®Å¾Ã§Å½Â°Ã§Â»â€ Ã¨Å â€šÃ£â‚¬â€š
