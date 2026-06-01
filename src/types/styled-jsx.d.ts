import 'react'

// styled-jsx (bundled with Next.js) adds the `jsx` and `global` boolean
// attributes to <style>. Next does not ship this JSX type augmentation, so
// declare it here to keep `<style jsx>` blocks type-safe under `tsc --noEmit`.
declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
