"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import SignUpForm from "@/components/sign-up-form"
import ProfileCreation from "@/components/profile-creation"
import AITrainingChat from "@/components/ai-training-chat"
import MyAISection from "@/components/my-ai-section"
import MatchesScreen from "@/components/matches-screen"
import ChatsScreen from "@/components/chats-screen"
import HumanChat from "@/components/human-chat"
import UserProfileScreen from "@/components/user-profile-screen"
import BottomNav from "@/components/bottom-nav"

type Screen =
  | "welcome"
  | "signup"
  | "create-profile"
  | "training"
  | "my-ai"
  | "matches"
  | "chats"
  | "chat"
  | "user-profile"

export interface UserProfile {
  id?: string
  name: string
  age: number
  location: string
  gender: "man" | "woman" | "non-binary" | ""
  interestedIn: "men" | "women" | "everyone" | ""
  bio: string
  occupation: string
  photos: string[]
  prompts: { question: string; answer: string }[]
  interests: string[]
  lookingFor: string
  dealbreakers: string[]
  textPatterns: {
    usesAllCaps: boolean
    laughStyle: string
    emojiFrequency: "none" | "low" | "medium" | "high"
    punctuationStyle: "minimal" | "normal" | "expressive"
    averageMessageLength: "short" | "medium" | "long"
    responseSpeed: "quick" | "thoughtful"
  }
  conversationStyle: string[]
  learnedTraits: string[]
  aiCorrections?: Array<{
    context: string
    original: string
    corrected: string
    timestamp: Date
  }>
}

export interface LikedMatch {
  id: string
  name: string
  photo: string
  lastMessage?: string
  timestamp?: Date
}

const defaultTextPatterns = {
  usesAllCaps: false,
  laughStyle: "haha",
  emojiFrequency: "low" as const,
  punctuationStyle: "normal" as const,
  averageMessageLength: "medium" as const,
  responseSpeed: "thoughtful" as const,
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [showNav, setShowNav] = useState(false)
  const [currentChatMatch, setCurrentChatMatch] = useState<{
    name: string
    photo: string
  } | null>(null)

  const [likedMatches, setLikedMatches] = useState<LikedMatch[]>([])

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    age: 0,
    location: "",
    gender: "",
    interestedIn: "",
    bio: "",
    occupation: "",
    photos: [],
    prompts: [],
    interests: [],
    lookingFor: "",
    dealbreakers: [],
    textPatterns: defaultTextPatterns,
    conversationStyle: [],
    learnedTraits: [],
  })

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)
    const navScreens: Screen[] = ["my-ai", "matches", "chats", "chat", "user-profile"]
    setShowNav(navScreens.includes(screen))
  }

  const handleStartChat = (matchName: string, matchPhoto: string, matchId?: string) => {
    const newMatch: LikedMatch = {
      id: matchId || `match-${Date.now()}`,
      name: matchName,
      photo: matchPhoto,
      lastMessage: "You matched! Start the conversation...",
      timestamp: new Date(),
    }

    // Add to liked matches if not already there
    setLikedMatches((prev) => {
      const exists = prev.some((m) => m.name === matchName)
      if (exists) return prev
      return [newMatch, ...prev]
    })

    setCurrentChatMatch({ name: matchName, photo: matchPhoto })
    handleNavigate("chat")
  }

  const handleSelectChat = (match: LikedMatch) => {
    setCurrentChatMatch({ name: match.name, photo: match.photo })
    handleNavigate("chat")
  }

  const updateProfile = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen flex flex-col">
        {currentScreen === "welcome" && <WelcomeScreen onGetStarted={() => handleNavigate("signup")} />}
        {currentScreen === "signup" && (
          <SignUpForm
            onComplete={(data) => {
              updateProfile({ ...data, id: `user-${Date.now()}` })
              handleNavigate("create-profile")
            }}
          />
        )}
        {currentScreen === "create-profile" && (
          <ProfileCreation
            profile={userProfile}
            onComplete={(data) => {
              updateProfile(data)
              handleNavigate("training")
            }}
            onBack={() => handleNavigate("signup")}
          />
        )}
        {currentScreen === "training" && (
          <AITrainingChat
            userProfile={userProfile}
            onComplete={(learnedTraits, textPatterns) => {
              updateProfile({ learnedTraits, textPatterns })
              handleNavigate("my-ai")
            }}
          />
        )}
        {currentScreen === "my-ai" && <MyAISection userProfile={userProfile} onUpdateProfile={updateProfile} />}
        {currentScreen === "matches" && <MatchesScreen userProfile={userProfile} onStartChat={handleStartChat} />}
        {currentScreen === "chats" && (
          <ChatsScreen
            likedMatches={likedMatches}
            onSelectChat={handleSelectChat}
            onBackToMatches={() => handleNavigate("matches")}
          />
        )}
        {currentScreen === "chat" && <HumanChat match={currentChatMatch} onBack={() => handleNavigate("chats")} />}
        {currentScreen === "user-profile" && (
          <UserProfileScreen profile={userProfile} onEditProfile={() => handleNavigate("create-profile")} />
        )}

        {showNav && <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />}
      </div>
    </main>
  )
}
