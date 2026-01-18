"use client"

import { useState } from "react"
import { Sparkles, Bot, MessageCircle, TrendingUp, ChevronRight } from "lucide-react"
import type { UserProfile } from "@/app/page"
import TrainingBotChat from "@/components/training-bot-chat"

interface MyAISectionProps {
  userProfile: UserProfile
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

const getTrainingBots = (interestedIn: string) => {
  const maleBots = [
    {
      id: "casual-m",
      name: "Ethan",
      type: "Casual Chatter",
      description: "Practice everyday small talk",
      avatar: "/casual-friendly-young-man-smiling.jpg",
      personality: "Laid-back and friendly",
      occupation: "Bartender & DJ",
      interests: ["music festivals", "skateboarding", "documentaries"],
      quirk: "I name all my plants and talk to them daily",
      conversationStyle: "casual",
    },
    {
      id: "deep-m",
      name: "Oliver",
      type: "Deep Diver",
      description: "Meaningful conversation practice",
      avatar: "/confident-man-portrait-casual-friendly.jpg",
      personality: "Thoughtful and curious",
      occupation: "Philosophy teacher",
      interests: ["meditation", "poetry", "stargazing"],
      quirk: "I journal every night and have done so for 5 years",
      conversationStyle: "deep",
    },
    {
      id: "flirty-m",
      name: "Leo",
      type: "Playful Banter",
      description: "Practice fun conversation",
      avatar: "/friendly-young-man-portrait-warm-smile.jpg",
      personality: "Witty and charming",
      occupation: "Chef",
      interests: ["salsa dancing", "comedy shows", "wine tasting"],
      quirk: "I'll cook dinner for you on the third date, it's kind of my thing",
      conversationStyle: "flirty",
    },
  ]

  const femaleBots = [
    {
      id: "casual-f",
      name: "Zoe",
      type: "Casual Chatter",
      description: "Practice everyday small talk",
      avatar: "/casual-friendly-young-woman-smiling.jpg",
      personality: "Easygoing and fun",
      occupation: "Fitness instructor",
      interests: ["brunch culture", "true crime podcasts", "beach days"],
      quirk: "I have a ranking system for every coffee shop I've been to",
      conversationStyle: "casual",
    },
    {
      id: "deep-f",
      name: "Luna",
      type: "Deep Diver",
      description: "Meaningful conversation practice",
      avatar: "/confident-woman-portrait-casual-friendly.jpg",
      personality: "Introspective and genuine",
      occupation: "Therapist in training",
      interests: ["psychology", "journaling", "indie films"],
      quirk: "I believe everyone has a story worth hearing",
      conversationStyle: "deep",
    },
    {
      id: "flirty-f",
      name: "Ava",
      type: "Playful Banter",
      description: "Practice fun conversation",
      avatar: "/friendly-young-woman-portrait-warm-smile.jpg",
      personality: "Flirty and confident",
      occupation: "Event planner",
      interests: ["rooftop bars", "spontaneous trips", "fashion"],
      quirk: "I've never said no to an adventure, which has led to some great stories",
      conversationStyle: "flirty",
    },
  ]

  if (interestedIn === "men") return maleBots
  if (interestedIn === "women") return femaleBots
  // For "everyone", return a mix
  return [maleBots[0], femaleBots[1], maleBots[2]]
}

export default function MyAISection({ userProfile, onUpdateProfile }: MyAISectionProps) {
  const [selectedBot, setSelectedBot] = useState<ReturnType<typeof getTrainingBots>[0] | null>(null)
  const [conversationCount, setConversationCount] = useState(1)

  const trainingBots = getTrainingBots(userProfile.interestedIn || "everyone")

  if (selectedBot) {
    return (
      <TrainingBotChat
        bot={selectedBot}
        userProfile={userProfile}
        onBack={() => setSelectedBot(null)}
        onComplete={(newTraits, newTextPatterns) => {
          setConversationCount((prev) => prev + 1)
          onUpdateProfile({
            learnedTraits: [...new Set([...userProfile.learnedTraits, ...newTraits])],
            ...(newTextPatterns && { textPatterns: newTextPatterns }),
          })
          setSelectedBot(null)
        }}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-6 py-6 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{userProfile.name}'s AI</h1>
            <p className="text-sm text-muted-foreground">Learning your conversation style</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* AI Status Card */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-card-foreground">AI Training Progress</h2>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-medium">Active</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Conversations completed</span>
              <span className="font-medium text-foreground">{conversationCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Traits learned</span>
              <span className="font-medium text-foreground">{userProfile.learnedTraits.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(conversationCount * 20, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {conversationCount < 5
                ? `${5 - conversationCount} more conversations to optimize your AI`
                : "Your AI is well-trained!"}
            </p>
          </div>
        </div>

        {/* Learned Traits */}
        {userProfile.learnedTraits.length > 0 && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="font-semibold text-card-foreground mb-3">What Your AI Knows</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.learnedTraits.map((trait, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm">
                  {trait}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Your AI will only share information you have provided</p>
          </div>
        )}

        {userProfile.textPatterns && (
          <div className="bg-card rounded-2xl p-5 border border-border">
            <h2 className="font-semibold text-card-foreground mb-3">Your Texting Style</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Laugh style</span>
                <span className="font-medium text-foreground">{userProfile.textPatterns.laughStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Message length</span>
                <span className="font-medium text-foreground capitalize">
                  {userProfile.textPatterns.averageMessageLength}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Punctuation</span>
                <span className="font-medium text-foreground capitalize">
                  {userProfile.textPatterns.punctuationStyle}
                </span>
              </div>
              {userProfile.textPatterns.usesAllCaps && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style</span>
                  <span className="font-medium text-foreground">Uses CAPS for emphasis</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Training Bots Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Continue Training</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Chat with AI bots who have their own personalities. See how you naturally respond to different people!
          </p>

          <div className="space-y-3">
            {trainingBots.map((bot) => (
              <button
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className="w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-4 hover:border-primary/50 transition-colors text-left"
              >
                <img
                  src={bot.avatar || "/placeholder.svg"}
                  alt={bot.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-card-foreground">{bot.name}</p>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs flex items-center gap-1">
                      <Bot className="w-3 h-3" /> {bot.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{bot.occupation}</p>
                  <p className="text-xs text-muted-foreground truncate">{bot.quirk}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Tip: Be yourself!</p>
            <p className="text-xs text-muted-foreground">
              The bots have their own interests and will share about themselves too. Respond naturally!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
