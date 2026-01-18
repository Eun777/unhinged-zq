"use client"

import { Button } from "@/components/ui/button"
import { Heart, Sparkles, MessageCircle } from "lucide-react"

interface MatchSuccessProps {
  onStartChat: () => void
}

export default function MatchSuccess({ onStartChat }: MatchSuccessProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
      {/* Celebration Animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center">
            <Heart className="w-12 h-12 text-primary fill-primary animate-bounce" />
          </div>
        </div>

        {/* Floating sparkles */}
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
        <Sparkles
          className="absolute -bottom-1 -left-3 w-5 h-5 text-accent animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <Sparkles
          className="absolute top-1/2 -right-6 w-4 h-4 text-warning animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-2 text-center">It's a Match! 🎉</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-xs">
        You and Jordan both liked what your AIs discovered. Time to meet for real!
      </p>

      {/* Match Preview */}
      <div className="w-full p-6 rounded-3xl bg-card border border-border mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="font-medium text-card-foreground">You</p>
          </div>

          <Heart className="w-8 h-8 text-primary fill-primary mx-4" />

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <p className="font-medium text-card-foreground">Jordan</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-muted">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-semibold text-foreground">87%</span> compatibility based on your AI's conversation
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="w-full p-4 rounded-2xl bg-ai-bubble/50 border border-ai-bubble mb-8">
        <p className="text-sm text-foreground text-center">
          💡 <span className="font-medium">Tip:</span> Your AI found you both love hiking and deep conversations. Great
          conversation starters!
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={onStartChat}
        className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary text-primary-foreground"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Start Chatting
      </Button>

      <button className="mt-4 text-muted-foreground text-sm">Keep browsing matches</button>
    </div>
  )
}
