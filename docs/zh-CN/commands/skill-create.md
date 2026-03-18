---
name: skill-create
description: Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Å“Â¬Ã¥Å“Â°GitÃ¥Å½â€ Ã¥ÂÂ²Ã¤Â»Â¥Ã¦ÂÂÃ¥Ââ€“Ã§Â¼â€“Ã§Â ÂÃ¦Â¨Â¡Ã¥Â¼ÂÃ¥Â¹Â¶Ã§â€Å¸Ã¦Ë†ÂSKILL.mdÃ¦â€“â€¡Ã¤Â»Â¶Ã£â‚¬â€šSkill Creator GitHubÃ¥Âºâ€Ã§â€Â¨Ã§Å¡â€žÃ¦Å“Â¬Ã¥Å“Â°Ã§â€°Ë†Ã¦Å“Â¬Ã£â‚¬â€š
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /skill-create - Ã¦Å“Â¬Ã¥Å“Â°Ã¦Å â‚¬Ã¨Æ’Â½Ã§â€Å¸Ã¦Ë†Â

Ã¥Ë†â€ Ã¦Å¾ÂÃ¤Â½Â Ã§Å¡â€žÃ¤Â»â€œÃ¥Âºâ€œÃ§Å¡â€ž git Ã¥Å½â€ Ã¥ÂÂ²Ã¯Â¼Å’Ã¤Â»Â¥Ã¦ÂÂÃ¥Ââ€“Ã§Â¼â€“Ã§Â ÂÃ¦Â¨Â¡Ã¥Â¼ÂÃ¥Â¹Â¶Ã§â€Å¸Ã¦Ë†Â SKILL.md Ã¦â€“â€¡Ã¤Â»Â¶Ã¯Â¼Å’Ã§â€Â¨Ã¤ÂºÅ½Ã¥Ââ€˜ Claude Ã¤Â¼Â Ã¦Å½Ë†Ã¤Â½Â Ã¥â€ºÂ¢Ã©ËœÅ¸Ã§Å¡â€žÃ¥Â®Å¾Ã¨Â·ÂµÃ¦â€“Â¹Ã¦Â³â€¢Ã£â‚¬â€š

## Ã¤Â½Â¿Ã§â€Â¨Ã¦â€“Â¹Ã¦Â³â€¢

```bash
/skill-create                    # Analyze current repo
/skill-create --commits 100      # Analyze last 100 commits
/skill-create --output ./skills  # Custom output directory
/skill-create --instincts        # Also generate instincts for continuous-learning-v2
```

## Ã¥Å Å¸Ã¨Æ’Â½Ã¨Â¯Â´Ã¦ËœÅ½

1. **Ã¨Â§Â£Ã¦Å¾Â Git Ã¥Å½â€ Ã¥ÂÂ²** - Ã¥Ë†â€ Ã¦Å¾ÂÃ¦ÂÂÃ¤ÂºÂ¤Ã¨Â®Â°Ã¥Â½â€¢Ã£â‚¬ÂÃ¦â€“â€¡Ã¤Â»Â¶Ã¦â€ºÂ´Ã¦â€Â¹Ã¥â€™Å’Ã¦Â¨Â¡Ã¥Â¼Â
2. **Ã¦Â£â‚¬Ã¦Âµâ€¹Ã¦Â¨Â¡Ã¥Â¼Â** - Ã¨Â¯â€ Ã¥Ë†Â«Ã©â€¡ÂÃ¥Â¤ÂÃ¥â€¡ÂºÃ§Å½Â°Ã§Å¡â€žÃ¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ§Â¨â€¹Ã¥â€™Å’Ã§ÂºÂ¦Ã¥Â®Å¡
3. **Ã§â€Å¸Ã¦Ë†Â SKILL.md** - Ã¥Ë†â€ºÃ¥Â»ÂºÃ¦Å“â€°Ã¦â€¢Ë†Ã§Å¡â€ž Claude Code Ã¦Å â‚¬Ã¨Æ’Â½Ã¦â€“â€¡Ã¤Â»Â¶
4. **Ã¥ÂÂ¯Ã©â‚¬â€°Ã¥Ë†â€ºÃ¥Â»Âº Instincts** - Ã§â€Â¨Ã¤ÂºÅ½ continuous-learning-v2 Ã§Â³Â»Ã§Â»Å¸

## Ã¥Ë†â€ Ã¦Å¾ÂÃ¦Â­Â¥Ã©ÂªÂ¤

### Ã¦Â­Â¥Ã©ÂªÂ¤ 1Ã¯Â¼Å¡Ã¦â€Â¶Ã©â€ºâ€  Git Ã¦â€¢Â°Ã¦ÂÂ®

```bash
# Get recent commits with file changes
git log --oneline -n ${COMMITS:-200} --name-only --pretty=format:"%H|%s|%ad" --date=short

# Get commit frequency by file
git log --oneline -n 200 --name-only | grep -v "^$" | grep -v "^[a-f0-9]" | sort | uniq -c | sort -rn | head -20

# Get commit message patterns
git log --oneline -n 200 | cut -d' ' -f2- | head -50
```

### Ã¦Â­Â¥Ã©ÂªÂ¤ 2Ã¯Â¼Å¡Ã¦Â£â‚¬Ã¦Âµâ€¹Ã¦Â¨Â¡Ã¥Â¼Â

Ã¥Â¯Â»Ã¦â€°Â¾Ã¤Â»Â¥Ã¤Â¸â€¹Ã¦Â¨Â¡Ã¥Â¼ÂÃ§Â±Â»Ã¥Å¾â€¹Ã¯Â¼Å¡

| Ã¦Â¨Â¡Ã¥Â¼Â | Ã¦Â£â‚¬Ã¦Âµâ€¹Ã¦â€“Â¹Ã¦Â³â€¢ |
|---------|-----------------|
| **Ã¦ÂÂÃ¤ÂºÂ¤Ã§ÂºÂ¦Ã¥Â®Å¡** | Ã¥Â¯Â¹Ã¦ÂÂÃ¤ÂºÂ¤Ã¦Â¶Ë†Ã¦ÂÂ¯Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Â­Â£Ã¥Ë†â„¢Ã¥Å’Â¹Ã©â€¦Â (feat:, fix:, chore:) |
| **Ã¦â€“â€¡Ã¤Â»Â¶Ã¥ÂÂÃ¥ÂÅ’Ã¦â€ºÂ´Ã¦â€Â¹** | Ã¦â‚¬Â»Ã¦ËœÂ¯Ã¥ÂÅ’Ã¦â€”Â¶Ã¦â€ºÂ´Ã¦â€Â¹Ã§Å¡â€žÃ¦â€“â€¡Ã¤Â»Â¶ |
| **Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ¥ÂºÂÃ¥Ë†â€”** | Ã©â€¡ÂÃ¥Â¤ÂÃ§Å¡â€žÃ¦â€“â€¡Ã¤Â»Â¶Ã¦â€ºÂ´Ã¦â€Â¹Ã¦Â¨Â¡Ã¥Â¼Â |
| **Ã¦Å¾Â¶Ã¦Å¾â€ž** | Ã¦â€“â€¡Ã¤Â»Â¶Ã¥Â¤Â¹Ã§Â»â€œÃ¦Å¾â€žÃ¥â€™Å’Ã¥â€˜Â½Ã¥ÂÂÃ§ÂºÂ¦Ã¥Â®Å¡ |
| **Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼Â** | Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€“â€¡Ã¤Â»Â¶Ã¤Â½ÂÃ§Â½Â®Ã£â‚¬ÂÃ¥â€˜Â½Ã¥ÂÂÃ£â‚¬ÂÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡ |

### Ã¦Â­Â¥Ã©ÂªÂ¤ 3Ã¯Â¼Å¡Ã§â€Å¸Ã¦Ë†Â SKILL.md

Ã¨Â¾â€œÃ¥â€¡ÂºÃ¦Â Â¼Ã¥Â¼ÂÃ¯Â¼Å¡

```markdown
---
name: {repo-name}-patterns
description: Ã¤Â»Å½ {repo-name} Ã¦ÂÂÃ¥Ââ€“Ã§Å¡â€žÃ§Â¼â€“Ã§Â ÂÃ¦Â¨Â¡Ã¥Â¼Â
version: 1.0.0
source: local-git-analysis
analyzed_commits: {count}
---

# {Repo Name} Ã¦Â¨Â¡Ã¥Â¼Â

## Ã¦ÂÂÃ¤ÂºÂ¤Ã¨Â§â€žÃ¨Å’Æ’
{detected commit message patterns}

## Ã¤Â»Â£Ã§Â ÂÃ¦Å¾Â¶Ã¦Å¾â€ž
{detected folder structure and organization}

## Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂ
{detected repeating file change patterns}

## Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼Â
{detected test conventions}

```

### Ã¦Â­Â¥Ã©ÂªÂ¤ 4Ã¯Â¼Å¡Ã§â€Å¸Ã¦Ë†Â InstinctsÃ¯Â¼Ë†Ã¥Â¦â€šÃ¦Å¾Å“Ã¤Â½Â¿Ã§â€Â¨ --instinctsÃ¯Â¼â€°

Ã§â€Â¨Ã¤ÂºÅ½ continuous-learning-v2 Ã©â€ºâ€ Ã¦Ë†ÂÃ¯Â¼Å¡

```yaml
---
id: {repo}-commit-convention
trigger: "when writing a commit message"
confidence: 0.8
domain: git
source: local-repo-analysis
---

# Use Conventional Commits

## Action
Prefix commits with: feat:, fix:, chore:, docs:, test:, refactor:

## Evidence
- Analyzed {n} commits
- {percentage}% follow conventional commit format
```

## Ã§Â¤ÂºÃ¤Â¾â€¹Ã¨Â¾â€œÃ¥â€¡Âº

Ã¥Å“Â¨ TypeScript Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Å Ã¨Â¿ÂÃ¨Â¡Å’ `/skill-create` Ã¥ÂÂ¯Ã¨Æ’Â½Ã¤Â¼Å¡Ã¤ÂºÂ§Ã§â€Å¸Ã¯Â¼Å¡

```markdown
---
name: my-app-patterns
description: Coding patterns from my-app repository
version: 1.0.0
source: local-git-analysis
analyzed_commits: 150
---

# My App Ã¦Â¨Â¡Ã¥Â¼Â

## Ã¦ÂÂÃ¤ÂºÂ¤Ã§ÂºÂ¦Ã¥Â®Å¡

Ã¨Â¯Â¥Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â½Â¿Ã§â€Â¨ **Ã§ÂºÂ¦Ã¥Â®Å¡Ã¥Â¼ÂÃ¦ÂÂÃ¤ÂºÂ¤**Ã¯Â¼Å¡
- `feat:` - Ã¦â€“Â°Ã¥Å Å¸Ã¨Æ’Â½
- `fix:` - Ã©â€â„¢Ã¨Â¯Â¯Ã¤Â¿Â®Ã¥Â¤Â
- `chore:` - Ã§Â»Â´Ã¦Å Â¤Ã¤Â»Â»Ã¥Å Â¡
- `docs:` - Ã¦â€“â€¡Ã¦Â¡Â£Ã¦â€ºÂ´Ã¦â€“Â°

## Ã¤Â»Â£Ã§Â ÂÃ¦Å¾Â¶Ã¦Å¾â€ž

```

src/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ components/     # React Ã§Â»â€žÃ¤Â»Â¶ (PascalCase.tsx)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ hooks/          # Ã¨â€¡ÂªÃ¥Â®Å¡Ã¤Â¹â€°Ã©â€™Â©Ã¥Â­Â (use\*.ts)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ utils/          # Ã¥Â·Â¥Ã¥â€¦Â·Ã¥â€¡Â½Ã¦â€¢Â°
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ types/          # TypeScript Ã§Â±Â»Ã¥Å¾â€¹Ã¥Â®Å¡Ã¤Â¹â€°
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ services/       # API Ã¥â€™Å’Ã¥Â¤â€“Ã©Æ’Â¨Ã¦Å“ÂÃ¥Å Â¡

```

## Workflows

### Adding a New Component
1. Create `src/components/ComponentName.tsx`
2. Add tests in `src/components/__tests__/ComponentName.test.tsx`
3. Export from `src/components/index.ts`

### Database Migration
1. Modify `src/db/schema.ts`
2. Run `pnpm db:generate`
3. Run `pnpm db:migrate`

## Testing Patterns

- Test files: `__tests__/` directories or `.test.ts` suffix
- Coverage target: 80%+
- Framework: Vitest
```

## GitHub Ã¥Âºâ€Ã§â€Â¨Ã©â€ºâ€ Ã¦Ë†Â

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã©Â«ËœÃ§ÂºÂ§Ã¥Å Å¸Ã¨Æ’Â½Ã¯Â¼Ë†10k+ Ã¦ÂÂÃ¤ÂºÂ¤Ã£â‚¬ÂÃ¥â€ºÂ¢Ã©ËœÅ¸Ã¥â€¦Â±Ã¤ÂºÂ«Ã£â‚¬ÂÃ¨â€¡ÂªÃ¥Å Â¨ PRÃ¯Â¼â€°Ã¯Â¼Å’Ã¨Â¯Â·Ã¤Â½Â¿Ã§â€Â¨ [Skill Creator GitHub Ã¥Âºâ€Ã§â€Â¨](https://github.com/apps/skill-creator)Ã¯Â¼Å¡

* Ã¥Â®â€°Ã¨Â£â€¦: [github.com/apps/skill-creator](https://github.com/apps/skill-creator)
* Ã¥Å“Â¨Ã¤Â»Â»Ã¤Â½â€¢Ã¨Â®Â®Ã©Â¢ËœÃ¤Â¸Å Ã¨Â¯â€žÃ¨Â®Âº `/skill-creator analyze`
* Ã¦Å½Â¥Ã¦â€Â¶Ã¥Å’â€¦Ã¥ÂÂ«Ã§â€Å¸Ã¦Ë†ÂÃ¦Å â‚¬Ã¨Æ’Â½Ã§Å¡â€ž PR

## Ã§â€ºÂ¸Ã¥â€¦Â³Ã¥â€˜Â½Ã¤Â»Â¤

* `/instinct-import` - Ã¥Â¯Â¼Ã¥â€¦Â¥Ã§â€Å¸Ã¦Ë†ÂÃ§Å¡â€ž instincts
* `/instinct-status` - Ã¦Å¸Â¥Ã§Å“â€¹Ã¥Â·Â²Ã¥Â­Â¦Ã¤Â¹Â Ã§Å¡â€ž instincts
* `/evolve` - Ã¥Â°â€  instincts Ã¨ÂÅ¡Ã§Â±Â»Ã¤Â¸ÂºÃ¦Å â‚¬Ã¨Æ’Â½/Ã¤Â»Â£Ã§Ââ€ 

***

*Ã¥Â±Å¾Ã¤ÂºÅ½ [Claude Fulcrum](https://github.com/ORION2809/claude-Fulcrum)*
