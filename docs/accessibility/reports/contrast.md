# Contrast Audit — WCAG 2.1 AA (token-level)

**Generated:** 2026-05-07T06:15:18.596Z
**Source:** `src/app/globals.css` (`:root` + `.dark`)
**Pairs evaluated:** 25 per theme
**Failures (non-advisory):** 0

| Theme | Pass | Fail | Advisory | Skip |
| ----- | ---- | ---- | -------- | ---- |
| light | 21   | 0    | 4        | 0    |
| dark  | 24   | 0    | 1        | 0    |

## LIGHT theme

| Pair                                            | Kind        | Foreground                         | Background               | Ratio   | Required | Status      |
| ----------------------------------------------- | ----------- | ---------------------------------- | ------------------------ | ------- | -------- | ----------- |
| Body text on background                         | text-normal | `--foreground` (#2d2d2d)           | `--background` (#ffffff) | 13.77:1 | ≥4.5:1   | ✅ pass     |
| Body text on card                               | text-normal | `--foreground` (#2d2d2d)           | `--card` (#ffffff)       | 13.77:1 | ≥4.5:1   | ✅ pass     |
| Body text on muted surface                      | text-normal | `--foreground` (#2d2d2d)           | `--muted` (#f5f5f5)      | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Body text on secondary surface                  | text-normal | `--foreground` (#2d2d2d)           | `--secondary` (#f5f5f5)  | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Body text on popover                            | text-normal | `--foreground` (#2d2d2d)           | `--popover` (#ffffff)    | 13.77:1 | ≥4.5:1   | ✅ pass     |
| Muted text on background                        | text-normal | `--muted-foreground` (#555555)     | `--background` (#ffffff) | 7.46:1  | ≥4.5:1   | ✅ pass     |
| Muted text on card                              | text-normal | `--muted-foreground` (#555555)     | `--card` (#ffffff)       | 7.46:1  | ≥4.5:1   | ✅ pass     |
| Muted text on muted surface                     | text-normal | `--muted-foreground` (#555555)     | `--muted` (#f5f5f5)      | 6.84:1  | ≥4.5:1   | ✅ pass     |
| Primary button text                             | text-normal | `--primary-foreground` (#ffffff)   | `--primary` (#c62828)    | 5.62:1  | ≥4.5:1   | ✅ pass     |
| Secondary button text                           | text-normal | `--secondary-foreground` (#2d2d2d) | `--secondary` (#f5f5f5)  | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Accent surface text                             | text-normal | `--accent-foreground` (#2d2d2d)    | `--accent` (#f5f5f5)     | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Popover text                                    | text-normal | `--popover-foreground` (#2d2d2d)   | `--popover` (#ffffff)    | 13.77:1 | ≥4.5:1   | ✅ pass     |
| Card text                                       | text-normal | `--card-foreground` (#2d2d2d)      | `--card` (#ffffff)       | 13.77:1 | ≥4.5:1   | ✅ pass     |
| Primary brand text on background (heading/link) | text-large  | `--primary` (#c62828)              | `--background` (#ffffff) | 5.62:1  | ≥3:1     | ✅ pass     |
| Primary brand text on card (heading/link)       | text-large  | `--primary` (#c62828)              | `--card` (#ffffff)       | 5.62:1  | ≥3:1     | ✅ pass     |
| Destructive text on background                  | text-normal | `--destructive` (#b71c1c)          | `--background` (#ffffff) | 6.57:1  | ≥4.5:1   | ✅ pass     |
| Focus ring on background                        | graphical   | `--ring` (#c62828)                 | `--background` (#ffffff) | 5.62:1  | ≥3:1     | ✅ pass     |
| Focus ring on card                              | graphical   | `--ring` (#c62828)                 | `--card` (#ffffff)       | 5.62:1  | ≥3:1     | ✅ pass     |
| Focus ring on muted surface                     | graphical   | `--ring` (#c62828)                 | `--muted` (#f5f5f5)      | 5.16:1  | ≥3:1     | ✅ pass     |
| Input border on background                      | graphical   | `--input` (#767676)                | `--background` (#ffffff) | 4.54:1  | ≥3:1     | ✅ pass     |
| Decorative border on background                 | graphical   | `--border` (#e5e5e5)               | `--background` (#ffffff) | 1.26:1  | ≥3:1     | ⚠️ advisory |
| Gold badge text on background                   | text-normal | `--color-gold-badge` (#c9a84c)     | `--background` (#ffffff) | 2.29:1  | ≥4.5:1   | ⚠️ advisory |
| Gold badge text on card                         | text-normal | `--color-gold-badge` (#c9a84c)     | `--card` (#ffffff)       | 2.29:1  | ≥4.5:1   | ⚠️ advisory |
| Steel-chrome on background                      | text-normal | `--color-steel-chrome` (#78909c)   | `--background` (#ffffff) | 3.35:1  | ≥4.5:1   | ⚠️ advisory |
| Steel-chrome as icon/divider on background      | graphical   | `--color-steel-chrome` (#78909c)   | `--background` (#ffffff) | 3.35:1  | ≥3:1     | ✅ pass     |

## DARK theme

| Pair                                            | Kind        | Foreground                         | Background               | Ratio   | Required | Status      |
| ----------------------------------------------- | ----------- | ---------------------------------- | ------------------------ | ------- | -------- | ----------- |
| Body text on background                         | text-normal | `--foreground` (#e0e0e0)           | `--background` (#121212) | 14.19:1 | ≥4.5:1   | ✅ pass     |
| Body text on card                               | text-normal | `--foreground` (#e0e0e0)           | `--card` (#252525)       | 11.61:1 | ≥4.5:1   | ✅ pass     |
| Body text on muted surface                      | text-normal | `--foreground` (#e0e0e0)           | `--muted` (#1e1e1e)      | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Body text on secondary surface                  | text-normal | `--foreground` (#e0e0e0)           | `--secondary` (#1e1e1e)  | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Body text on popover                            | text-normal | `--foreground` (#e0e0e0)           | `--popover` (#1e1e1e)    | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Muted text on background                        | text-normal | `--muted-foreground` (#a0a0a0)     | `--background` (#121212) | 7.16:1  | ≥4.5:1   | ✅ pass     |
| Muted text on card                              | text-normal | `--muted-foreground` (#a0a0a0)     | `--card` (#252525)       | 5.86:1  | ≥4.5:1   | ✅ pass     |
| Muted text on muted surface                     | text-normal | `--muted-foreground` (#a0a0a0)     | `--muted` (#1e1e1e)      | 6.38:1  | ≥4.5:1   | ✅ pass     |
| Primary button text                             | text-normal | `--primary-foreground` (#ffffff)   | `--primary` (#d32f2f)    | 4.98:1  | ≥4.5:1   | ✅ pass     |
| Secondary button text                           | text-normal | `--secondary-foreground` (#e0e0e0) | `--secondary` (#1e1e1e)  | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Accent surface text                             | text-normal | `--accent-foreground` (#e0e0e0)    | `--accent` (#1e1e1e)     | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Popover text                                    | text-normal | `--popover-foreground` (#e0e0e0)   | `--popover` (#1e1e1e)    | 12.63:1 | ≥4.5:1   | ✅ pass     |
| Card text                                       | text-normal | `--card-foreground` (#e0e0e0)      | `--card` (#252525)       | 11.61:1 | ≥4.5:1   | ✅ pass     |
| Primary brand text on background (heading/link) | text-large  | `--primary` (#d32f2f)              | `--background` (#121212) | 3.76:1  | ≥3:1     | ✅ pass     |
| Primary brand text on card (heading/link)       | text-large  | `--primary` (#d32f2f)              | `--card` (#252525)       | 3.08:1  | ≥3:1     | ✅ pass     |
| Destructive text on background                  | text-normal | `--destructive` (#ef5350)          | `--background` (#121212) | 5.37:1  | ≥4.5:1   | ✅ pass     |
| Focus ring on background                        | graphical   | `--ring` (#ef5350)                 | `--background` (#121212) | 5.37:1  | ≥3:1     | ✅ pass     |
| Focus ring on card                              | graphical   | `--ring` (#ef5350)                 | `--card` (#252525)       | 4.40:1  | ≥3:1     | ✅ pass     |
| Focus ring on muted surface                     | graphical   | `--ring` (#ef5350)                 | `--muted` (#1e1e1e)      | 4.78:1  | ≥3:1     | ✅ pass     |
| Input border on background                      | graphical   | `--input` (#8a8a8a)                | `--background` (#121212) | 5.43:1  | ≥3:1     | ✅ pass     |
| Decorative border on background                 | graphical   | `--border` (#333333)               | `--background` (#121212) | 1.48:1  | ≥3:1     | ⚠️ advisory |
| Gold badge text on background                   | text-normal | `--color-gold-badge` (#c9a84c)     | `--background` (#121212) | 8.20:1  | ≥4.5:1   | ✅ pass     |
| Gold badge text on card                         | text-normal | `--color-gold-badge` (#c9a84c)     | `--card` (#252525)       | 6.71:1  | ≥4.5:1   | ✅ pass     |
| Steel-chrome on background                      | text-normal | `--color-steel-chrome` (#78909c)   | `--background` (#121212) | 5.59:1  | ≥4.5:1   | ✅ pass     |
| Steel-chrome as icon/divider on background      | graphical   | `--color-steel-chrome` (#78909c)   | `--background` (#121212) | 5.59:1  | ≥3:1     | ✅ pass     |

## Legend

- **pass** — meets WCAG 2.1 AA threshold for the pair's kind.
- **fail** — below threshold; must be fixed before merge.
- **advisory** — restricted-use token (e.g., gold-badge, steel-chrome). Failure here means the token's usage rule must be enforced at the component level (badge bg dark, etc.); it does not block this audit.
- **skip** — token not defined in this theme, or color expression not yet supported (e.g., `color-mix`).
