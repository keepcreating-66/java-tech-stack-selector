# Changelog

## [1.1.0] - 2026-10-29

- Both commands use one architecture-first wizard with editable business presets, Back, Cancel and final review.
- Generate distinct Maven layouts for monolith, modular monolith and microservices, with business examples and optional gateway.
- Align database, ORM, cache, security, documentation and prompt output with the selected configuration.
- Plan files before writing and stop when the project directory already exists.
- Test the production renderer and writer. Generated/build/runtime results remain separate states.
- Keep Gradle, switchable deployment and unimplemented components unavailable until their renderers and checks are complete.

## [1.0.0] - 2026-05-06

Initial QuickPick extension with presets and basic Spring Boot file generation. Some advertised choices did not change the produced project; the 1.1.0 workflow and renderer address that mismatch.
