# Tool Compatibility Guide

How to make a Context repo work across different AI coding tools.

## The Core Idea

All AI coding tools share the same need: they look for special files in your project to understand context. The file names differ, but the content structure is the same. This skill generates the right files for the user's tool.

---

## Compatibility Matrix

| Feature | Claude Code | Cursor | Windsurf | OpenClaw | Generic |
|---------|-------------|--------|----------|----------|---------|
| Root config | `CLAUDE.md` | `.cursorrules` | `.windsurfrules` | `CLAUDE.md` | `CLAUDE.md` |
| Directory indexes | `CLAUDE.md` | `CLAUDE.md` | `CLAUDE.md` | `CLAUDE.md` | `CLAUDE.md` |
| Auto-loaded | Yes (root) | Yes (root) | Yes (root) | Varies | No |
| Subdirectory auto-load | On navigation | No (manual include) | No | Varies | No |
| Slash commands | `.claude/commands/` | No | No | Varies | No |
| MCP support | Yes | Yes | Yes | Varies | No |

---

## Tool-Specific Setup

### Claude Code

The native environment for this skill. Everything works out of the box.

**Files to generate:**
- `CLAUDE.md` at repo root (auto-loaded into every conversation)
- `CLAUDE.md` in each directory (loaded when AI navigates there)

**Root CLAUDE.md considerations:**
- Keep under 200 lines — everything beyond ~200 lines risks being truncated
- Put the most critical information first
- Use sub-directory CLAUDE.md files for detailed content
- Link to sub-directory indexes: `[context/](context/CLAUDE.md)`

**Bonus: Slash commands**
If the user wants to install skills (like this one), they go in `.claude/commands/`. This is unique to Claude Code.

### Cursor

Cursor reads `.cursorrules` at the project root. It doesn't natively read `CLAUDE.md`, but Cursor's AI can still read any file when asked.

**Files to generate:**
- `.cursorrules` at repo root — this is auto-loaded
- `CLAUDE.md` in each directory — not auto-loaded, but AI can read them when exploring

**`.cursorrules` format:**
Same content as `CLAUDE.md`, but note:
- Cursor has a character limit for rules files (roughly ~6000 chars)
- Keep it shorter and more directive than the Claude Code version
- Focus on: repo structure overview, key rules, and pointers to subdirectory indexes
- Tell the AI explicitly: "When working in a directory, read its CLAUDE.md for detailed context"

**Example `.cursorrules`:**
```
# Context Repository

This project is a structured knowledge base. Here's how it's organized:

- context/ — Confirmed facts about the business, product, and industry
- workspace/ — Active projects and tasks
- drafts/ — Ideas and raw notes

Documents flow: drafts → workspace → context

When working in any directory, check for a CLAUDE.md file for detailed context about that directory's contents.

Key files:
- context/product-overview.md — What our product does
- context/terminology.md — Terms and jargon to use consistently
```

### Windsurf

Similar to Cursor. Reads `.windsurfrules` at root.

**Files to generate:**
- `.windsurfrules` at repo root
- `CLAUDE.md` in each directory (readable but not auto-loaded)

Same format and length considerations as `.cursorrules`.

### OpenClaw

OpenClaw is evolving rapidly. As of early 2026, it reads `CLAUDE.md` by default but behavior may vary by version.

**Files to generate:**
- `CLAUDE.md` at repo root
- `CLAUDE.md` in each directory

Treat it like Claude Code for now. If the user reports issues, adjust.

### Generic / Unknown Tool

Default to `CLAUDE.md` everywhere. It's the most portable format — any AI tool can read markdown files even if it doesn't auto-load them.

---

## Multi-Tool Strategy

If the user works across multiple tools (common for teams where PM uses Cursor but engineers use Claude Code):

1. Generate `CLAUDE.md` files everywhere (works for both)
2. Also generate `.cursorrules` at root (for Cursor users)
3. Keep both files in sync — the root `.cursorrules` should be a condensed version of the root `CLAUDE.md`

**Important:** Don't duplicate content across config files. The root tool-specific file (`.cursorrules`, `.windsurfrules`) should be a concise pointer that tells the AI where to find detailed context. The `CLAUDE.md` files contain the actual content.

---

## Detection Script

To auto-detect the user's environment, check in this order:

```
1. Does .claude/ directory exist?        → Claude Code
2. Does .cursor/ directory exist?        → Cursor
3. Does .windsurfrules exist?            → Windsurf
4. Does .cursorrules exist?              → Cursor (alternative signal)
5. None of the above?                    → Ask the user
```

If multiple signals are present, ask the user which is their primary tool, but generate compatible files for all detected tools.
