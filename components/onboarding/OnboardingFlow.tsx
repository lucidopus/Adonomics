'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import {
  ROLE_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  DECISION_FACTOR_OPTIONS,
  TECHNICAL_COMFORT_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  INSIGHT_TIMING_OPTIONS,
  RESULT_SPEED_OPTIONS,
  TEAM_MEMBER_OPTIONS,
  SHARING_FORMAT_OPTIONS,
  PAIN_POINT_OPTIONS,
  UserRole,
  PrimaryGoal,
  DecisionFactor,
  TechnicalComfort,
  CampaignType,
  Platform,
  InsightTiming,
  ResultSpeed,
  TeamMember,
  SharingFormat,
  PainPoint
} from '@/types/database'

interface OnboardingFlowProps {
  userId: string
}

export default function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<{
    role: UserRole | ''
    primary_goals: PrimaryGoal[]
    decision_factors: DecisionFactor[]
    technical_comfort: TechnicalComfort | ''
    campaign_types: CampaignType[]
    platforms: Platform[]
    insight_timing: InsightTiming[]
    result_speed: ResultSpeed | ''
    team_members: TeamMember[]
    sharing_formats: SharingFormat[]
    pain_points: PainPoint[]
  }>({
    role: '',
    primary_goals: [],
    decision_factors: [],
    technical_comfort: '',
    campaign_types: [],
    platforms: [],
    insight_timing: [],
    result_speed: '',
    team_members: [],
    sharing_formats: [],
    pain_points: [],
  })

  // Load existing preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch(`/api/preferences?userId=${userId}`)
        const data = await response.json()

        if (response.ok && data.preferences) {
          const prefs = data.preferences

          // Update form data with existing preferences
          setFormData({
            role: prefs.role || '',
            primary_goals: prefs.primary_goals || [],
            decision_factors: prefs.decision_factors || [],
            technical_comfort: prefs.technical_comfort || '',
            campaign_types: prefs.campaign_types || [],
            platforms: prefs.platforms || [],
            insight_timing: prefs.insight_timing || [],
            result_speed: prefs.result_speed || '',
            team_members: prefs.team_members || [],
            sharing_formats: prefs.sharing_formats || [],
            pain_points: prefs.pain_points || [],
          })

          // Set current step
          setStep(prefs.current_step || 1)
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [userId])

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }))
  }

  const togglePrimaryGoal = (goal: PrimaryGoal) => {
    setFormData(prev => ({
      ...prev,
      primary_goals: prev.primary_goals.includes(goal)
        ? prev.primary_goals.filter(g => g !== goal)
        : prev.primary_goals.length < 3
          ? [...prev.primary_goals, goal]
          : prev.primary_goals
    }))
  }

  const moveDecisionFactor = (factor: DecisionFactor, direction: 'up' | 'down') => {
    setFormData(prev => {
      const currentIndex = prev.decision_factors.indexOf(factor)
      if (currentIndex === -1) return prev

      const newFactors = [...prev.decision_factors]
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (newIndex >= 0 && newIndex < newFactors.length) {
        [newFactors[currentIndex], newFactors[newIndex]] = [newFactors[newIndex], newFactors[currentIndex]]
      }

      return { ...prev, decision_factors: newFactors }
    })
  }

  const addDecisionFactor = (factor: DecisionFactor) => {
    if (!formData.decision_factors.includes(factor) && formData.decision_factors.length < 5) {
      setFormData(prev => ({
        ...prev,
        decision_factors: [...prev.decision_factors, factor]
      }))
    }
  }

  const removeDecisionFactor = (factor: DecisionFactor) => {
    setFormData(prev => ({
      ...prev,
      decision_factors: prev.decision_factors.filter(f => f !== factor)
    }))
  }

  const handleTechnicalComfortSelect = (comfort: TechnicalComfort) => {
    setFormData({ ...formData, technical_comfort: comfort })
  }

  const toggleCampaignType = (type: CampaignType) => {
    setFormData(prev => ({
      ...prev,
      campaign_types: prev.campaign_types.includes(type)
        ? prev.campaign_types.filter(t => t !== type)
        : [...prev.campaign_types, type]
    }))
  }

  const togglePlatform = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const toggleInsightTiming = (timing: InsightTiming) => {
    setFormData(prev => ({
      ...prev,
      insight_timing: prev.insight_timing.includes(timing)
        ? prev.insight_timing.filter(t => t !== timing)
        : [...prev.insight_timing, timing]
    }))
  }

  const handleResultSpeedSelect = (speed: ResultSpeed) => {
    setFormData({ ...formData, result_speed: speed })
  }

  const toggleTeamMember = (member: TeamMember) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.includes(member)
        ? prev.team_members.filter(m => m !== member)
        : [...prev.team_members, member]
    }))
  }

  const toggleSharingFormat = (format: SharingFormat) => {
    setFormData(prev => ({
      ...prev,
      sharing_formats: prev.sharing_formats.includes(format)
        ? prev.sharing_formats.filter(f => f !== format)
        : [...prev.sharing_formats, format]
    }))
  }

  const togglePainPoint = (point: PainPoint) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points.includes(point)
        ? prev.pain_points.filter(p => p !== point)
        : [...prev.pain_points, point]
    }))
  }

  const saveProgress = async (currentStep: number) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          current_step: currentStep,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = async () => {
    if (step < 8) {
      const nextStep = step + 1
      setStep(nextStep) // Move to next step immediately
      saveProgress(nextStep) // Save progress in background (don't await)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!formData.role || formData.primary_goals.length === 0 || !formData.technical_comfort || !formData.result_speed) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          current_step: 8,
          ...formData,
          onboarding_completed: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      // Store onboarding completion status in localStorage
      localStorage.setItem('onboarding_completed', 'true')

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
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      scale: 0.98
    })
  }

  const getStepValidation = (stepNum: number) => {
    switch (stepNum) {
      case 1: return !!formData.role
      case 2: return formData.primary_goals.length > 0
      case 3: return formData.decision_factors.length > 0
      case 4: return !!formData.technical_comfort
      case 5: return formData.campaign_types.length > 0 && formData.platforms.length > 0
      case 6: return formData.insight_timing.length > 0 && !!formData.result_speed
      case 7: return formData.team_members.length > 0 && formData.sharing_formats.length > 0
      case 8: return true // Optional step
      default: return false
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-muted-foreground text-lg font-medium">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center space-x-2 mb-6">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  s < step
                    ? 'bg-primary ring-2 ring-primary/30 scale-110'
                    : s === step
                    ? 'bg-primary ring-2 ring-primary/50 animate-pulse scale-125'
                    : 'bg-muted-foreground/30 dark:bg-muted-foreground/20'
                }`}
              />
              {s < 8 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-colors duration-500 ${
                    s < step ? 'bg-primary' : 'bg-muted-foreground/30 dark:bg-muted-foreground/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Step {step} of 8
          </p>
          <div className="mt-2 h-1.5 bg-muted-foreground/20 dark:bg-muted-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass shadow-apple-lg rounded-3xl overflow-hidden border border-border">
              <div className="p-8 md:p-12 backdrop-blur-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-3">
                     What&apos;s your role?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Help us personalize your dashboard experience
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {ROLE_OPTIONS.map((option, index) => (
                     <button
                       key={option.value}
                       type="button"
                       onClick={() => handleRoleSelect(option.value)}
                        className={`group p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          formData.role === option.value
                            ? 'border-primary bg-primary/10 shadow-apple-lg'
                            : 'border-border/50 hover:border-primary/40 hover:bg-accent/50'
                        }`}
                     >
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 rounded-full mt-2 transition-all ${
                          formData.role === option.value ? 'bg-black dark:bg-white' : 'bg-muted-foreground/30'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {option.description}
                           </div>
                         </div>
                       </div>
                     </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Primary Goals */}
        {step === 2 && (
          <motion.div
            key="step2"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass shadow-apple-lg rounded-3xl overflow-hidden border border-border">
              <div className="p-8 md:p-12 backdrop-blur-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-3">
                    Primary Goals
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    What do you want to achieve with video ad analytics? (Select up to 3)
                  </p>
                </div>
                <div className="grid gap-4">
                  {PRIMARY_GOAL_OPTIONS.map((option, index) => (
                     <button
                       key={option.value}
                       type="button"
                       onClick={() => togglePrimaryGoal(option.value)}
                       className={`group relative p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                         formData.primary_goals.includes(option.value)
                           ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                           : 'border-border/50 hover:border-primary/40 hover:bg-accent/50'
                       } ${
                         formData.primary_goals.length >= 3 && !formData.primary_goals.includes(option.value)
                           ? 'opacity-50 cursor-not-allowed'
                           : ''
                       }`}
                       disabled={formData.primary_goals.length >= 3 && !formData.primary_goals.includes(option.value)}
                     >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          formData.primary_goals.includes(option.value)
                            ? 'bg-primary border-primary scale-110'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.primary_goals.includes(option.value) && (
                            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-lg mb-1 transition-colors ${
                            formData.primary_goals.includes(option.value) ? 'text-primary' : ''
                          }`}>
                            {option.label}
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {option.description}
                          </div>
                        </div>
                        {formData.primary_goals.includes(option.value) && (
                          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-lg">
                            {formData.primary_goals.indexOf(option.value) + 1}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.primary_goals.length} of 3
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Decision Factors */}
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
                <CardTitle>Key Decision Factors</CardTitle>
                <CardDescription>
                  What metrics matter MOST to you when evaluating ad creative? (Rank top 5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected factors */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Your top priorities (drag to reorder):</h4>
                  {formData.decision_factors.map((factor, index) => {
                    const option = DECISION_FACTOR_OPTIONS.find(o => o.value === factor)
                    return (
                      <div key={factor} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg relative z-10">
                        <span className="text-muted-foreground">⋮⋮</span>
                        <span className="font-medium">{index + 1}.</span>
                        <span className="flex-1">{option?.label}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              moveDecisionFactor(factor, 'up')
                            }}
                            disabled={index === 0}
                            style={{ pointerEvents: 'auto' }}
                            className="px-2 py-1 text-sm rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              moveDecisionFactor(factor, 'down')
                            }}
                            disabled={index === formData.decision_factors.length - 1}
                            style={{ pointerEvents: 'auto' }}
                            className="px-2 py-1 text-sm rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeDecisionFactor(factor)
                            }}
                            style={{ pointerEvents: 'auto' }}
                            className="px-2 py-1 text-sm rounded hover:bg-accent relative z-10"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Available factors */}
                <div className="space-y-2 relative z-10">
                  <h4 className="font-semibold text-sm">Available options:</h4>
                  {DECISION_FACTOR_OPTIONS.filter(option => !formData.decision_factors.includes(option.value)).map((option) => (
                     <button
                       key={option.value}
                       type="button"
                       onClick={(e) => {
                         e.preventDefault()
                         e.stopPropagation()
                         console.log('Decision factor clicked:', option.value)
                         addDecisionFactor(option.value)
                       }}
                       style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                       className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 relative z-10"
                       disabled={formData.decision_factors.length >= 5}
                     >
                       <div className="w-5 h-5 rounded border-2 border-muted-foreground/40 bg-background flex-shrink-0"></div>
                       <div className="flex-1">
                         <div className="font-semibold">{option.label}</div>
                         <div className="text-sm text-muted-foreground">
                           {option.description}
                         </div>
                       </div>
                     </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Technical Comfort */}
        {step === 4 && (
          <motion.div
            key="step4"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Technical Comfort Level</CardTitle>
                <CardDescription>
                  How do you prefer to consume data?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {TECHNICAL_COMFORT_OPTIONS.map((option) => (
                   <button
                     key={option.value}
                     type="button"
                     onClick={(e) => {
                       e.preventDefault()
                       e.stopPropagation()
                       handleTechnicalComfortSelect(option.value)
                     }}
                     style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                     className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 active:scale-95 flex items-start gap-3 relative z-10 ${
                       formData.technical_comfort === option.value
                         ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                         : 'border-border hover:border-primary/40 hover:bg-primary/5'
                     }`}
                   >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      formData.technical_comfort === option.value
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/40 bg-background'
                    }`}>
                      {formData.technical_comfort === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold transition-colors ${
                        formData.technical_comfort === option.value ? 'text-primary' : ''
                      }`}>{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                   </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Campaign Context */}
        {step === 5 && (
          <motion.div
            key="step5"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Campaign Context</CardTitle>
                <CardDescription>
                  Tell us about your campaigns and platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">What type of campaigns do you typically run?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CAMPAIGN_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleCampaignType(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        className={`relative p-4 text-left rounded-lg border-2 transition-all duration-300 flex items-center gap-3 z-10 ${
                          formData.campaign_types.includes(option.value)
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.campaign_types.includes(option.value)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.campaign_types.includes(option.value) && (
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.campaign_types.includes(option.value) ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What platforms do you advertise on?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PLATFORM_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          togglePlatform(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        className={`relative p-4 text-left rounded-lg border-2 transition-all duration-300 flex items-center gap-3 z-10 ${
                          formData.platforms.includes(option.value)
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.platforms.includes(option.value)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.platforms.includes(option.value) && (
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.platforms.includes(option.value) ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 6: Time Constraints */}
        {step === 6 && (
          <motion.div
            key="step6"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Time Constraints</CardTitle>
                <CardDescription>
                  When do you need insights and how quickly?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">When do you need insights?</h4>
                  <div className="space-y-3">
                    {INSIGHT_TIMING_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleInsightTiming(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 flex items-center gap-3 relative z-10 ${
                          formData.insight_timing.includes(option.value)
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.insight_timing.includes(option.value)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.insight_timing.includes(option.value) && (
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.insight_timing.includes(option.value) ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">How quickly do you need results?</h4>
                  <div className="space-y-3">
                    {RESULT_SPEED_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleResultSpeedSelect(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                         className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 active:scale-95 flex items-center gap-3 relative z-10 ${
                           formData.result_speed === option.value
                             ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                             : 'border-border hover:border-primary/40 hover:bg-primary/5'
                         }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.result_speed === option.value
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.result_speed === option.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground"></div>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.result_speed === option.value ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 7: Team Collaboration */}
        {step === 7 && (
          <motion.div
            key="step7"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Who else will use these insights?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Who else will use these insights?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TEAM_MEMBER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleTeamMember(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        className={`relative p-4 text-left rounded-lg border-2 transition-all duration-300 flex items-center gap-3 z-10 ${
                          formData.team_members.includes(option.value)
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.team_members.includes(option.value)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.team_members.includes(option.value) && (
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.team_members.includes(option.value) ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What format do you need for sharing?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SHARING_FORMAT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSharingFormat(option.value)
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        className={`relative p-4 text-left rounded-lg border-2 transition-all duration-300 flex items-center gap-3 z-10 ${
                          formData.sharing_formats.includes(option.value)
                            ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.sharing_formats.includes(option.value)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/40 bg-background'
                        }`}>
                          {formData.sharing_formats.includes(option.value) && (
                            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium transition-colors ${
                          formData.sharing_formats.includes(option.value) ? 'text-primary' : ''
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 8: Pain Points */}
        {step === 8 && (
          <motion.div
            key="step8"
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pain Points</CardTitle>
                <CardDescription>
                  What frustrates you most about current creative analytics? (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PAIN_POINT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                     onClick={(e) => {
                       e.preventDefault()
                       e.stopPropagation()
                       togglePainPoint(option.value)
                     }}
                     style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                     className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 active:scale-95 flex items-center gap-3 relative z-10 ${
                      formData.pain_points.includes(option.value)
                        ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      formData.pain_points.includes(option.value)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/40 bg-background'
                    }`}>
                      {formData.pain_points.includes(option.value) && (
                        <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className={`font-semibold transition-colors ${
                      formData.pain_points.includes(option.value) ? 'text-primary' : ''
                    }`}>{option.label}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-12 flex justify-between items-center relative z-50">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-3 rounded-2xl font-medium hover:bg-accent transition-all duration-300 ease-out"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>

        <div className="flex items-center space-x-4">
          {isSaving && (
            <div className="flex items-center text-sm text-muted-foreground animate-fade-in">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          )}

          {step < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!getStepValidation(step)}
              style={{ pointerEvents: 'auto' }}
              className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-apple-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!getStepValidation(step) || isLoading}
              className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-apple-lg transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}