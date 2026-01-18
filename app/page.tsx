"use client"

import { useState, useEffect, useCallback } from "react"
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
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

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

export interface AIConversationMessage {
  sender: "user_ai" | "match_ai"
  text: string
  timestamp: string
  isAIGuess?: boolean
  originalText?: string
  correctedText?: string
}

export interface LikedMatch {
  id: string
  name: string
  photo: string
  lastMessage?: string
  timestamp?: Date
  aiConversation?: AIConversationMessage[]
}

const defaultTextPatterns = {
  usesAllCaps: false,
  laughStyle: "haha",
  emojiFrequency: "low" as const,
  punctuationStyle: "normal" as const,
  averageMessageLength: "medium" as const,
  responseSpeed: "thoughtful" as const,
}

const defaultProfile: UserProfile = {
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
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [showNav, setShowNav] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentChatMatch, setCurrentChatMatch] = useState<{
    name: string
    photo: string
    aiConversation?: AIConversationMessage[]
  } | null>(null)

  const [likedMatches, setLikedMatches] = useState<LikedMatch[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)

  const supabase = createClient()

  // Load existing user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Load profile from database
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profile) {
            setUserProfile({
              id: profile.id,
              name: profile.name || "",
              age: profile.age || 0,
              location: profile.location || "",
              gender: profile.gender || "",
              interestedIn: profile.interested_in || "",
              bio: profile.bio || "",
              occupation: profile.occupation || "",
              photos: profile.photos || [],
              prompts: profile.prompts || [],
              interests: profile.interests || [],
              lookingFor: profile.looking_for || "",
              dealbreakers: profile.dealbreakers || [],
              textPatterns: profile.text_patterns || defaultTextPatterns,
              conversationStyle: profile.conversation_style || [],
              learnedTraits: profile.learned_traits || [],
              aiCorrections: profile.ai_corrections || [],
            })
            setCurrentScreen("my-ai")
            setShowNav(true)
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [supabase])

  // Save profile to database
  const saveProfileToDatabase = useCallback(async (profile: UserProfile) => {
    if (!profile.id) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const profileData = {
        id: user?.id || profile.id,
        user_id: profile.id,
        name: profile.name,
        age: profile.age,
        location: profile.location,
        gender: profile.gender,
        interested_in: profile.interestedIn,
        bio: profile.bio,
        occupation: profile.occupation,
        photos: profile.photos,
        prompts: profile.prompts,
        interests: profile.interests,
        looking_for: profile.lookingFor,
        dealbreakers: profile.dealbreakers,
        text_patterns: profile.textPatterns,
        conversation_style: profile.conversationStyle,
        learned_traits: profile.learnedTraits,
        ai_corrections: profile.aiCorrections,
        updated_at: new Date().toISOString(),
      }

      await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" })
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }, [supabase])

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)
    const navScreens: Screen[] = ["my-ai", "matches", "chats", "chat", "user-profile"]
    setShowNav(navScreens.includes(screen))
  }

  const handleLogin = async (userId: string) => {
    setIsLoading(true)
    
    try {
      if (userId) {
        // User ID login - load profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single()

        if (profile) {
          setUserProfile({
            id: profile.id,
            name: profile.name || "",
            age: profile.age || 0,
            location: profile.location || "",
            gender: profile.gender || "",
            interestedIn: profile.interested_in || "",
            bio: profile.bio || "",
            occupation: profile.occupation || "",
            photos: profile.photos || [],
            prompts: profile.prompts || [],
            interests: profile.interests || [],
            lookingFor: profile.looking_for || "",
            dealbreakers: profile.dealbreakers || [],
            textPatterns: profile.text_patterns || defaultTextPatterns,
            conversationStyle: profile.conversation_style || [],
            learnedTraits: profile.learned_traits || [],
            aiCorrections: profile.ai_corrections || [],
          })
          handleNavigate("my-ai")
        }
      } else {
        // Email login - profile loaded via auth listener
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profile) {
            setUserProfile({
              id: profile.id,
              name: profile.name || "",
              age: profile.age || 0,
              location: profile.location || "",
              gender: profile.gender || "",
              interestedIn: profile.interested_in || "",
              bio: profile.bio || "",
              occupation: profile.occupation || "",
              photos: profile.photos || [],
              prompts: profile.prompts || [],
              interests: profile.interests || [],
              lookingFor: profile.looking_for || "",
              dealbreakers: profile.dealbreakers || [],
              textPatterns: profile.text_patterns || defaultTextPatterns,
              conversationStyle: profile.conversation_style || [],
              learnedTraits: profile.learned_traits || [],
              aiCorrections: profile.ai_corrections || [],
            })
            handleNavigate("my-ai")
          }
        }
      }
    } catch (error) {
      console.error("Error during login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartChat = (matchName: string, matchPhoto: string, matchId?: string, aiConversation?: AIConversationMessage[]) => {
    const newMatch: LikedMatch = {
      id: matchId || `match-${Date.now()}`,
      name: matchName,
      photo: matchPhoto,
      lastMessage: "You matched! Start the conversation...",
      timestamp: new Date(),
      aiConversation: aiConversation,
    }

    // Add to liked matches if not already there
    setLikedMatches((prev) => {
      const exists = prev.some((m) => m.name === matchName)
      if (exists) return prev
      return [newMatch, ...prev]
    })

    setCurrentChatMatch({ name: matchName, photo: matchPhoto, aiConversation: aiConversation })
    handleNavigate("chat")
  }

  const handleSelectChat = (match: LikedMatch) => {
    setCurrentChatMatch({ name: match.name, photo: match.photo })
    handleNavigate("chat")
  }

  const updateProfile = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...data }
      // Save to database whenever profile is updated
      saveProfileToDatabase(updated)
      return updated
    })
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen flex flex-col">
        {currentScreen === "welcome" && <WelcomeScreen onGetStarted={() => handleNavigate("signup")} />}
        {currentScreen === "signup" && (
          <SignUpForm
            onComplete={(data) => {
              updateProfile(data)
              handleNavigate("create-profile")
            }}
            onLogin={handleLogin}
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
