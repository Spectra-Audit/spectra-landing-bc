// ESLint 9 flat config.
//
// Replaces the legacy `.eslintrc.json` + the deprecated `next lint` wrapper
// (removed/broken in Next 16). `eslint-config-next@16` ships a flat-native
// config array, so we import its `core-web-vitals` preset directly and spread
// it, then re-apply the custom rule severities that were in `.eslintrc.json`.
//
// Run with `eslint .` (see package.json scripts).

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// FlatCompat is wired up so additional legacy/shareable configs can be pulled
// in via `compat.extends(...)` if ever needed. eslint-config-next@16 is already
// flat-native, so the Next presets are imported directly below rather than
// through FlatCompat (feeding an already-flat array to FlatCompat would
// double-wrap it).
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

// Pull in the flat-native Next.js preset. This bundles core-web-vitals rules,
// the React / React Hooks / jsx-a11y / import plugins, and the
// typescript-eslint parser scoped to `**/*.{ts,tsx}`.
const { default: nextCoreWebVitals } = await import('eslint-config-next/core-web-vitals')

const eslintConfig = [
  // Global ignore patterns (migrated from the implicit defaults + the dirs that
  // were previously skipped). eslint-config-next also ignores `.next/`, `out/`,
  // `build/`, and `next-env.d.ts`; these are repeated here so the ignore set is
  // self-documenting and explicit.
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },

  // Next.js (core-web-vitals) flat preset.
  ...nextCoreWebVitals,

  // Custom rule severities ported verbatim from the old `.eslintrc.json`.
  // Scoped to TS/TSX so the `@typescript-eslint/*` rules resolve against the
  // `@typescript-eslint` plugin the Next preset registers for those files;
  // `react-hooks` is registered for the broader JS/TS glob, so it resolves here
  // too. (A global, file-less block would try to apply these rules to plain
  // JS/MJS files where the TS plugin isn't registered, which ESLint rejects.)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

// `compat` is intentionally exported-as-unused-friendly: referenced here to keep
// the import meaningful and available for future `compat.extends(...)` use.
void compat

export default eslintConfig
