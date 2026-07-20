'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Something went wrong
          </h1>

          <p className="text-neutral-400 mb-8 leading-relaxed">
            We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={reset}
            variant="security"
            size="lg"
            className="w-full"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Go back home
          </Button>
        </div>

        <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
          <p className="text-sm text-neutral-500 mb-2">Error reference:</p>
          <code className="text-xs text-neutral-600 font-mono">
            {error.digest || 'unknown'}
          </code>
        </div>

        <div className="mt-8">
          <p className="text-sm text-neutral-500">
            If this problem persists, please{' '}
            <a
              href="mailto:support@shieldnetwork.io"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}