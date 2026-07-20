// Inline theme-init script to prevent a flash of the wrong theme on first
// paint. Runs synchronously before hydration, so it has to stay a plain
// <script> tag (not a React effect). Shared between both root layouts.
export default function ThemeInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const theme = localStorage.getItem('theme') || 'system';
            if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `
      }}
    />
  )
}
