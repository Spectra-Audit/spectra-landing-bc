# Contributing to the Spectra Landing Page

Thanks for your interest in improving the Spectra landing page. This repository is the **public marketing website** for the Spectra blockchain security audit platform (a Next.js app). Contributions of all sizes are welcome — fixing a typo, improving a translation, tightening accessibility, or adding a section.

This guide covers how to set up the project, the conventions we follow, and the checks your change must pass before it can be merged.

## Code of conduct

Be respectful, assume good intent, and keep discussion focused on the work. Harassment or dismissive behavior toward other contributors is not welcome. Maintainers may remove comments, commits, or contributions that do not meet this bar.

## Getting set up

**Prerequisites:** Node.js 20 and npm.

```bash
# Fork, then clone your fork
git clone https://github.com/<your-username>/spectra-landing-bc.git
cd spectra-landing-bc

# Install dependencies
npm install
# If you hit peer-dependency conflicts, match the deploy environment:
#   npm install --legacy-peer-deps

# Start the dev server (http://localhost:3000)
npm run dev
```

No environment variables are required to run the site locally. See the [README](README.md#environment-variables) for the optional `NEXT_PUBLIC_*` variables.

## Branching and commits

1. Create a topic branch off the latest `main`:

   ```bash
   git checkout main
   git pull
   git checkout -b fix/short-description
   ```

2. We use [Conventional Commits](https://www.conventionalcommits.org/). Prefix each commit with a type so history and changelogs stay readable:

   | Type | Use for |
   |------|---------|
   | `feat` | A new feature or section |
   | `fix` | A bug fix |
   | `docs` | Documentation-only changes |
   | `style` | Formatting that doesn't change behavior |
   | `refactor` | Code change that neither fixes a bug nor adds a feature |
   | `test` | Adding or updating tests |
   | `chore` | Tooling, dependencies, build config |
   | `perf` | Performance improvements |

   Example:

   ```text
   feat(whitepaper): add tokenomics section
   fix(navbar): correct language selector focus order
   docs(readme): clarify locale routing
   ```

   Optionally scope the message with the area you touched, as shown above.

## Required checks before opening a PR

All three of these must pass locally and in CI. Run them before you push:

```bash
npm run lint         # ESLint (eslint-config-next)
npm run type-check   # TypeScript, strict, no emit
npm test             # Jest + Testing Library
```

If you changed anything visual or interactive, also run `npm run build` to confirm the production build succeeds.

## Internationalization rules

This site ships in **16 languages**, so i18n is not optional — it is part of every user-facing change.

- **Never hardcode user-facing strings.** All copy must go through `next-intl` (`useTranslations` / `t('...')`). If you add or change visible text, add or update the corresponding key.
- **Update every locale file.** Translation files live in [`src/i18n/locales/`](src/i18n/locales) — one JSON file per locale. When you add a key, add it to **all 16** files (`en.json` is the canonical source for the key structure). If you cannot provide a real translation for a language, copy the English value as a placeholder rather than leaving the key missing.
- **Respect RTL.** Arabic (`ar`) renders right-to-left. Avoid layout that assumes left-to-right (hardcoded `left`/`right`, directional margins/icons that don't mirror). Prefer logical Tailwind utilities and test your change at `/ar`.
- **Adding a new language?** Follow the steps in the README's [Internationalization](README.md#internationalization) section: register the locale in `src/i18n/config.ts`, add `src/i18n/locales/<locale>.json`, and verify routing.

## Code style and patterns

- **TypeScript, strict mode.** Avoid `any`; unused variables and explicit `any` produce warnings. Type component props with an interface (the established pattern is `ComponentProps`).
- **Tailwind CSS for styling.** Use the project's design tokens and utility classes rather than ad-hoc inline styles. Merge conditional classes with the `cn()` helper in `src/lib/utils.ts`.
- **Component conventions:**
  - UI components live in `src/components/ui/` and are exported from its `index.ts`.
  - Variant-based styling with consistent `className` passthrough.
  - Icons come from `lucide-react`.
  - Keep components accessible: meaningful `aria-*` labels, keyboard-operable controls, and motion that respects `prefers-reduced-motion`.
- **Accessibility and performance** are first-class. Don't regress color contrast, focus order, image optimization, or bundle size.

## Pull request process

1. **Keep PRs small and focused.** One concern per PR is much easier to review and revert.
2. **Write a clear description.** Explain what changed and why. Include before/after screenshots for visual changes (and a screenshot at `/ar` if layout could be affected by RTL).
3. **Link related issues** (for example, `Closes #123`).
4. **Confirm the checks pass** — `lint`, `type-check`, and `test` — and note that you ran them.
5. A maintainer will review. Please be responsive to feedback; small follow-up commits are fine and will be squashed as appropriate.

## Reporting bugs and proposing changes

- For **bugs or feature ideas** about the website, open a GitHub issue with steps to reproduce or a clear description of the proposal.
- For **security vulnerabilities**, do **not** open a public issue — follow the [Security Policy](SECURITY.md).

Thank you for helping make Spectra's front door better.
