---
name: context-engineer
description: Build and maintain a structured Context repository that turns fragmented business knowledge into reusable, AI-readable context. Use this skill whenever the user is trying to capture, structure, organize, route, maintain, review, or improve knowledge about their product, business, team, decisions, or ongoing work, especially when the goal is to make that knowledge persistent, navigable, and more useful to AI over time.
---

# Context Engineer

A skill for building and maintaining structured Context repositories — the knowledge infrastructure that transforms AI from a generic assistant into a domain expert for your specific business.

## Why This Skill Exists

There's a formula: **Instruction + Context = Input → Output**. Instructions are cheap and disposable. Context is the reusable asset that determines output quality. This skill treats Context as an engineering object — with structure, versioning, quality standards, and lifecycle management — so you can stop manually copy-pasting background info and start letting AI load it automatically.

## Core Concepts

### Three-Layer Architecture

Every Context repo has three layers, representing the lifecycle of knowledge:

```
context/     → What's confirmed (shipped features, company facts, industry standards)
workspace/   → What's in progress (PRDs, active bugs, ongoing discussions)
drafts/      → What's still forming (ideas, explorations, raw meeting notes)
```

Knowledge flows upward: `drafts/ → workspace/ → context/`. A rough idea starts as a draft. When it becomes a real project, it moves to workspace. When the project ships and becomes fact, it settles into context.

### Index Files

Each directory has an index file that serves as the "nervous system" — AI navigates your repo through these indexes. Without them, AI can't find what it needs, and output quality drops.

- **For Claude Code**: `CLAUDE.md` in each directory
- **For Cursor**: `.cursorrules` at root + `CLAUDE.md` in subdirectories
- **For other tools**: see `references/tool-compat.md`

### Content Temperature

Not all context is equal. Prioritize by stability and reuse frequency:

| Temperature | What | Examples | Write First? |
|---|---|---|---|
| Cold | Rarely changes, universally referenced | Company background, product positioning, terminology, team roles | Yes — highest ROI |
| Warm | Updates weekly/monthly | Feature designs, competitor analysis, customer profiles | Second |
| Hot | Changes daily | PRDs, meeting notes, bug reports | Third — but accumulates fast |

---

## Five Capabilities

This skill operates in five modes. Detect which one the user needs based on their input.

### 1. Bootstrap (Cold Start → Working Repo)

**Trigger signals**: "set up a context repo", "start from scratch", "initialize knowledge base", "I just read the article and want to try", first-time setup

**What it does**: Interview the user → generate a populated repo with seed content + indexes.

Read `references/bootstrap-guide.md` for the full interview flow and scaffolding logic. The key principle: **don't generate empty folders**. Every directory should have at least one seed document with real content extracted from the interview. An empty structure is useless — the user needs to see what "good" looks like.

Bootstrap sequence:
1. Detect the user's tool environment (Claude Code / Cursor / other)
2. Ask 5-8 questions to extract business context (see bootstrap guide)
3. Generate the three-layer directory structure
4. Create seed documents from interview answers (cold content first)
5. Generate all index files appropriate for the detected tool
6. Explain what was created and what to fill in next

### 2. Ingest (Raw Material → Structured Knowledge)

**Trigger signals**: "record this", "save this", "file this", "add to context", user pastes raw text, meeting notes, copy-pasted docs, or says something that clearly should be captured

**What it does**: Take raw input → determine content type → structure into markdown → place in the correct directory → update indexes.

Decision flow:
```
User input
  ↓
Step 1: Content classification — what type of information is this?
  ↓
Step 2: Directory routing — where does it belong?
  ↓
Step 3: File decision — new file or append to existing?
  ↓
Step 4: Format & write — structure the content using appropriate template
  ↓
Step 5: Index update — update the directory's index file
  ↓
Step 6: Confirm — tell the user what was done
```

#### Classification rules

| Signal | Content Type | Target |
|---|---|---|
| "idea", "maybe we should", "what if" | Exploration | `drafts/` |
| "meeting notes", "we discussed", "decided" | Meeting record | `workspace/` |
| "requirement", "we need to build", "feature request" | Requirement | `workspace/` |
| "this is how it works", "our product does X", "the standard says" | Confirmed fact | `context/` |
| "competitor X does Y", "market data" | Reference material | `context/` |
| Ambiguous / unclear | Default to drafts | `drafts/` |

**Core principle: when in doubt, put it in drafts.** It's always safe to promote later; putting unverified info directly into context pollutes the knowledge base.

#### File & naming conventions

Read `references/templates.md` for document templates per content type. Use the templates as starting points, not rigid constraints — adapt to the user's content.

Naming: `{date}-{topic}.md` for temporal content (meetings, notes), `{topic}.md` for persistent content (product architecture, terminology).

### 3. Maintain (Keep Indexes Fresh)

**Trigger signals**: "maintain", "refresh index", "sync", "update CLAUDE.md", "clean up", or automatically suggest after creating/deleting files

**What it does**: Scan the repo structure and fix index-file drift.

Checks to perform:
1. **Index sync**: For each directory with an index file, verify every listed file exists and every existing file is listed. Add missing entries (read first few lines for a one-line summary), remove stale entries.
2. **Orphan detection**: Find files not referenced by any index. Add them.
3. **Dead links**: Check relative links in index files. Fix or flag broken ones.
4. **Empty directories**: Flag directories with no content files.

**Auto-fix what's safe** (missing index entries, dead links with obvious fixes). **Flag what needs judgment** (files in wrong directories, empty directories). Never delete user files without confirmation.

### 4. Evolve (Drive the Knowledge Flywheel)

**Trigger signals**: "what should I promote", "review lifecycle", "what's stale", "evolve", "flywheel check"

**What it does**: Scan the repo and suggest lifecycle transitions.

```
drafts/ → workspace/     "This draft has grown into a real plan. Ready to formalize?"
workspace/ → context/    "This PRD's feature shipped 2 weeks ago. Time to distill into context?"
context/ → archive       "This context doc hasn't been referenced in 90 days. Still relevant?"
```

Checks:
- **Drafts aging**: Files in `drafts/` older than 7 days → suggest: promote to workspace, or delete?
- **Shipped work**: Files in `workspace/` marked as completed/shipped → suggest: distill into context?
- **Stale context**: Files in `context/` not modified in 90+ days → flag for review (may be fine — cold content is supposed to be stable)
- **Missing areas**: Compare existing context directories against common categories (see bootstrap guide) → suggest gaps

Present findings as a checklist the user can act on, not as automatic changes.

### 5. Diagnose (Health Check)

**Trigger signals**: "health check", "diagnose", "how's my repo", "what's missing", "coverage report"

**What it does**: Evaluate the repo's overall context coverage and quality.

Assessment dimensions:

| Dimension | What to check |
|---|---|
| **Coverage** | Which knowledge areas exist vs. which are empty? |
| **Freshness** | When was each area last updated? |
| **Depth** | Is each area a one-liner or properly detailed? |
| **Index health** | Are indexes in sync with actual files? |
| **Lifecycle flow** | Are documents flowing through the pipeline, or stuck? |

Output a concise report:
```
Context Health Report
=====================
Coverage:  7/10 areas populated
Freshness: 3 docs haven't been updated in 60+ days
Depth:     2 areas are shallow (< 50 words)
Indexes:   All synced
Lifecycle: 4 drafts ready to promote, 2 workspace items ready to archive

Recommendations (priority order):
1. [highest ROI action]
2. ...
```

---

## Cross-Tool Compatibility

This skill works across AI coding tools. The main difference is how index files are named and structured. Read `references/tool-compat.md` for the full compatibility matrix. The short version:

| Tool | Root Index | Directory Indexes | Config File |
|---|---|---|---|
| Claude Code | `CLAUDE.md` | `CLAUDE.md` in each dir | `.claude/settings.json` |
| Cursor | `.cursorrules` | `CLAUDE.md` (readable by Cursor too) | `.cursor/rules` |
| Windsurf | `.windsurfrules` | `CLAUDE.md` | — |
| Generic / OpenClaw | `CLAUDE.md` | `CLAUDE.md` | — |

When bootstrapping, detect the user's environment and generate the appropriate files. When in doubt, generate `CLAUDE.md` files — they're the most portable format.

---

## Principles

1. **Content over structure.** An ugly repo with rich content beats a beautiful empty skeleton. Always push for real content, not just folders.

2. **Cold first.** When bootstrapping, start with stable, high-reuse content (company background, product positioning, terminology). This gives the highest immediate ROI.

3. **When in doubt, drafts.** Misclassification into `context/` is worse than being too conservative. Drafts are the safe default.

4. **Indexes are the nervous system.** Every file operation must be followed by an index update. An unindexed file is invisible to AI.

5. **Don't over-structure.** Three layers is enough to start. Sub-directories emerge naturally as content grows. Don't create `context/01_xxx/01_yyy/01_zzz/` for a repo with 5 documents.

6. **The user's brain is the source.** During bootstrap and ingest, your job is to extract and structure what the user already knows — not to generate generic content. Ask questions, reflect back, write down their answers in structured form.

7. **Match the language of the knowledge system.** Write context in the user's working language by default. If the repo already has a dominant language, follow that language for new files and updates so the knowledge base stays internally consistent. Only preserve mixed or original-language content when the source material itself requires it or the user explicitly asks for it.

---

## Reference Files

- `references/bootstrap-guide.md` — Full interview flow, directory scaffolding logic, seed content generation
- `references/templates.md` — Document templates for each content type (meeting notes, PRDs, product architecture, terminology, etc.)
- `references/tool-compat.md` — Cross-tool compatibility details and index file formats
