'use client'

import React, { useState } from 'react'
import { Shield, BarChart3, Lock, TrendingUp, ChevronRight, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Button from './Button'
import Card from './Card'

export type PersonaType = 'passive-saver' | 'power-analyst'

interface Persona {
  id: PersonaType
  name: string
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  ctaText: string
  ctaSubtext: string
}

interface PersonaSelectorProps {
  onPersonaSelect: (persona: PersonaType) => void
  selectedPersona?: PersonaType
}

export default function PersonaSelector({ onPersonaSelect, selectedPersona }: PersonaSelectorProps) {
  const [focusedPersona, setFocusedPersona] = useState<PersonaType | null>(null)
  const t = useTranslations()

  const personas: Persona[] = [
    {
      id: 'passive-saver',
      name: t('persona.passiveSaver.name'),
      title: t('persona.passiveSaver.title'),
      description: t('persona.passiveSaver.description'),
      icon: <Shield className="w-6 h-6" />,
      benefits: [
        t('persona.passiveSaver.benefits.0'),
        t('persona.passiveSaver.benefits.1'),
        t('persona.passiveSaver.benefits.2'),
        t('persona.passiveSaver.benefits.3')
      ],
      ctaText: t('persona.passiveSaver.cta'),
      ctaSubtext: t('persona.passiveSaver.ctaSubtext')
    },
    {
      id: 'power-analyst',
      name: t('persona.powerAnalyst.name'),
      title: t('persona.powerAnalyst.title'),
      description: t('persona.powerAnalyst.description'),
      icon: <BarChart3 className="w-6 h-6" />,
      benefits: [
        t('persona.powerAnalyst.benefits.0'),
        t('persona.powerAnalyst.benefits.1'),
        t('persona.powerAnalyst.benefits.2'),
        t('persona.powerAnalyst.benefits.3')
      ],
      ctaText: t('persona.powerAnalyst.cta'),
      ctaSubtext: t('persona.powerAnalyst.ctaSubtext')
    }
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('persona.title')}
        </h2>
        <p className="text-lg text-neutral-300">
          {t('persona.subtitle')}
        </p>
      </div>

      {/* Persona Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id
          const isFocused = focusedPersona === persona.id

          return (
            <Card
              key={persona.id}
              variant={isSelected ? 'security' : 'glass'}
              hover
              className={`cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-security-green ring-offset-2 ring-offset-neutral-900'
                  : 'hover:border-primary-500/30'
              }`}
              onClick={() => onPersonaSelect(persona.id)}
              onMouseEnter={() => setFocusedPersona(persona.id)}
              onMouseLeave={() => setFocusedPersona(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPersonaSelect(persona.id)
                }
              }}
              aria-label={`Select ${persona.title} persona`}
              aria-pressed={isSelected}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-security-green/20 text-security-green'
                      : 'bg-neutral-700/50 text-neutral-300'
                  }`}>
                    {persona.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {persona.title}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-security-green/20 text-security-green">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-neutral-300 mb-6 leading-relaxed">
                {persona.description}
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {persona.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-security-green flex-shrink-0" />
                    <span className="text-sm text-neutral-200">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Preview */}
              <div className={`border-t pt-4 ${
                isSelected ? 'border-security-green/30' : 'border-neutral-700/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      isSelected ? 'text-security-green' : 'text-primary-400'
                    }`}>
                      {persona.ctaText}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {persona.ctaSubtext}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                    isFocused ? 'translate-x-1' : ''
                  } ${isSelected ? 'text-security-green' : 'text-neutral-400'}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <button
          onClick={() => onPersonaSelect('passive-saver')}
          className="text-neutral-400 hover:text-neutral-300 text-sm underline transition-colors"
          aria-label="Skip persona selection and continue with default option"
        >
          {t('persona.skip')}
        </button>
      </div>
    </div>
  )
}

// Helper icon component
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}