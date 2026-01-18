"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sparkles, Mail, Hash, Loader2 } from "lucide-react"
import type { UserProfile } from "@/app/page"
import { createClient } from "@/lib/supabase/client"

interface SignUpFormProps {
  onComplete: (data: Partial<UserProfile>) => void
  onLogin: (userId: string) => void
}

export default function SignUpForm({ onComplete, onLogin }: SignUpFormProps) {
  const [mode, setMode] = useState<"choose" | "email" | "userid" | "login">("choose")
  const [step, setStep] = useState<"auth" | "basics" | "gender">("auth")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userId: "",
    name: "",
    age: "",
    location: "",
    gender: "" as "man" | "woman" | "non-binary" | "",
    interestedIn: "" as "men" | "women" | "everyone" | "",
  })

  const supabase = createClient()

  const generateUserId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let id = ""
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return
    
    setIsLoading(true)
    setError("")

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        setStep("basics")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserIdSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const newUserId = formData.userId || generateUserId()

    try {
      // Check if user ID already exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", newUserId)
        .single()

      if (existing) {
        setError("This User ID is already taken. Please try another.")
        setIsLoading(false)
        return
      }

      setFormData({ ...formData, userId: newUserId })
      setStep("basics")
    } catch {
      // No existing user found, proceed
      setFormData({ ...formData, userId: newUserId })
      setStep("basics")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (formData.email && formData.password) {
        // Email login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) throw signInError
        onLogin("")
      } else if (formData.userId) {
        // User ID login
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", formData.userId)
          .single()

        if (profileError || !profile) {
          setError("User ID not found. Please check and try again.")
          setIsLoading(false)
          return
        }

        onLogin(formData.userId)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to login"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.age && formData.location) {
      setStep("gender")
    }
  }

  const handleGenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.gender && formData.interestedIn) {
      setIsLoading(true)
      
      try {
        // Get current auth user if using email auth
        const { data: { user } } = await supabase.auth.getUser()
        
        const profileData: Partial<UserProfile> = {
          id: user?.id || formData.userId || `user-${Date.now()}`,
          name: formData.name,
          age: Number.parseInt(formData.age),
          location: formData.location,
          gender: formData.gender,
          interestedIn: formData.interestedIn,
        }

        onComplete(profileData)
      } catch {
        onComplete({
          id: formData.userId || `user-${Date.now()}`,
          name: formData.name,
          age: Number.parseInt(formData.age),
          location: formData.location,
          gender: formData.gender,
          interestedIn: formData.interestedIn,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStepInfo = () => {
    if (step === "auth") return "Sign up or Login"
    if (step === "basics") return "Step 1 of 2"
    return "Step 2 of 2"
  }

  const renderAuthChoice = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to unhinged</h2>
        <p className="text-muted-foreground">Choose how you want to join</p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setMode("email")}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5" />
          Sign up with Email
        </Button>

        <Button
          onClick={() => setMode("userid")}
          variant="outline"
          className="w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-3 border-2"
        >
          <Hash className="w-5 h-5" />
          Create Unique User ID
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">Already have an account?</span>
          </div>
        </div>

        <Button
          onClick={() => setMode("login")}
          variant="ghost"
          className="w-full h-12 rounded-xl font-medium text-primary hover:bg-primary/10"
        >
          Login
        </Button>
      </div>
    </div>
  )

  const renderEmailSignUp = () => (
    <form onSubmit={handleEmailSignUp} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign up with Email</h2>
        <p className="text-muted-foreground">Create your account</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
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
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
            required
            minLength={6}
          />
          <p className="text-xs text-muted-foreground">At least 6 characters</p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
      </Button>

      <button
        type="button"
        onClick={() => setMode("choose")}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to options
      </button>
    </form>
  )

  const renderUserIdSignUp = () => (
    <form onSubmit={handleUserIdSignUp} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create User ID</h2>
        <p className="text-muted-foreground">No email needed - just a unique ID</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId" className="text-foreground">Choose your User ID</Label>
          <Input
            id="userId"
            type="text"
            placeholder="e.g. SPARK2024"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value.toUpperCase() })}
            className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground uppercase tracking-wider font-mono"
            maxLength={12}
          />
          <p className="text-xs text-muted-foreground">Leave blank to generate a random ID</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Remember your User ID! You will need it to log back in. We recommend saving it somewhere safe.
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
      </Button>

      <button
        type="button"
        onClick={() => setMode("choose")}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to options
      </button>
    </form>
  )

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Login to your account</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, userId: "", email: "", password: "" })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              !formData.userId ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, email: "", password: "", userId: "" })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              formData.userId !== "" || (!formData.email && !formData.userId) ? "text-muted-foreground" : "bg-background text-foreground shadow-sm"
            }`}
          >
            User ID
          </button>
        </div>

        {!formData.userId ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="loginEmail" className="text-foreground">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginPassword" className="text-foreground">Password</Label>
              <Input
                id="loginPassword"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="loginUserId" className="text-foreground">User ID</Label>
            <Input
              id="loginUserId"
              type="text"
              placeholder="Your User ID"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value.toUpperCase() })}
              className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground uppercase tracking-wider font-mono"
            />
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || (!formData.email && !formData.userId)}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
      </Button>

      <button
        type="button"
        onClick={() => setMode("choose")}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to options
      </button>
    </form>
  )

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        {(step !== "auth" || mode !== "choose") && (
          <button
            onClick={() => {
              if (step === "gender") setStep("basics")
              else if (step === "basics") setStep("auth")
              else setMode("choose")
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-card-foreground">
            {mode === "login" ? "Login" : "Create Account"}
          </p>
          <p className="text-xs text-muted-foreground">{getStepInfo()}</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {step === "auth" && mode === "choose" && renderAuthChoice()}
        {step === "auth" && mode === "email" && renderEmailSignUp()}
        {step === "auth" && mode === "userid" && renderUserIdSignUp()}
        {step === "auth" && mode === "login" && renderLogin()}
        
        {step === "basics" && (
          <form onSubmit={handleBasicsSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">Basic info to get started</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">First Name</Label>
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
                <Label htmlFor="age" className="text-foreground">Age</Label>
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
                <Label htmlFor="location" className="text-foreground">Location</Label>
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
        )}

        {step === "gender" && (
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
              disabled={!formData.gender || !formData.interestedIn || isLoading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Profile"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
