# Documentation Index — Prestige Auto Body, Inc.

Project documentation, organized by topic and lifecycle. Active work lives at the top of each folder; completed work moves to [`archive/`](./archive/).

> **First time here?** Read [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) — high-level overview of stack, capabilities, timeline, and where things live.

## Active

| Folder                                 | What's there                                                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`design/`](./design/)                 | Visual design system spec ([DESIGN.md](./design/DESIGN.md)) — tokens, components, breakpoints, light/dark modes.                                            |
| [`accessibility/`](./accessibility/)   | WCAG 2.1 AA spec + implementation plan ([wcag-aa.md](./accessibility/wcag-aa.md)) and generated audit reports under [`reports/`](./accessibility/reports/). |
| [`automation/n8n/`](./automation/n8n/) | n8n blog-content pipeline: [overview](./automation/n8n/README.md) and [AI agent prompt](./automation/n8n/prompt-blog.md).                                   |
| [`plans/`](./plans/)                   | Active RFC-Lite plans not yet completed.                                                                                                                    |

## Reports (generated)

`accessibility/reports/*.md` are produced by `npm run a11y` and `npm run contrast`. The matching `*.json` files are gitignored — run the scripts locally to regenerate.

## Archive

[`archive/`](./archive/) holds completed initiatives, kept in-tree for traceability. Each subfolder is dated by the period the work shipped.

- [`2026-04-audit/`](./archive/2026-04-audit/) — Prestige Auto Body audit + Slice B design upgrade + GA4 analytics rollout.

## Conventions

- One topic per folder. New topics get their own folder.
- Generated artifacts live in a `reports/` subfolder and are kept thin (markdown only; JSON gitignored).
- Completed RFC-Lite plans move to `archive/<yyyy-mm>-<slug>/` once the work ships.
- Cross-document links are relative paths so the index stays portable.
