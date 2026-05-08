# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-05-06

### Added
- Initial release
- Java Tech Stack Selector plugin for Cursor and VSCode
- Support for 4 preset configurations:
  - Enterprise Admin System
  - E-commerce Platform
  - AI Application Platform
  - Microservice Architecture
- Custom configuration support for:
  - Project type (Monolith, Modular, Microservice)
  - Java version (8, 17, 21)
  - Build tools (Maven, Gradle)
  - Database (MySQL, PostgreSQL, Oracle, etc.)
  - ORM frameworks (MyBatis-Plus, MyBatis, JPA)
  - Cache solutions (Redis + Redisson/Lettuce/JetCache)
  - Authentication frameworks (Sa-Token, Spring Security, Shiro)
  - API documentation (Knife4j, Swagger)
  - Message queues (RocketMQ, RabbitMQ, Kafka)
  - Workflow engines (Flowable, Activiti, Camunda)
  - Task schedulers (XXL-Job, Quartz)
- Project generation with:
  - pom.xml with dependencies
  - application.yml configuration
  - Main application class
  - .gitignore
  - tech-stack-config.json
  - project-prompt.md

### Features
- Interactive QuickPick UI
- Version compatibility checking
- Comprehensive module documentation

---

## [Unreleased]

### Planned
- [ ] AI conversational configuration
- [ ] WebView rich interface
- [ ] More project templates
- [ ] Gradle build support
- [ ] Internationalization (i18n)
