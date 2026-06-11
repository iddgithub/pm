# Document Templates

Templates for common document types. Use these as starting points — adapt to the user's actual content. Don't force content into a template that doesn't fit.

## Table of Contents

1. [Context Layer Templates](#context-layer-templates)
2. [Workspace Layer Templates](#workspace-layer-templates)
3. [Drafts Layer Templates](#drafts-layer-templates)
4. [Index File Templates](#index-file-templates)

---

## Context Layer Templates

### Product Overview

```markdown
# {Product/Company Name}

## What We Do
{Core value proposition in 1-3 sentences}

## Who It's For
{Target users/customers — be specific}

## Core Problem
{The problem being solved}

## How It Works
{High-level product description — enough for AI to understand the domain}

## Key Metrics
{What success looks like — revenue model, KPIs, etc.}
```

### Terminology

```markdown
# Terminology

Standard terms used across the team. AI should use these terms consistently in all outputs.

| Term | Definition | Notes |
|------|-----------|-------|
| | | |
```

### Feature / Module Documentation

```markdown
# {Feature Name}

## What It Does
{One paragraph — the feature's purpose and value}

## How It Works
{User-facing behavior: entry point, flow, expected outcomes}

## Key Rules & Constraints
{Business rules, edge cases, limitations}

## Dependencies
{What other features/systems this connects to}
```

### Team & Roles

```markdown
# Team

| Name | Role | Responsibilities | Notes |
|------|------|-------------------|-------|
| | | | |

## Working Agreements
{Communication norms, decision-making process, tools used}
```

### Competitor Analysis

```markdown
# Competitive Landscape

## Our Positioning
{How we're different — in one paragraph}

## Competitors

### {Competitor 1}
- **What they do**:
- **Strengths**:
- **Weaknesses**:
- **How we differ**:

### {Competitor 2}
...
```

### Industry Standards / Regulations

```markdown
# Standards & Regulations

## Applicable Standards

### {Standard Name} (e.g., ISO XXXX, GDPR)
- **What it requires**: {summary}
- **How we comply**: {our approach}
- **Key sections**: {sections most relevant to our work}
```

### Customer Profile

```markdown
# Customer Profile

## Primary Segment: {Name}
- **Who**: {description}
- **Pain points**: {what they struggle with}
- **What they value**: {buying criteria}
- **Typical workflow**: {how they use our product}

## Secondary Segment: {Name}
...
```

---

## Workspace Layer Templates

### PRD / Feature Request

```markdown
# {Feature Name}

**Status**: Draft / In Review / Approved / In Development / Shipped
**Owner**: {name}
**Updated**: {date}

## Background
{Why we're building this — the problem or opportunity}

## Goal
{What success looks like — measurable if possible}

## Scope
{What's included and what's explicitly excluded}

## Design
{How it works — flows, rules, data}

## Open Questions
{Unresolved decisions}
```

### Meeting Notes

```markdown
# {Meeting Topic}

**Date**: {YYYY-MM-DD}
**Attendees**: {names}

## Key Discussions
- {topic 1}: {what was discussed, decisions made}
- {topic 2}: ...

## Action Items
- [ ] {action} — {owner} — {deadline}

## Context for AI
{Any background that wasn't explicitly stated in the meeting but is needed to understand the notes}
```

### Bug / Issue Report

```markdown
# {Issue Title}

**Priority**: P0 / P1 / P2 / P3
**Status**: Open / Investigating / Fixed
**Reported**: {date}

## Description
{What happened — steps to reproduce if applicable}

## Expected Behavior
{What should have happened}

## Root Cause
{If known}

## Resolution
{How it was fixed — fill in when resolved}
```

### Discussion / Decision Record

```markdown
# {Decision Topic}

**Date**: {YYYY-MM-DD}
**Status**: Proposed / Decided / Superseded
**Decision**: {one-line summary of what was decided}

## Context
{Why this decision came up}

## Options Considered
1. **{Option A}**: {pros and cons}
2. **{Option B}**: {pros and cons}

## Decision & Rationale
{What was chosen and why}

## Consequences
{What changes as a result of this decision}
```

---

## Drafts Layer Templates

Drafts should be lightweight. Don't over-structure them — the whole point is low friction.

### Quick Note

```markdown
# {Topic}

**Date**: {YYYY-MM-DD}

{Just write it down. No structure needed. Get the thought out of your head and into the repo.}
```

### Exploration / Research

```markdown
# {Topic} — Exploration

**Date**: {YYYY-MM-DD}
**Status**: Exploring / Concluded / Abandoned

## Question
{What are we trying to figure out?}

## Findings
{What we've learned so far}

## Next Steps
{What to do with this — promote to workspace? Need more research? Drop it?}
```

---

## Index File Templates

### Root CLAUDE.md

```markdown
# {Repo Name} — Context Repository

{One sentence describing what this repo is for.}

## Structure

| Directory | What's Here |
|-----------|-------------|
| `context/` | Confirmed knowledge — product, business, industry facts |
| `workspace/` | Active work — current projects and tasks |
| `drafts/` | Raw material — ideas, notes, explorations |

## Rules

- Documents flow: `drafts/` → `workspace/` → `context/`
- `context/` = truth (what IS), `workspace/` = plans (what we're DOING), `drafts/` = ideas (what we're THINKING)
- Every directory has a CLAUDE.md index — update it when adding/removing files

## File Summaries

### context/
- **product-overview.md** — {summary}
- **terminology.md** — {summary}

### workspace/
- **{file}.md** — {summary}

### drafts/
{empty or list files}
```

### Directory CLAUDE.md

```markdown
# {Directory Name}

## Purpose
{One sentence — what this directory contains and why}

## Files
- **{filename}.md** — {one-line summary}

## Rules
{Any directory-specific conventions, if applicable}
```
