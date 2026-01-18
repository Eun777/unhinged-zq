"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { UserProfile } from "@/app/page"

interface SignUpFormProps {
  onComplete: (data: Partial<UserProfile>) => void
}

export default function SignUpForm({ onComplete }: SignUpFormProps) {
  const [step, setStep] = useState<"basics" | "gender">("basics")
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    location: "",
    gender: "" as "man" | "woman" | "non-binary" | "",
    interestedIn: "" as "men" | "women" | "everyone" | "",
  })

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.age && formData.location) {
      setStep("gender")
    }
  }

  const handleGenderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.gender && formData.interestedIn) {
      onComplete({
        name: formData.name,
        age: Number.parseInt(formData.age),
        location: formData.location,
        gender: formData.gender,
        interestedIn: formData.interestedIn,
      })
    }
  }

  const getStepInfo = () => {
    switch (step) {
      case "basics":
        return "Step 1 of 2"
      case "gender":
        return "Step 2 of 2"
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        {step === "gender" && (
          <button
            onClick={() => setStep("basics")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-card-foreground">Create Account</p>
          <p className="text-xs text-muted-foreground">{getStepInfo()}</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        {step === "basics" ? (
          <form onSubmit={handleBasicsSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Spark AI</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  First Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your first name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  min={18}
                  max={100}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold">
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleGenderSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">About You</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-foreground">I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "woman", label: "Woman" },
                    { value: "man", label: "Man" },
                    { value: "non-binary", label: "Non-binary" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: option.value as typeof formData.gender })}
                      className={`h-12 rounded-xl font-medium transition-colors ${
                        formData.gender === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground">I'm interested in...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "women", label: "Women" },
                    { value: "men", label: "Men" },
                    { value: "everyone", label: "Everyone" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, interestedIn: option.value as typeof formData.interestedIn })
                      }
                      className={`h-12 rounded-xl font-medium transition-colors ${
                        formData.interestedIn === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!formData.gender || !formData.interestedIn}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              Continue to Profile
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
