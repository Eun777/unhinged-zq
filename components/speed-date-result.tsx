"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Heart, ChevronDown, ChevronUp, Sparkles, AlertTriangle, Check } from "lucide-react"

interface SpeedDateResultProps {
  onMatch: () => void
  onPass: () => void
}

export default function SpeedDateResult({ onMatch, onPass }: SpeedDateResultProps) {
  const [showFullChat, setShowFullChat] = useState(false)

  const chatPreview = [
    { sender: "them", text: "So your human mentioned they love hiking! What's the best trail they've done?" },
    {
      sender: "you",
      text: "Oh, definitely the Pacific Crest Trail section last summer. 3 days of pure wilderness bliss! Do they enjoy outdoor stuff too?",
    },
    {
      sender: "them",
      text: "Mine is obsessed with finding hidden waterfalls. They'd probably love to explore with someone who appreciates nature.",
    },
    {
      sender: "you",
      text: "That sounds amazing. Mine also values having deep conversations - do they enjoy that kind of connection?",
    },
  ]

  const vibeReasons = [
    "Both value quality time and meaningful conversations",
    "Shared love for outdoor adventures",
    "Similar sense of humor and playfulness",
    "Both looking for something serious",
  ]

  const risks = ["They're a night owl, yours is an early bird", "Different views on social media sharing"]

  return (
    <div className="flex-1 flex flex-col bg-background pb-20 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">AI Speed Date #4</p>
          <h1 className="text-2xl font-bold text-foreground">Jordan's AI</h1>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Compatibility Score */}
      <div className="mx-6 p-6 rounded-3xl bg-card border border-border mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Compatibility</span>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-primary">87%</span>
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: "87%" }} />
        </div>
      </div>

      {/* Chat Transcript */}
      <Card className="mx-6 rounded-3xl border-border mb-4 overflow-hidden">
        <button onClick={() => setShowFullChat(!showFullChat)} className="w-full p-4 flex items-center justify-between">
          <span className="font-semibold text-card-foreground">AI Date Transcript</span>
          {showFullChat ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <div className={`px-4 pb-4 space-y-3 transition-all ${showFullChat ? "max-h-96" : "max-h-40"} overflow-hidden`}>
          {chatPreview.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.sender === "you"
                    ? "bg-user-bubble/80 text-user-bubble-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Why You Might Vibe */}
      <div className="mx-6 p-5 rounded-3xl bg-success/10 border border-success/20 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Check className="w-5 h-5 text-success" />
          <h3 className="font-semibold text-foreground">Why you might vibe</h3>
        </div>
        <ul className="space-y-2">
          {vibeReasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-success mt-0.5">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Possible Risks */}
      <div className="mx-6 p-5 rounded-3xl bg-warning/10 border border-warning/20 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Possible challenges</h3>
        </div>
        <ul className="space-y-2">
          {risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-warning mt-0.5">•</span>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-auto flex gap-4">
        <Button
          onClick={onPass}
          variant="outline"
          className="flex-1 h-16 rounded-2xl border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
        >
          <X className="w-7 h-7" />
        </Button>
        <Button
          onClick={onMatch}
          className="flex-1 h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Heart className="w-7 h-7" />
        </Button>
      </div>
    </div>
  )
}
