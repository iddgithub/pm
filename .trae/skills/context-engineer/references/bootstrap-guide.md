# Bootstrap Guide

How to take a user from zero to a working Context repo in one session.

## Table of Contents

1. [Environment Detection](#environment-detection)
2. [The Interview](#the-interview)
3. [Directory Scaffolding](#directory-scaffolding)
4. [Seed Content Generation](#seed-content-generation)
5. [Index Generation](#index-generation)
6. [Handoff](#handoff)

---

## Environment Detection

Before asking anything, detect the user's setup:

1. Check if `.claude/` directory exists → Claude Code
2. Check if `.cursor/` directory exists → Cursor
3. Check if `.windsurfrules` exists → Windsurf
4. Ask the user if detection fails

Also check:
- Is this directory a git repo? (`git status`)
- Is it empty or does it have existing content?
- If existing content exists, offer to organize it rather than starting from scratch

---

## The Interview

The interview extracts the user's business knowledge and structures it into seed content. Don't ask all questions at once — adapt based on answers. The goal is to get enough material to generate 3-5 meaningful seed documents.

### Core Questions (ask these)

**Q1: What do you do?**
Purpose: Establish role and responsibilities.
Examples of good answers: "I'm a PM at a SaaS company", "I run marketing for a D2C brand", "I'm a solo founder building an AI tool"
→ This shapes the repo's category structure.

**Q2: What does your product/company do?**
Purpose: Extract the single most important piece of cold context.
Follow up: "Who are your customers?", "What problem does it solve?"
→ This becomes the first seed document: `context/product-overview.md`

**Q3: What terms or jargon does your team use that an outsider wouldn't know?**
Purpose: Build a terminology document.
Examples: "We call our users 'operators'", "ARR means annual recurring revenue", "A 'play' is a sales motion"
→ This becomes: `context/terminology.md`

**Q4: What are you currently working on?**
Purpose: Populate the workspace layer.
Examples: "Launching a new feature next week", "Writing a competitive analysis", "Planning Q2 roadmap"
→ This becomes 1-2 files in `workspace/`

**Q5: What's something you find yourself explaining to AI (or new colleagues) repeatedly?**
Purpose: Identify high-value context that the user already knows they need.
This often surfaces the most impactful content — things like "our pricing model", "how our architecture works", "our design principles".
→ This becomes additional context documents.

### Adaptive Questions (ask based on context)

- **If the user manages a team**: "What are the key roles and who does what?" → `context/team.md`
- **If the user mentions competitors**: "Who are your main competitors and how do you differ?" → `context/competitors.md`
- **If the user mentions standards/regulations**: "What standards or regulations govern your work?" → `context/standards.md`
- **If the user mentions customers**: "Can you describe your typical customer?" → `context/customer-profile.md`

### Interview Anti-Patterns

- Don't ask more than 8 questions total. Diminishing returns.
- Don't ask questions the user can't answer right now. If they say "I haven't figured that out yet", move on.
- Don't generate generic content from the answers. Use their actual words and examples. The value is in specificity, not polish.
- Don't force categories. If the user's business doesn't have "competitors" or "standards", don't create empty sections for them.

---

## Directory Scaffolding

After the interview, generate the directory structure. Start minimal and let it grow organically.

### Minimum Viable Structure

```
{repo-root}/
├── context/                  ← Confirmed knowledge
│   ├── {index-file}
│   ├── product-overview.md   ← From Q2
│   └── terminology.md        ← From Q3
├── workspace/                ← Active work
│   ├── {index-file}
│   └── {current-project}.md  ← From Q4
├── drafts/                   ← Ideas & raw material
│   └── {index-file}
└── {root-index-file}         ← Root index (CLAUDE.md or .cursorrules)
```

### When to Add Sub-Directories

Don't pre-create subdirectories. Add them when a directory accumulates 7+ files on similar topics. For example:

```
context/
├── product-overview.md
├── feature-auth.md
├── feature-payments.md
├── feature-notifications.md
├── ...7+ feature docs...
```

→ Now it makes sense to create `context/features/` and move them there.

### Common Category Patterns

These are common patterns observed across different types of businesses. Don't force them — offer them as suggestions if relevant.

**For product teams:**
```
context/
├── product-overview.md
├── terminology.md
├── features/           (when features accumulate)
├── customers/          (if B2B with distinct segments)
├── competitors/        (if competitive landscape matters)
└── standards/          (if regulated industry)
```

**For marketing/ops teams:**
```
context/
├── brand-guide.md
├── audience-profiles.md
├── channel-strategy.md
├── terminology.md
└── templates/          (email templates, post formats)
```

**For solo founders / indie hackers:**
```
context/
├── product-overview.md
├── tech-stack.md
├── target-users.md
└── terminology.md
```

---

## Seed Content Generation

For each seed document, follow this process:

1. **Use the user's actual words** from the interview. Don't rephrase into corporate speak.
2. **Structure with headers** so AI can navigate quickly.
3. **Keep it concise** — a good seed document is 30-100 lines. It can grow later.
4. **Mark gaps explicitly** — if you don't have enough info, write `[TODO: fill in details about X]` rather than making something up.

### Seed Document: product-overview.md

```markdown
# {Product/Company Name}

## What We Do
{1-3 sentences from Q2, in the user's words}

## Who It's For
{Target customers/users}

## Core Problem We Solve
{The problem, stated simply}

## How It Works (High Level)
{Brief description of the product/service}

## What Makes Us Different
{If discussed — otherwise omit this section}
```

### Seed Document: terminology.md

```markdown
# Terminology

Terms and jargon used by our team. AI should use these terms consistently.

| Term | Meaning | Context |
|------|---------|---------|
| {term1} | {definition} | {when/where it's used} |
| {term2} | {definition} | {when/where it's used} |
```

### Seed Document: workspace items

Keep workspace documents lightweight at this stage:

```markdown
# {Project/Task Name}

**Status**: In Progress / Planning / Blocked
**Started**: {date}

## Background
{Why we're doing this}

## Goal
{What success looks like}

## Current State
{Where things stand right now}
```

---

## Index Generation

Generate index files appropriate for the detected tool environment. See `tool-compat.md` for format details.

### Index Content Structure

Every index file should contain:

1. **One-line repo description** — what this repo is about
2. **Directory map** — what each directory contains
3. **Key rules** — the three-layer architecture and document lifecycle
4. **File summaries** — one line per file (only for the current directory's files)

### Root Index Template

```markdown
# {Repo Name} — Context Repository

{One sentence: what this repo is, what business/product it supports.}

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `context/` | Confirmed knowledge — facts about the product, business, industry |
| `workspace/` | Active work — current projects, tasks, ongoing discussions |
| `drafts/` | Raw material — ideas, meeting notes, explorations |

## How It Works

- AI reads this index to navigate the repo
- Documents flow: `drafts/` → `workspace/` → `context/`
- When answering "how things are" → read `context/`
- When answering "what we're working on" → read `workspace/`
- For rough ideas and raw input → put in `drafts/`

## Contents

### context/
{list files with one-line summaries}

### workspace/
{list files with one-line summaries}

### drafts/
{list files with one-line summaries}
```

---

## Handoff

After generating everything, explain to the user:

1. **What was created** — list every file and its purpose
2. **What to do next** — suggest the next 2-3 highest-value documents to write (based on gaps identified during the interview)
3. **How to use it day-to-day**:
   - "When you learn something new about your business, tell me and I'll add it to context"
   - "When you start a new project, I'll create a workspace doc for it"
   - "When a project ships, I'll help distill it into permanent context"
4. **How to maintain it** — mention the Maintain and Evolve capabilities
