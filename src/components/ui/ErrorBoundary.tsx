'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Generate error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Log error to monitoring service
    console.error('Error Boundary Caught:', error, { errorId })

    return {
      hasError: true,
      error,
      errorId
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', { error, errorInfo, errorId: this.state.errorId })

    // In production, send to error tracking service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: { error_id: this.state.errorId }
      })
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h2>

            <p className="text-neutral-300 mb-6 leading-relaxed">
              We encountered an unexpected error. This has been logged and our team will investigate.
              {this.state.errorId && (
                <span className="block mt-2 text-sm text-neutral-400">
                  Error ID: {this.state.errorId}
                </span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                size="md"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>

              <Button
                onClick={this.handleReload}
                variant="outline"
                size="md"
              >
                Reload Page
              </Button>
            </div>

            <div className="mt-8 p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
              <p className="text-sm text-neutral-400">
                If this problem persists, please contact our security team at
                <a href="mailto:security@spectra.ai" className="text-primary-400 hover:text-primary-300 ml-1">
                  security@spectra.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}