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
    setFormData({ ...formData, role })
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
      setStep(nextStep)
      await saveProgress(nextStep)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 8
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
                <CardTitle>What best describes your role?</CardTitle>
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

        {/* Step 2: Primary Goals */}
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
                <CardTitle>Primary Goals</CardTitle>
                <CardDescription>
                  What do you want to achieve with video ad analytics? (Select up to 3)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PRIMARY_GOAL_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => togglePrimaryGoal(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.primary_goals.includes(option.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    } ${formData.primary_goals.length >= 3 && !formData.primary_goals.includes(option.value) ? 'opacity-50' : ''}`}
                    disabled={formData.primary_goals.length >= 3 && !formData.primary_goals.includes(option.value)}
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
                      <div key={factor} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">⋮⋮</span>
                        <span className="font-medium">{index + 1}.</span>
                        <span className="flex-1">{option?.label}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveDecisionFactor(factor, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveDecisionFactor(factor, 'down')}
                            disabled={index === formData.decision_factors.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeDecisionFactor(factor)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Available factors */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Available options:</h4>
                  {DECISION_FACTOR_OPTIONS.filter(option => !formData.decision_factors.includes(option.value)).map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => addDecisionFactor(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 text-left rounded-lg border-2 border-border hover:border-primary/20 transition-all"
                      disabled={formData.decision_factors.length >= 5}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </motion.button>
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
                  <motion.button
                    key={option.value}
                    onClick={() => handleTechnicalComfortSelect(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.technical_comfort === option.value
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
                      <motion.button
                        key={option.value}
                        onClick={() => toggleCampaignType(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          formData.campaign_types.includes(option.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What platforms do you advertise on?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PLATFORM_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => togglePlatform(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          formData.platforms.includes(option.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
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
                      <motion.button
                        key={option.value}
                        onClick={() => toggleInsightTiming(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                          formData.insight_timing.includes(option.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">How quickly do you need results?</h4>
                  <div className="space-y-3">
                    {RESULT_SPEED_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleResultSpeedSelect(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                          formData.result_speed === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
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
                      <motion.button
                        key={option.value}
                        onClick={() => toggleTeamMember(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          formData.team_members.includes(option.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What format do you need for sharing?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SHARING_FORMAT_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => toggleSharingFormat(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          formData.sharing_formats.includes(option.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/20'
                        }`}
                      >
                        {option.label}
                      </motion.button>
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
                  <motion.button
                    key={option.value}
                    onClick={() => togglePainPoint(option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.pain_points.includes(option.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>

        {step < 8 ? (
          <Button
            onClick={handleNext}
            disabled={!getStepValidation(step)}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!getStepValidation(step)}
          >
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  )
}