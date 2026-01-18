"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Pencil, ChevronRight } from "lucide-react"

interface PersonalAIProfileProps {
  onFindDates: () => void
}

export default function PersonalAIProfile({ onFindDates }: PersonalAIProfileProps) {
  const [playfulness, setPlayfulness] = useState([65])
  const [openness, setOpenness] = useState([50])
  const [directness, setDirectness] = useState([70])

  const traits = [
    { label: "Adventurous", active: true },
    { label: "Empathetic", active: true },
    { label: "Creative", active: false },
    { label: "Ambitious", active: true },
    { label: "Witty", active: false },
  ]

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-foreground">Your Dating AI</h1>
        <p className="text-muted-foreground">Customize how you're represented</p>
      </div>

      {/* AI Avatar Card */}
      <div className="mx-6 p-6 rounded-3xl bg-card border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Alex's AI</h2>
            <p className="text-sm text-muted-foreground">Ready to find your match</p>
          </div>
        </div>

        {/* Personality Summary */}
        <div className="p-4 rounded-2xl bg-muted mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            "I'm warm, curious, and genuinely interested in deep conversations. I value authenticity and look for
            someone who shares my love for adventure and meaningful connections."
          </p>
        </div>

        <button className="flex items-center gap-2 text-primary text-sm font-medium">
          <Pencil className="w-4 h-4" />
          Edit personality summary
        </button>
      </div>

      {/* Traits */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Traits</h3>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait) => (
            <button
              key={trait.label}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                trait.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {trait.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style Sliders */}
      <div className="px-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Communication Style</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Reserved</span>
              <span className="text-sm text-muted-foreground">Playful</span>
            </div>
            <Slider value={playfulness} onValueChange={setPlayfulness} max={100} step={1} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Private</span>
              <span className="text-sm text-muted-foreground">Open</span>
            </div>
            <Slider value={openness} onValueChange={setOpenness} max={100} step={1} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Subtle</span>
              <span className="text-sm text-muted-foreground">Direct</span>
            </div>
            <Slider value={directness} onValueChange={setDirectness} max={100} step={1} className="w-full" />
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="mx-6 mt-6 p-4 rounded-2xl bg-ai-bubble/50 border border-ai-bubble">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Give Feedback</p>
            <p className="text-xs text-muted-foreground">
              After dates, tell your AI to "be more playful" or "don't overshare" to improve matches.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mt-auto pt-6">
        <Button
          onClick={onFindDates}
          className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary text-primary-foreground"
        >
          Start Finding Dates 💕
        </Button>
      </div>
    </div>
  )
}
