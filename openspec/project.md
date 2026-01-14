# Project Context

## Purpose
ExímIA Ventures is a Multi-Agent System (MAS) ecosystem designed to act as an automated venture studio. Specialized AI agents (like The_CEO, The_CFO, The_CLO, The_Veritas) collaborate to ideate, validate, and execute business projects (e.g., "Agenda Cheia"). The project also encompasses "Eximia OS," a visual, spatial operating system interface (built with React/Vite) to manage these agents and workflows.

## Tech Stack
- **Agents & Backend**: Python, Google Gemini Models, LangChain (assumed), Vector Stores.
- **Frontend (Eximia OS)**: TypeScript (~5.9), React 19, Vite, TailwindCSS (if requested), Vanilla CSS.
- **Data**: Markdown-based Knowledge Bases, JSON/YAML for configurations.

## Project Conventions

### Code Style
- **Agents**: Structured folders (`01_spec`, `02_profile`, `knowledge_base`). Markdown is the primary documentation format.
- **Frontend**: Functional React components, strict TypeScript typing.
- **Naming**: Agents are named `The_[Role]` (e.g., `The_Veritas`).

### Architecture Patterns
- **Protocol**: "Veritas First" - The_Veritas agent must validate facts before strategic decisions.
- **Orchestration**: "Maestro" agent coordinates other specialist agents.
- **Eximia OS**: Desktop-metaphor UI for agent interaction.

### Testing Strategy
- **Agents**: Scenario-based benchmarking (e.g., "Legal Viability Assessment", "Market Research").
- **Frontend**: Standard unit/integration tests (Vitest/Jest).

### Git Workflow
- Feature-based development.
- Documentation-first approach (Specs and Profiles defined before implementation).

## Domain Context
- **Venture Studio**: The system mimics a real-world company structure.
- **Micro-SaaS**: Focus on creating small, focused software-as-a-service products.
- **Legal & Compliance**: Heavy emphasis on legal viability (The_CLO) and market validation.

## Important Constraints
- **Accuracy**: High priority on hallucination reduction via "Veritas" protocols.
- **Persona**: Agents must drastically adhere to their specific psychological profiles (e.g., "Staying Hard", "Corporate Professional").

## External Dependencies
- Google Gemini API
- Browser Tools (for web search)
