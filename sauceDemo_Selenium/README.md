# SauceDemo Selenium + Cucumber Framework

End-to-end UI and API test automation built with **Java 21, Selenium 4, Cucumber 7 (BDD), and TestNG**, with RestAssured for API and Allure for reporting.

- UI under test: [https://www.saucedemo.com](https://www.saucedemo.com)
- API under test: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)

## Features

- BDD with Gherkin feature files and Cucumber step definitions, run on the **TestNG** runner.
- Page Object Model with a shared `BasePage` (explicit waits).
- Thread-safe `WebDriver` via `DriverManager` (`ThreadLocal`) + a config-driven `DriverFactory` (Chrome/Firefox/Edge, headless toggle); drivers resolved by **WebDriverManager**.
- Dependency injection between steps via PicoContainer (`ScenarioContext` + `PageObjectManager`).
- API tests with RestAssured and a Jackson `Post` POJO.
- Externalized test data in JSON (`src/main/resources/data/testdata.json`) loaded via a `TestData` reader (classpath with filesystem fallback).
- Flaky-test handling: TestNG `RetryAnalyzer` + `RetryListener`, with `RerunFilterListener` so recovered flakes don't fail the build.
- Allure reporting + screenshot/URL capture on failure (`Hooks`).
- Disables Chrome's password-leak ("Change your password") popup so SauceDemo's demo credentials don't break post-login flows.

## Tech stack

| Concern | Choice |
|---|---|
| Language / build | Java 21, Maven |
| UI automation | Selenium 4.44 + WebDriverManager 5.9 |
| BDD runner | Cucumber 7.20 on TestNG 7.12 |
| DI | cucumber-picocontainer |
| API | RestAssured 6.0 + Jackson 2.22 |
| Reporting | Allure 2.35 (`allure-cucumber7-jvm`) |
| Logging | SLF4J API |
| Assertions | TestNG `Assert` |

## Project structure

```
sauceDemo/
├── pom.xml
├── testng.xml                      # TestNG suite (listeners + thread count)
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
└── src/
    ├── main/
    │   ├── java/com/saucedemo/
    │   │   ├── config/ConfigReader.java        # config loader (classpath + filesystem fallback)
    │   │   ├── driver/{DriverFactory,DriverManager}.java
    │   │   ├── pages/{BasePage,LoginPage,ProductPage,CartPage,CheckoutPage}.java
    │   │   ├── api/ApiClient.java + api/models/Post.java
    │   │   ├── data/{TestData,Users,Products,CheckoutData,ApiData,PageData}.java
    │   │   └── utils/DataGenerator.java
    │   └── resources/
    │       ├── config/config.properties
    │       └── data/testdata.json
    └── test/
        ├── java/com/saucedemo/
        │   ├── runners/RunCucumberTest.java     # AbstractTestNGCucumberTests (parallel DataProvider)
        │   ├── runners/{RetryAnalyzer,RetryListener,RerunFilterListener}.java
        │   ├── context/{ScenarioContext,PageObjectManager}.java
        │   ├── hooks/Hooks.java                  # driver lifecycle + screenshot on failure
        │   └── stepdefs/{LoginSteps,ProductSteps,CartSteps,CheckoutSteps,ApiSteps}.java
        └── resources/
            ├── features/{login,products,cart,checkout,api}.feature
            └── allure.properties
```

## Prerequisites

- JDK 21+ and Maven 3.9+.
- A local browser (Chrome by default; Firefox/Edge optional). WebDriverManager auto-downloads the matching driver.
- Optional: Docker, to run in a container.

## Configuration

Defaults live in `src/main/resources/config/config.properties`, overridable at runtime with `-D`:

| Property | Purpose | Default |
|---|---|---|
| `base.url` | SauceDemo UI URL | `https://www.saucedemo.com/` |
| `api.url` | JSONPlaceholder API URL | `https://jsonplaceholder.typicode.com` |
| `browser` | `chrome` / `firefox` / `edge` | `chrome` |
| `headless` | run browser headless | `false` |
| `explicit.timeout` | explicit wait seconds | `40` |
| `password` | shared SauceDemo password | `secret_sauce` |

Externalized test data (users, products, checkout, api, page titles) lives in `src/main/resources/data/testdata.json`.

## Running tests

```bash
mvn test                                   # full suite (via testng.xml)
mvn test -Dheadless=true                   # headless
mvn test -Dbrowser=firefox                 # different browser
mvn test -Dcucumber.filter.tags="@smoke"   # by tag
mvn test -Dcucumber.filter.tags="@api"     # API only (no browser)
```

Parallelism is controlled in `testng.xml` via `data-provider-thread-count` (default 1; increase on a capable machine).

## Reports

```bash
mvn allure:serve            # Allure report (results in target/allure-results)
# Cucumber HTML report: target/cucumber-report.html
```

## Docker

```bash
docker compose up --build   # build (JDK 21 + Maven + Chrome) and run the suite
# or
docker build -t saucedemo-selenium .
docker run --rm --shm-size=2g saucedemo-selenium
```

## CI/CD

GitHub Actions workflow at [.github/workflows/ci.yml](.github/workflows/ci.yml): JDK 21 + Maven cache, headless Chrome, manual tag-filter dispatch, and artifact upload (Allure results, Surefire reports, failure screenshots). Configure repo secret `SAUCE_PASSWORD` and variables `BASE_URL` / `API_URL` for non-default environments.

## Scenario coverage (23 scenarios)

- Login: valid, locked-out, performance-glitch, invalid-login data table.
- Products: inventory count + contains backpack, sort price low->high, sort name Z->A, cart badge updates.
- Cart: shows items, remove item, continue shopping, proceed to checkout.
- Checkout: full happy-path with price verification + success, plus validation errors (missing first/last/postal).
- API: get all posts, get post by id, create post, non-existent post (404).

## Notes

- API scenarios are tagged `@api` and do not launch a browser (`Hooks` are scoped with `not @api`).
- Resources load from the classpath with a filesystem fallback, so IDE runs keep working even when `src/main/resources` isn't yet on the runtime classpath.
