'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ROLE_OPTIONS, METRIC_OPTIONS, DEMOGRAPHIC_SEGMENTS, UserRole, PrimaryMetric } from '@/types/database'

interface OnboardingFlowProps {
  userId: string
}

export default function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    role: UserRole | ''
    primary_metric: PrimaryMetric | ''
    focus_segments: string[]
  }>({
    role: '',
    primary_metric: '',
    focus_segments: [],
  })

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role })
  }

  const handleMetricSelect = (metric: PrimaryMetric) => {
    setFormData({ ...formData, primary_metric: metric })
  }

  const toggleSegment = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      focus_segments: prev.focus_segments.includes(segment)
        ? prev.focus_segments.filter(s => s !== segment)
        : [...prev.focus_segments, segment]
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!formData.role || !formData.primary_metric || formData.focus_segments.length === 0) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          role: formData.role,
          primary_metric: formData.primary_metric,
          focus_segments: formData.focus_segments,
          onboarding_completed: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 3
        </p>
      </div>

      <AnimatePresence mode="wait" custom={step}>
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>What's your role?</CardTitle>
                <CardDescription>
                  Help us personalize your dashboard experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ROLE_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleRoleSelect(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.role === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Primary Metric */}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>What's your primary focus?</CardTitle>
                <CardDescription>
                  Choose the metric that matters most to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {METRIC_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleMetricSelect(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.primary_metric === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Demographic Segments */}
        {step === 3 && (
          <motion.div
            key="step3"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Select your target segments</CardTitle>
                <CardDescription>
                  Choose the age groups you want to focus on (select multiple)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {DEMOGRAPHIC_SEGMENTS.map((segment) => (
                    <motion.button
                      key={segment}
                      onClick={() => toggleSegment(segment)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        formData.focus_segments.includes(segment)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/20'
                      }`}
                    >
                      {segment}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.role) ||
              (step === 2 && !formData.primary_metric)
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={formData.focus_segments.length === 0}
          >
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  )
}