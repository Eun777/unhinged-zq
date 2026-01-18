"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Bot, MessageCircle, Shield } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col px-6 py-12 bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
          Train Your AI to
          <br />
          <span className="text-primary">Date Like You</span>
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
          Create your profile, chat with AI bots, and let your Personal AI learn how you connect.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-card-foreground">Create Your Profile</p>
            <p className="text-sm text-muted-foreground">Bio, photos & prompts like Hinge</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <p className="font-medium text-card-foreground">Chat with AI Bots</p>
            <p className="text-sm text-muted-foreground">Your AI learns your conversation style</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-success" />
          </div>
          <div className="text-left">
            <p className="font-medium text-card-foreground">AI Never Invents</p>
            <p className="text-sm text-muted-foreground">Only uses info you have shared</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onGetStarted}
        className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
      >
        Get Started
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  )
}
