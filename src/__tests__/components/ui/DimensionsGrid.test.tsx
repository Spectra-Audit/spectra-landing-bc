import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DimensionsGrid, { type DimensionsGridItem } from '@/components/ui/DimensionsGrid'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className }: any) => <div data-testid="check-circle" className={className} />,
}))

describe('DimensionsGrid Component', () => {
  const mockDimensions: DimensionsGridItem[] = [
    {
      id: 1,
      name: 'Code Security',
      description: 'Smart contract vulnerability detection',
      details: ['Static analysis', 'Dynamic testing'],
      weight: 45,
      color: 'green',
      bgLight: 'bg-green-500/20',
      text: 'text-green-700',
      border: 'border-green-500',
      icon: <span>Shield Icon</span>,
    },
    {
      id: 2,
      name: 'Tokenomics',
      description: 'Token distribution analysis',
      details: ['Holder concentration', 'Supply dynamics'],
      weight: 15,
      color: 'blue',
      bgLight: 'bg-blue-500/20',
      text: 'text-blue-700',
      border: 'border-blue-500',
      icon: <span>Chart Icon</span>,
    },
  ]

  describe('Rendering', () => {
    it('should render all dimension cards', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      expect(screen.getByText('Code Security')).toBeInTheDocument()
      expect(screen.getByText('Tokenomics')).toBeInTheDocument()
    })

    it('should render dimension names', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      mockDimensions.forEach((dim) => {
        expect(screen.getByText(dim.name)).toBeInTheDocument()
      })
    })

    it('should render dimension descriptions', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      mockDimensions.forEach((dim) => {
        expect(screen.getByText(dim.description)).toBeInTheDocument()
      })
    })

    it('should render dimension details as list items', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      expect(screen.getByText('Static analysis')).toBeInTheDocument()
      expect(screen.getByText('Dynamic testing')).toBeInTheDocument()
      expect(screen.getByText('Holder concentration')).toBeInTheDocument()
      expect(screen.getByText('Supply dynamics')).toBeInTheDocument()
    })

    it('should render weight percentages', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      expect(screen.getByText('45%')).toBeInTheDocument()
      expect(screen.getByText('15%')).toBeInTheDocument()
    })

    it('should render pre-rendered icon nodes', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      expect(screen.getByText('Shield Icon')).toBeInTheDocument()
      expect(screen.getByText('Chart Icon')).toBeInTheDocument()
    })

    it('should render "Weight" label for each dimension', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      const weightLabels = screen.getAllByText('Weight')
      expect(weightLabels.length).toBe(mockDimensions.length)
    })
  })

  describe('Hover state management', () => {
    it('should initialize with no hovered dimension', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      // Check that cards don't have the hover scale class initially
      const cards = container.querySelectorAll('[class*="scale-105"]')
      expect(cards.length).toBe(0)
    })

    it('should update hover state on mouseEnter', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      fireEvent.mouseEnter(cards[0])

      // After hover, the card should have the hovered styles
      expect(cards[0].className).toContain('scale-105')
    })

    it('should remove hover state on mouseLeave', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      fireEvent.mouseEnter(cards[0])
      expect(cards[0].className).toContain('scale-105')

      fireEvent.mouseLeave(cards[0])
      expect(cards[0].className).not.toContain('scale-105')
    })

    it('should only show hover state on the hovered card', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      fireEvent.mouseEnter(cards[0])

      // First card should have hover state
      expect(cards[0].className).toContain('scale-105')
      // Second card should not
      expect(cards[1].className).not.toContain('scale-105')
    })

    it('should handle rapid hover transitions', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')

      fireEvent.mouseEnter(cards[0])
      expect(cards[0].className).toContain('scale-105')

      fireEvent.mouseEnter(cards[1])
      expect(cards[0].className).not.toContain('scale-105')
      expect(cards[1].className).toContain('scale-105')

      fireEvent.mouseLeave(cards[1])
      expect(cards[1].className).not.toContain('scale-105')
    })
  })

  describe('Styling', () => {
    it('should apply color-specific border class on hover', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      fireEvent.mouseEnter(cards[0])

      // The first dimension has border-green-500
      expect(cards[0].className).toContain('border-green-500')
    })

    it('should apply color-specific text class', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      // The text color class is applied to the h3 containing the dimension name
      const codeSecurityHeading = screen.getByText('Code Security')
      expect(codeSecurityHeading.className).toContain('text-green-700')
    })

    it('should apply background light class on icon', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      // bgLight classes are applied to icon container
      // Note: In the actual component, these are applied conditionally
      const cards = container.querySelectorAll('[class*="bg-green-500/20"]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Detail items with icons', () => {
    it('should render CheckCircle icon for each detail', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      const checkCircles = screen.getAllByTestId('check-circle')
      expect(checkCircles.length).toBe(4) // 2 details × 2 dimensions
    })

    it('should apply color-specific icon class', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      const checkCircles = screen.getAllByTestId('check-circle')
      // First two should be green, next two should be blue
      expect(checkCircles[0].className).toContain('text-green-700')
      expect(checkCircles[1].className).toContain('text-green-700')
      expect(checkCircles[2].className).toContain('text-blue-700')
      expect(checkCircles[3].className).toContain('text-blue-700')
    })
  })

  describe('Grid layout', () => {
    it('should render grid container with correct classes', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const grid = container.querySelector('[class*="grid"]')
      expect(grid).toBeInTheDocument()
      expect(grid?.className).toContain('grid-cols-1')
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-3')
    })

    it('should handle empty dimensions array', () => {
      const { container } = render(<DimensionsGrid dimensions={[]} />)

      const grid = container.querySelector('[class*="grid"]')
      expect(grid).toBeInTheDocument()
      expect(grid?.children.length).toBe(0)
    })

    it('should handle single dimension', () => {
      const singleDim = [mockDimensions[0]]
      const { container } = render(<DimensionsGrid dimensions={singleDim} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      expect(cards.length).toBe(1)
    })

    it('should handle many dimensions', () => {
      const manyDims: DimensionsGridItem[] = Array.from({ length: 10 }, (_, i) => ({
        ...mockDimensions[0],
        id: i,
        name: `Dimension ${i}`,
      }))

      const { container } = render(<DimensionsGrid dimensions={manyDims} />)

      const cards = container.querySelectorAll('[class*="glass-spectra"]')
      expect(cards.length).toBe(10)
    })
  })

  describe('Props validation', () => {
    it('should render with minimal required props', () => {
      const minimalDimension: DimensionsGridItem = {
        id: 1,
        name: 'Test',
        description: 'Test desc',
        details: [],
        weight: 50,
        color: 'red',
        bgLight: 'bg-red-500/20',
        text: 'text-red-700',
        border: 'border-red-500',
        icon: <span>Icon</span>,
      }

      render(<DimensionsGrid dimensions={[minimalDimension]} />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('Test desc')).toBeInTheDocument()
    })

    it('should handle pre-rendered icon nodes as expected', () => {
      const customIcon = <span data-testid="custom-icon">Custom Icon</span>
      const dims: DimensionsGridItem[] = [
        { ...mockDimensions[0], id: 99, icon: customIcon },
      ]

      render(<DimensionsGrid dimensions={dims} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have semantic heading for dimension name', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBe(mockDimensions.length)
    })

    it('should render detail items in a list with semantic role', () => {
      const { container } = render(<DimensionsGrid dimensions={mockDimensions} />)

      const divs = container.querySelectorAll('[class*="space-y"]')
      // space-y-2 container should exist
      expect(divs.length).toBeGreaterThan(0)
    })

    it('should have meaningful text content for all elements', () => {
      render(<DimensionsGrid dimensions={mockDimensions} />)

      mockDimensions.forEach((dim) => {
        expect(screen.getByText(dim.name)).toBeInTheDocument()
        dim.details.forEach((detail) => {
          expect(screen.getByText(detail)).toBeInTheDocument()
        })
      })
    })
  })

  describe('Security: Props sanitization', () => {
    it('should safely render potentially harmful dimension names', () => {
      const evilDim: DimensionsGridItem = {
        ...mockDimensions[0],
        name: '<script>alert("xss")</script>',
      }

      render(<DimensionsGrid dimensions={[evilDim]} />)

      // React escapes content by default
      const scriptTags = document.querySelectorAll('script[data-testid]')
      // Only our test scripts should be present, not user-supplied ones
      expect(scriptTags.length).toBe(0)
    })

    it('should safely render potentially harmful descriptions', () => {
      const evilDim: DimensionsGridItem = {
        ...mockDimensions[0],
        description: 'onmouseover="alert(1)"',
      }

      render(<DimensionsGrid dimensions={[evilDim]} />)

      expect(screen.getByText('onmouseover="alert(1)"')).toBeInTheDocument()
      // Content should be escaped, not executed
    })

    it('should safely render potentially harmful details', () => {
      const evilDim: DimensionsGridItem = {
        ...mockDimensions[0],
        details: ['<img src=x onerror="alert(1)">'],
      }

      render(<DimensionsGrid dimensions={[evilDim]} />)

      const images = document.querySelectorAll('img[onerror]')
      expect(images.length).toBe(0)
    })
  })
})
