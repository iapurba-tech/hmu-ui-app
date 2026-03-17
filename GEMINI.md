# Project Standards & Mandates

## Architectural Principles
- **Scalability & Modularity:** Adhere to a modular architecture (currently reflected in `src/modules/`). Keep modules decoupled.
- **Clean Code:** Prioritize readability, SOLID principles, and DRY. Use functional patterns where appropriate.

## Development Workflow (TDD)
- **Test-First:** Always write the test before the implementation.
- **Red-Green-Refactor:** Demonstrate the test failure, then implement the minimal code to pass, then refactor.

## Testing Strategy
- **Unit Tests:** Mandatory for every individual component. Focus on isolated logic and rendering.
- **Integration Tests:** Mandatory for every feature/module. Focus on user flows and multi-component interaction.
- **Coverage:** Aim for high meaningful coverage. Do not skip edge cases.
