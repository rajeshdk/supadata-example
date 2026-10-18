# Contributing to Supa Agent Starter

Thank you for your interest in contributing to **Supa Agent Starter**! We welcome contributions of all kinds: bug fixes, new agent tools, documentation improvements, UI polish, and performance enhancements.

This project demonstrates how to build production-ready AI agents using the official [Supadata SDK](https://supadata.ai) (`@supadata/js`) and Next.js.

---

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all contributors, regardless of experience level, gender identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, or religion. Please be respectful and constructive in all interactions.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: Version 18.17.0 or higher (v20+ recommended)
- **npm**: Version 9+
- A free Supadata API key from [supadata.ai/r/MD74ZQ3H](https://supadata.ai/r/MD74ZQ3H)
- An OpenAI API key or compatible provider (Groq, OpenRouter, Ollama)

### 2. Fork and Clone
```bash
git clone https://github.com/<your-username>/supa-agent-starter.git
cd supa-agent-starter
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
```bash
cp .env.example .env.local
```
Edit `.env.local` with your API keys.

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Workflow

### Adding a New Agent Tool

Tools are modular and live under `src/lib/tools/`. To add a new Supadata tool:

1. **Define the Tool Specification** in `src/lib/tools/definitions.ts`:
   - Add a descriptive name, explanation of when to call it, and a Zod parameter schema.
2. **Implement the Execution Handler** in `src/lib/tools/registry.ts`:
   - Use the typed Supadata client instance from `src/lib/supadata/client.ts`.
   - Wrap the call in standard error handling using `SupadataError`.
3. **Add Tests** in `tests/tools.test.ts`:
   - Verify parameter validation and proper handling of SDK responses and errors.
4. **Update Documentation** in `README.md` to list the new tool capability.

---

## Quality Standards & Checks

Before submitting a Pull Request, please ensure all checks pass locally:

```bash
# Run linting
npm run lint

# Run TypeScript type check
npm run typecheck

# Run test suite
npm run test

# Verify production build
npm run build
```

---

## Pull Request Guidelines

1. **Create a topic branch**: `git checkout -b feature/my-new-tool` or `git checkout -b fix/issue-description`.
2. **Write clear commit messages**: Follow conventional commits (e.g., `feat: add translate tool`, `fix: handle 429 rate limit error`).
3. **Keep PRs focused**: Address one feature or fix per pull request.
4. **Include tests**: Add or update unit tests for any new logic.
5. **Update docs**: Keep the README, comments, and schemas synchronized.

---

## Community & Questions

- Supadata Official Website: [https://supadata.ai](https://supadata.ai)
- Supadata Documentation: [https://supadata.ai/documentation](https://supadata.ai/documentation)
- GitHub Issues: Open an issue on this repository for bugs or feature discussions.

Thank you for helping make Supa Agent Starter even better!
