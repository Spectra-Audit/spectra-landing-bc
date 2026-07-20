import '@/globals.css'
import { inter, jetbrainsMono } from '@/lib/fonts'
import SiteHeadMeta from '@/components/SiteHeadMeta'
import ThemeInitScript from '@/components/ThemeInitScript'

// Root layout for the handful of routes that sit OUTSIDE the `[locale]`
// segment: `/` (redirects to the default locale), and the unlinked utility
// routes `/not-found` and `/error`. None of these render localized content,
// so this layout has no reason to resolve a request-scoped locale — it's
// fully static, which keeps it (and by extension every route under it) out
// of dynamic rendering.
//
// This works alongside `app/[locale]/layout.tsx` via Next.js's "multiple
// root layouts" pattern (this route group + the `[locale]` segment are each
// their own root): https://nextjs.org/docs/app/api-reference/file-conventions/layout#multiple-root-layouts
// There is intentionally no shared `app/layout.tsx` above both.
export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <SiteHeadMeta />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased transition-colors duration-300 bg-white dark:bg-ink-950 text-neutral-900 dark:text-white`} suppressHydrationWarning>
        <ThemeInitScript />
        {children}
      </body>
    </html>
  )
}
