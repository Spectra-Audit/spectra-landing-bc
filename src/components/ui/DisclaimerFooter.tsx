import React from 'react'
import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'

export interface DisclaimerFooterProps {
  className?: string
}

/**
 * Persistent disclaimer footer rendered across landing + whitepaper pages.
 *
 * Pulls all copy from the `disclaimer.*` translation namespace so it stays in
 * sync across locales. Uses a muted background, Info icon, bold title, and a
 * 5-bullet list covering: AI-generated findings, fork-based testing, score
 * caveats, "do your own research", and tool-purpose framing.
 *
 * Server Component — this only ever needed `useTranslations` (no hooks, no
 * browser APIs), so it renders on the server via `getTranslations` and never
 * ships to the client bundle. Relies on the ancestor route segment having
 * already called `setRequestLocale` (see app/[locale]/layout.tsx) so this
 * resolves the request-scoped locale statically.
 */
export default async function DisclaimerFooter({ className = '' }: DisclaimerFooterProps) {
  const t = await getTranslations('disclaimer')

  return (
    <section
      aria-label="Disclaimer"
      className={`border-t border-neutral-200 dark:border-white/5 bg-neutral-100/70 dark:bg-ink-900/40 py-10 sm:py-12 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 sm:gap-4 mb-5">
          <div className="flex-shrink-0 mt-0.5">
            <div className="inline-flex p-2 rounded-full bg-spectra-blue-500/15 text-spectra-blue-600 dark:text-spectra-blue-500">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
            {t('title')}
          </h2>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc list-outside ml-5 sm:ml-6">
          <li>{t('aiGenerated')}</li>
          <li>{t('forkTesting')}</li>
          <li>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {t('noGuarantee')}
            </span>
          </li>
          <li>{t('doYourResearch')}</li>
          <li>{t('toolPurpose')}</li>
        </ul>
      </div>
    </section>
  )
}
