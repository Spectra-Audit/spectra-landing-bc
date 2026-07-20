/**
 * Narrows a next-intl `messages` object down to a fixed set of top-level
 * namespaces.
 *
 * Why this exists: `NextIntlClientProvider` serializes whatever `messages`
 * object it's given into the RSC payload and ships it to every client
 * descendant. The root layout previously passed the FULL per-locale message
 * bundle (30-76 KB of JSON) to the provider even though only a handful of
 * global client islands (Navbar, cookie-consent banner) actually read
 * translations on the client — everything else was converted to Server
 * Components and reads translations via `getTranslations` instead.
 *
 * `pickMessages` keeps only the namespaces a provider's client subtree
 * actually needs, so the rest of the locale JSON never leaves the server.
 *
 * No dependency added — this is a 6-line stand-in for `lodash.pick` scoped
 * to the one level of nesting `NextIntlClientProvider` cares about
 * (top-level namespace keys).
 */
export function pickMessages<
  T extends Record<string, unknown>,
  K extends keyof T
>(messages: T, namespaces: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const namespace of namespaces) {
    if (messages[namespace] !== undefined) {
      result[namespace] = messages[namespace]
    }
  }
  return result
}
