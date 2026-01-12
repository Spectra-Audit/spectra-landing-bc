'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Search className="w-10 h-10 text-primary-500" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-white mb-4">
            Page not found
          </h2>

          <p className="text-neutral-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to safety.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button
              variant="security"
              size="lg"
              className="w-full"
              icon={<Home className="w-5 h-5" />}
            >
              Back to home
            </Button>
          </Link>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="w-full"
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Go back
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-neutral-500 mb-4">Looking for something specific?</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/#features"
              className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 hover:border-primary-500/50 transition-all hover:bg-neutral-800/70 group"
            >
              <span className="text-sm text-neutral-300 group-hover:text-primary-400 transition-colors">
                Features
              </span>
            </Link>
            <Link
              href="/#security"
              className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 hover:border-primary-500/50 transition-all hover:bg-neutral-800/70 group"
            >
              <span className="text-sm text-neutral-300 group-hover:text-primary-400 transition-colors">
                Security
              </span>
            </Link>
            <Link
              href="/#pricing"
              className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 hover:border-primary-500/50 transition-all hover:bg-neutral-800/70 group"
            >
              <span className="text-sm text-neutral-300 group-hover:text-primary-400 transition-colors">
                Pricing
              </span>
            </Link>
            <Link
              href="/#contact"
              className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 hover:border-primary-500/50 transition-all hover:bg-neutral-800/70 group"
            >
              <span className="text-sm text-neutral-300 group-hover:text-primary-400 transition-colors">
                Contact
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-neutral-500">
            If you believe this is an error, please{' '}
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