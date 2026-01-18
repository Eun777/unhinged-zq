"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, X, Camera, Check } from "lucide-react"
import type { UserProfile } from "@/app/page"

interface ProfileCreationProps {
  profile: UserProfile
  onComplete: (data: Partial<UserProfile>) => void
  onBack: () => void
}

const PROMPT_OPTIONS = [
  "A perfect day for me looks like...",
  "I'm looking for someone who...",
  "My most controversial opinion is...",
  "The way to my heart is...",
  "I geek out on...",
  "My biggest pet peeve is...",
  "I'm convinced I'd be good at...",
  "The key to my heart is...",
]

const INTEREST_OPTIONS = [
  "Travel",
  "Music",
  "Cooking",
  "Fitness",
  "Art",
  "Gaming",
  "Reading",
  "Movies",
  "Photography",
  "Hiking",
  "Coffee",
  "Dancing",
  "Yoga",
  "Wine",
  "Sports",
  "Writing",
]

export default function ProfileCreation({ profile, onComplete, onBack }: ProfileCreationProps) {
  const [step, setStep] = useState<"photos" | "bio" | "prompts" | "interests">("photos")
  const [photos, setPhotos] = useState<string[]>(
    profile?.photos && profile.photos.length > 0 ? profile.photos : ["", "", "", "", "", ""],
  )
  const [bio, setBio] = useState(profile?.bio || "")
  const [occupation, setOccupation] = useState(profile?.occupation || "")
  const [prompts, setPrompts] = useState<{ question: string; answer: string }[]>(
    profile?.prompts && profile.prompts.length > 0 ? profile.prompts : [],
  )
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || [])
  const [currentPromptQuestion, setCurrentPromptQuestion] = useState("")

  const stepTitles = {
    photos: "Add Photos",
    bio: "Write Your Bio",
    prompts: "Answer Prompts",
    interests: "Select Interests",
  }

  const handlePhotoAdd = (index: number) => {
    // Simulate photo selection with placeholder
    const newPhotos = [...photos]
    newPhotos[index] = `/placeholder.svg?height=200&width=200&query=portrait photo ${index + 1}`
    setPhotos(newPhotos)
  }

  const handlePhotoRemove = (index: number) => {
    const newPhotos = [...photos]
    newPhotos[index] = ""
    setPhotos(newPhotos)
  }

  const handleAddPrompt = () => {
    if (currentPromptQuestion && prompts.length < 3) {
      setPrompts([...prompts, { question: currentPromptQuestion, answer: "" }])
      setCurrentPromptQuestion("")
    }
  }

  const handlePromptAnswerChange = (index: number, answer: string) => {
    const newPrompts = [...prompts]
    newPrompts[index].answer = answer
    setPrompts(newPrompts)
  }

  const handleRemovePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index))
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleNext = () => {
    if (step === "photos") setStep("bio")
    else if (step === "bio") setStep("prompts")
    else if (step === "prompts") setStep("interests")
    else {
      onComplete({
        photos: photos.filter((p) => p !== ""),
        bio,
        occupation,
        prompts,
        interests: selectedInterests,
      })
    }
  }

  const canProceed = () => {
    if (step === "photos") return photos.filter((p) => p !== "").length >= 2
    if (step === "bio") return bio.length >= 10
    if (step === "prompts") return prompts.length >= 1 && prompts.every((p) => p.answer.length >= 5)
    if (step === "interests") return selectedInterests.length >= 3
    return false
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        <button
          onClick={
            step === "photos"
              ? onBack
              : () => {
                  if (step === "bio") setStep("photos")
                  else if (step === "prompts") setStep("bio")
                  else if (step === "interests") setStep("prompts")
                }
          }
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="font-semibold text-card-foreground">{stepTitles[step]}</p>
          <div className="flex gap-1 mt-1">
            {["photos", "bio", "prompts", "interests"].map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  ["photos", "bio", "prompts", "interests"].indexOf(step) >= i ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Photos Step */}
        {step === "photos" && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">Add at least 2 photos to continue</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`aspect-[3/4] rounded-2xl border-2 border-dashed ${
                    photo ? "border-primary" : "border-border"
                  } bg-muted relative overflow-hidden`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handlePhotoRemove(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePhotoAdd(index)}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-xs">Add</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">Tip: Your first photo is what people see first</p>
          </div>
        )}

        {/* Bio Step */}
        {step === "bio" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-foreground">
                What do you do?
              </Label>
              <Input
                id="occupation"
                type="text"
                placeholder="e.g., Software Engineer at Google"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                About You
              </Label>
              <Textarea
                id="bio"
                placeholder="Write a short bio about yourself. What makes you unique? What are you passionate about?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[150px] rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
            </div>
          </div>
        )}

        {/* Prompts Step */}
        {step === "prompts" && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">Answer 1-3 prompts to help others get to know you</p>

            {prompts.map((prompt, index) => (
              <div key={index} className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-card-foreground text-sm">{prompt.question}</p>
                  <button
                    onClick={() => handleRemovePrompt(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Textarea
                  placeholder="Your answer..."
                  value={prompt.answer}
                  onChange={(e) => handlePromptAnswerChange(index, e.target.value)}
                  className="min-h-[80px] rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground resize-none"
                  maxLength={200}
                />
              </div>
            ))}

            {prompts.length < 3 && (
              <div className="space-y-3">
                <Label className="text-foreground">Add a prompt</Label>
                <div className="flex flex-wrap gap-2">
                  {PROMPT_OPTIONS.filter((p) => !prompts.some((pr) => pr.question === p))
                    .slice(0, 4)
                    .map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setCurrentPromptQuestion(prompt)}
                        className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                          currentPromptQuestion === prompt
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {prompt}
                      </button>
                    ))}
                </div>
                {currentPromptQuestion && (
                  <Button onClick={handleAddPrompt} variant="outline" className="w-full rounded-xl bg-transparent">
                    <Plus className="w-4 h-4 mr-2" /> Add This Prompt
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interests Step */}
        {step === "interests" && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center">Select 3-5 interests</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    disabled={!isSelected && selectedInterests.length >= 5}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {interest}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center">{selectedInterests.length}/5 selected</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          {step === "interests" ? "Start Training Your AI" : "Continue"}
        </Button>
      </div>
    </div>
  )
}
