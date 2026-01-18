"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, Info } from "lucide-react"
import type { UserProfile } from "@/app/page"

interface Message {
  id: string
  text: string
  sender: "ai" | "user"
  timestamp: Date
}

interface BotProfile {
  id: string
  name: string
  type: string
  avatar: string
  personality: string
  occupation: string
  interests: string[]
  quirk: string
  conversationStyle: string
}

interface TrainingBotChatProps {
  bot: BotProfile
  userProfile: UserProfile
  onBack: () => void
  onComplete: (learnedTraits: string[], textPatterns?: UserProfile["textPatterns"]) => void
}

export default function TrainingBotChat({ bot, userProfile, onBack, onComplete }: TrainingBotChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStage, setConversationStage] = useState(0)
  const [learnedTraits, setLearnedTraits] = useState<string[]>([])
  const [textPatterns, setTextPatterns] = useState<UserProfile["textPatterns"]>(
    userProfile.textPatterns || {
      usesAllCaps: false,
      laughStyle: "haha",
      emojiFrequency: "low",
      punctuationStyle: "normal",
      averageMessageLength: "medium",
      responseSpeed: "thoughtful",
    },
  )
  const [hasInitialized, setHasInitialized] = useState(false)
  const [userResponses, setUserResponses] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getConversationFlow = useCallback(() => {
    const casual = [
      {
        getMessage: () => `Hey! I'm ${bot.name}. ${bot.quirk} So what's your deal? What do you do?`,
      },
      {
        getMessage: (prev: string) => {
          const response = prev.toLowerCase()
          if (response.includes("work") || response.includes("job")) {
            return `Oh nice! I'm a ${bot.occupation} myself. It's pretty chill. So like, what do you do for fun when you're not working?`
          }
          return `Cool cool. I'm a ${bot.occupation} btw. Anyway what do you usually do on weekends?`
        },
      },
      {
        getMessage: (prev: string) => {
          const hasEnthusiasm = prev.includes("!") || prev.length > 40
          const botInterest = bot.interests[0]
          if (hasEnthusiasm) {
            return `That sounds fun! I've been really into ${botInterest} lately. Like ${botInterest === "music festivals" ? "went to this local show last week and it was so good" : botInterest === "brunch culture" ? "found this amazing spot with the best avocado toast" : "it's become kind of my thing"}. You into anything like that?`
          }
          return `Yeah makes sense. I've been getting into ${botInterest} recently. ${botInterest === "music festivals" ? "Any music recs?" : "What about you, any new hobbies?"}`
        },
      },
      {
        getMessage: (prev: string) => {
          const userMentioned = prev.toLowerCase()
          if (userProfile.interests.length > 0 && userMentioned.includes(userProfile.interests[0].toLowerCase())) {
            return `Oh wait you're into ${userProfile.interests[0]} too? That's sick. What got you into it?`
          }
          return `Hmm interesting. Random question - ${bot.interests[1] === "true crime podcasts" ? "you listen to any podcasts? I'm lowkey obsessed with true crime ones" : bot.interests[1] === "documentaries" ? "watch any good shows lately? I've been binging documentaries" : "what's something random you've been into lately?"}`
        },
      },
      {
        getMessage: () =>
          `This has been fun! I feel like your AI is getting a good sense of how you text. Wanna wrap up?`,
      },
    ]

    const deep = [
      {
        getMessage: () =>
          `Hi ${userProfile.name}. I'm ${bot.name}. ${bot.quirk} I find the way people communicate says a lot about them. What's something that's been on your mind lately?`,
      },
      {
        getMessage: (prev: string) => {
          const isThoughtful = prev.length > 50 || prev.includes("think") || prev.includes("feel")
          if (isThoughtful) {
            return `I appreciate you sharing that. It's interesting how our thoughts shape our experience. For me, ${bot.interests[0]} has become a way to process things. Do you have something like that - an outlet?`
          }
          return `That's valid. Sometimes the simple answers hold the most truth. I've found ${bot.interests[0]} helps me stay grounded. What helps you when you need to reset?`
        },
      },
      {
        getMessage: () =>
          `Being a ${bot.occupation}, I think a lot about what makes people connect. ${bot.interests[1] === "poetry" ? "Poetry helps me articulate feelings words usually can't capture" : bot.interests[1] === "psychology" ? "The 'why' behind human behavior fascinates me" : "Understanding people never gets old"}. When you're getting to know someone, what matters most to you?`,
      },
      {
        getMessage: (prev: string) => {
          if (userProfile.prompts[0]) {
            return `That resonates with me. I noticed you wrote about "${userProfile.prompts[0].answer.slice(0, 40)}..." I'd love to understand what that means to you.`
          }
          return prev.split(" ").length > 12
            ? `That's a thoughtful perspective. What experiences led you to that view?`
            : `I appreciate that honesty. What's something you value that others often overlook?`
        },
      },
      {
        getMessage: () =>
          `${userProfile.name}, this has been a meaningful conversation. Your AI has learned a lot about how you engage with depth. Thank you for being genuine.`,
      },
    ]

    const flirty = [
      {
        getMessage: () =>
          `Well hello ${userProfile.name}! I'm ${bot.name}. ${bot.quirk} So tell me - what's your go-to for a fun night out?`,
      },
      {
        getMessage: (prev: string) => {
          const isPlayful =
            prev.includes("!") || prev.toLowerCase().includes("haha") || prev.toLowerCase().includes("lol")
          if (isPlayful) {
            return `Ha I like your energy! So I'm a ${bot.occupation} which means ${bot.occupation === "Chef" ? "I can definitely cook - third date material right there" : bot.occupation === "Event planner" ? "I know all the best spots. Just saying" : "I've got some good stories"}. What's the most spontaneous thing you've done recently?`
          }
          return `Playing it cool, I see. I can respect that. So what's something unexpected about you? First impressions are boring.`
        },
      },
      {
        getMessage: () => {
          if (bot.interests[0] === "salsa dancing") {
            return "Quick fire round: dancing - yes or absolutely not? No judgment... okay maybe a little"
          } else if (bot.interests[0] === "rooftop bars") {
            return "Quick fire round: rooftop drinks at sunset - overrated or underrated? Be honest"
          }
          return "Quick fire round: what's your ideal Friday night? And saying 'depends' is cheating"
        },
      },
      {
        getMessage: (prev: string) => {
          const engagingBack = prev.includes("?") || prev.includes("!") || prev.length > 25
          if (engagingBack) {
            return userProfile.location
              ? `Okay we might actually vibe. What's a hidden gem in ${userProfile.location}? I'm always looking for insider tips`
              : `Okay we might actually vibe. What's your idea of a perfect first date? For research purposes obviously`
          }
          return `You're making me work for it huh? I can appreciate that. Seriously though, best spot in the city - go`
        },
      },
      {
        getMessage: () =>
          `This has been fun! Your AI is definitely picking up on your... let's call it "charm." Ready to wrap up?`,
      },
    ]

    switch (bot.conversationStyle) {
      case "deep":
        return deep
      case "flirty":
        return flirty
      default:
        return casual
    }
  }, [bot, userProfile])

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      const flow = getConversationFlow()
      setTimeout(() => {
        addAIMessage(flow[0].getMessage())
      }, 800)
    }
  }, [hasInitialized, getConversationFlow])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addAIMessage = (text: string) => {
    setIsTyping(true)
    const typingDelay = 800 + Math.min(text.length * 15, 1500) + Math.random() * 500

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          sender: "ai",
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
    }, typingDelay)
  }

  const analyzeTextPatterns = (response: string, allResponses: string[]) => {
    const patterns = { ...textPatterns }
    const lowerResponse = response.toLowerCase()
    const wordCount = response.split(/\s+/).length

    // Analyze laugh style
    if (lowerResponse.includes("hahaha") || lowerResponse.includes("HAHAHA")) {
      patterns.laughStyle = response.includes("HAHAHA") ? "HAHAHA" : "hahaha"
    } else if (lowerResponse.includes("haha")) {
      patterns.laughStyle = response.includes("HAHA") ? "HAHA" : "haha"
    } else if (lowerResponse.includes("lolol") || lowerResponse.includes("LOLOL")) {
      patterns.laughStyle = response.includes("LOLOL") ? "LOLOL" : "lolol"
    } else if (lowerResponse.includes("lol")) {
      patterns.laughStyle = response.includes("LOL") ? "LOL" : "lol"
    } else if (lowerResponse.includes("lmao") || lowerResponse.includes("LMAO")) {
      patterns.laughStyle = response.includes("LMAO") ? "LMAO" : "lmao"
    }

    // Check for all caps usage
    const allCapsWords = response.match(/\b[A-Z]{2,}\b/g) || []
    if (allCapsWords.length > 0) {
      patterns.usesAllCaps = true
    }

    // Analyze punctuation style
    const exclamationCount = (response.match(/!/g) || []).length
    const questionCount = (response.match(/\?/g) || []).length
    if (exclamationCount >= 2 || response.includes("!!") || response.includes("???")) {
      patterns.punctuationStyle = "expressive"
    } else if (exclamationCount === 0 && response.length > 30) {
      patterns.punctuationStyle = "minimal"
    }

    // Analyze emoji frequency
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    const emojiCount = (response.match(emojiRegex) || []).length
    if (emojiCount >= 3) {
      patterns.emojiFrequency = "high"
    } else if (emojiCount >= 1) {
      patterns.emojiFrequency = "medium"
    } else {
      patterns.emojiFrequency = "none"
    }

    // Analyze message length based on all responses
    const avgLength =
      [...allResponses, response].reduce((sum, r) => sum + r.split(/\s+/).length, 0) / (allResponses.length + 1)
    if (avgLength < 10) {
      patterns.averageMessageLength = "short"
    } else if (avgLength > 25) {
      patterns.averageMessageLength = "long"
    } else {
      patterns.averageMessageLength = "medium"
    }

    return patterns
  }

  const analyzeResponse = (response: string): string[] => {
    const traits: string[] = []
    const lowerResponse = response.toLowerCase()
    const wordCount = response.split(" ").length

    // Style-specific traits
    if (bot.conversationStyle === "casual") {
      if (response.includes("!")) traits.push("Upbeat texter")
      if (lowerResponse.includes("haha") || lowerResponse.includes("lol") || lowerResponse.includes("lmao")) {
        traits.push("Uses casual humor")
      }
    } else if (bot.conversationStyle === "deep") {
      if (wordCount > 25) traits.push("Thoughtful responder")
      if (lowerResponse.includes("feel") || lowerResponse.includes("think") || lowerResponse.includes("believe")) {
        traits.push("Emotionally articulate")
      }
    } else if (bot.conversationStyle === "flirty") {
      if (response.includes("!")) traits.push("Playful energy")
      if (response.includes("?")) traits.push("Engages with questions")
      if (lowerResponse.includes("haha") || lowerResponse.includes("lol")) traits.push("Lighthearted")
    }

    // General traits
    if (wordCount > 30) traits.push("Detailed writer")
    if (response.includes("?")) traits.push("Curious")
    if (lowerResponse.includes("love") || lowerResponse.includes("obsessed") || lowerResponse.includes("really into")) {
      traits.push("Expresses enthusiasm")
    }
    if (response === response.toLowerCase() && !response.includes("I")) {
      traits.push("Casual capitalization")
    }

    return traits
  }

  const handleSend = () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    const newResponses = [...userResponses, userMessage]
    setUserResponses(newResponses)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ])
    setInput("")

    // Analyze and learn from response
    const newTraits = analyzeResponse(userMessage)
    const newPatterns = analyzeTextPatterns(userMessage, userResponses)

    setLearnedTraits((prev) => [...new Set([...prev, ...newTraits])])
    setTextPatterns(newPatterns)

    // Next response
    const nextStage = conversationStage + 1
    setConversationStage(nextStage)

    const flow = getConversationFlow()
    if (nextStage < flow.length) {
      setTimeout(() => {
        const nextMessage = flow[nextStage].getMessage(userMessage)
        addAIMessage(nextMessage)
      }, 300)
    }
  }

  const isComplete = conversationStage >= 4 && messages.filter((m) => m.sender === "user").length >= 4

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <img src={bot.avatar || "/placeholder.svg"} alt={bot.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-card-foreground">{bot.name}</p>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center gap-1">
              <Bot className="w-3 h-3" /> {bot.type}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{bot.occupation}</p>
        </div>
      </div>

      {/* Training Info Banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{bot.name}</span> - {bot.personality}. Chat naturally and your
          AI will learn your texting style!
        </p>
      </div>

      {/* New Traits Learned */}
      {learnedTraits.length > 0 && (
        <div className="mx-4 mt-3 flex flex-wrap gap-1">
          {learnedTraits.slice(-5).map((trait, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs">
              + {trait}
            </span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border bg-card">
        {isComplete ? (
          <Button
            onClick={() => onComplete(learnedTraits, textPatterns)}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Finish Training Session
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your response..."
              className="flex-1 h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
