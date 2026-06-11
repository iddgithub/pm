# context-engineer

Stop making AI start from zero every time.

`context-engineer` is a skill for turning scattered business knowledge into a structured Context repo that AI can actually use. Instead of repeatedly explaining your product, customers, internal jargon, meeting history, and current priorities, you build a knowledge system once and let AI work from it over time.

This is especially useful for product managers, operators, founders, and other knowledge workers who spend most of the day writing docs, organizing discussions, and re-explaining background so AI can produce something usable.

## Why This Exists

Most people don't have an "AI problem." They have a context problem.

You ask AI to write a PRD, summarize a meeting, analyze a competitor, or prepare a customer-facing document. The first draft looks plausible, but it's generic. Then you spend the next hour fixing tone, correcting assumptions, adding business background, and stitching in all the context AI didn't have.

`context-engineer` solves that problem by helping you build and maintain the missing layer: a reusable Context repo.

## What You Get

- A clean starting structure for a Context repo
- A repeatable way to route notes, PRDs, discussions, and facts into the right layer
- Index files that make the repo navigable for AI
- Lifecycle management so knowledge can move from rough idea to active work to confirmed context
- Health checks to spot missing coverage, stale docs, and broken indexing

## Core Model

```text
drafts/ -> workspace/ -> context/
```

- `drafts/`: ideas, raw notes, unresolved thinking
- `workspace/`: active projects, PRDs, discussions, bugs
- `context/`: confirmed knowledge that AI should treat as the current truth

The goal is not just to store documents. The goal is to accumulate reusable business understanding so AI outputs get sharper over time instead of restarting from scratch on every task.

## Typical Use Cases

- Bootstrap a new Context repo from what is currently in your head
- Turn raw meeting notes into structured working knowledge
- Keep `CLAUDE.md` or other index files in sync with the actual repo
- Review what should be promoted, reorganized, or cleaned up
- Diagnose whether your Context system is actually helping AI produce better work

## Install

Clone the repository:

```bash
git clone https://github.com/LeeFinn2025/context-engineer.git
```

### Claude Code

Use the repository as a standalone skill source, or copy it into your local skills / commands setup if that is how your environment loads reusable skills. The main entry point is `SKILL.md`.

### Cursor

Keep the repository locally and point Cursor or your agent workflow at `SKILL.md`. If you do not use a dedicated skills directory, you can still use the repo directly as a reusable instruction bundle plus references.

### OpenClaw

Clone the repository and expose `SKILL.md` to your agent as the primary skill definition. OpenClaw can also benefit from the repository staying intact, since the reference files provide the detailed operating model behind the skill.

### Generic agents

Any agent that can access local files or a Git repository can use this project by reading `SKILL.md` first and then following the referenced files in `references/` as needed.

## Repository Structure

```text
.
├── SKILL.md
├── references/
│   ├── bootstrap-guide.md
│   ├── templates.md
│   └── tool-compat.md
└── scripts/
```

## Files

- `SKILL.md`: the main skill definition, workflow, and operating principles
- `references/bootstrap-guide.md`: how to bootstrap a repo from user interviews
- `references/templates.md`: templates for common knowledge and work-document types
- `references/tool-compat.md`: compatibility notes for Claude Code, Cursor, Windsurf, and related tools

## Bottom Line

If AI already helps you write, think, summarize, and plan, then the next bottleneck is not prompting harder. It's giving AI a durable knowledge system to work from.

That is what `context-engineer` is for.
