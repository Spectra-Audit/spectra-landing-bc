import { Inter, JetBrains_Mono } from 'next/font/google'

// Shared next/font instances. `next/font` requires the loader to be invoked
// at module scope in each file that needs the generated CSS — extracting it
// here lets both root layouts (the `(root)` group and the `[locale]` group,
// see the "multiple root layouts" pattern in `src/app`) reuse the exact same
// font objects instead of re-declaring them.
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
