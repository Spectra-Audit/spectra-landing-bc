import { pickMessages } from '@/lib/pick-messages'

describe('pickMessages', () => {
  const fullMessages = {
    hero: { title: 'Hero Title', subtitle: 'Hero Subtitle' },
    nav: { home: 'Home', about: 'About' },
    footer: { copyright: 'Copyright 2024' },
    auth: { login: 'Login', logout: 'Logout' },
  }

  describe('Happy path', () => {
    it('should pick a single namespace', () => {
      const result = pickMessages(fullMessages, ['hero'] as const)
      expect(result).toEqual({ hero: fullMessages.hero })
      expect(result).not.toHaveProperty('nav')
      expect(result).not.toHaveProperty('footer')
    })

    it('should pick multiple namespaces', () => {
      const result = pickMessages(fullMessages, ['hero', 'nav', 'auth'] as const)
      expect(result).toEqual({
        hero: fullMessages.hero,
        nav: fullMessages.nav,
        auth: fullMessages.auth,
      })
      expect(result).not.toHaveProperty('footer')
    })

    it('should return all namespaces when requested', () => {
      const result = pickMessages(fullMessages, ['hero', 'nav', 'footer', 'auth'] as const)
      expect(result).toEqual(fullMessages)
    })

    it('should preserve object structure and values', () => {
      const result = pickMessages(fullMessages, ['hero'] as const)
      expect(result.hero.title).toBe('Hero Title')
      expect(result.hero.subtitle).toBe('Hero Subtitle')
    })
  })

  describe('Edge cases', () => {
    it('should return empty object when given empty namespaces array', () => {
      const result = pickMessages(fullMessages, [] as const)
      expect(result).toEqual({})
    })

    it('should gracefully handle undefined namespaces by skipping them', () => {
      const messages = { hero: { title: 'Title' }, nav: undefined }
      const result = pickMessages(messages, ['hero', 'nav'] as const)
      // nav is undefined, so it should be skipped
      expect(result).toEqual({ hero: { title: 'Title' } })
      expect(result).not.toHaveProperty('nav')
    })

    it('should handle messages with nested objects', () => {
      const result = pickMessages(fullMessages, ['hero'] as const)
      expect(typeof result.hero).toBe('object')
      expect(Array.isArray(result.hero)).toBe(false)
    })

    it('should not modify the original messages object', () => {
      const original = JSON.parse(JSON.stringify(fullMessages))
      pickMessages(fullMessages, ['hero'] as const)
      expect(fullMessages).toEqual(original)
    })
  })

  describe('Type safety', () => {
    it('should preserve type of picked namespaces', () => {
      const result = pickMessages(fullMessages, ['hero', 'nav'] as const)
      // TypeScript ensures only picked namespaces are in the result
      expect('hero' in result).toBe(true)
      expect('nav' in result).toBe(true)
      // These would fail TypeScript type checking if uncommented:
      // result.footer  // TS error
      // result.auth    // TS error
    })
  })

  describe('Security: preventing unwanted leakage', () => {
    it('should not include unspecified namespaces (preventing message bloat)', () => {
      // Simulating the use case where a provider should only get specific namespaces
      const result = pickMessages(fullMessages, ['nav'] as const)
      const resultKeys = Object.keys(result)
      expect(resultKeys).toEqual(['nav'])
      // Ensures no sensitive namespaces leak through
      expect(resultKeys).not.toContain('auth')
      expect(resultKeys).not.toContain('hero')
    })

    it('should handle malicious property access gracefully', () => {
      // Attempting to access a non-existent namespace should not throw
      const result = pickMessages(fullMessages, ['hero'] as const)
      expect(() => {
        // @ts-ignore - intentionally testing runtime behavior
        result.nonexistent
      }).not.toThrow()
    })
  })
})
