'use client'

import { Suspense } from 'react'

interface LazyWrapperProps {
  children?: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export default function LazyWrapper({
  children,
  fallback,
  className
}: LazyWrapperProps) {
  const defaultFallback = (
    <div className={`animate-pulse bg-neutral-800 rounded-lg ${className}`}>
      <div className="h-32 bg-neutral-700 rounded"></div>
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}