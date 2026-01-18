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

interface AITrainingChatProps {
  userProfile: UserProfile
  onComplete: (learnedTraits: string[], textPatterns?: UserProfile["textPatterns"]) => void
}

const getBotForUser = (interestedIn: string) => {
  const maleBots = [
    {
      name: "Marcus",
      age: 26,
      avatar: "/friendly-young-man-portrait-warm-smile.jpg",
      personality: "Creative and adventurous",
      occupation: "Graphic designer",
      interests: ["hiking", "photography", "trying new restaurants"],
      quirk: "I'm obsessed with finding the best coffee spots wherever I go",
    },
    {
      name: "James",
      age: 28,
      avatar: "/confident-man-portrait-casual-friendly.jpg",
      personality: "Witty and thoughtful",
      occupation: "Software engineer",
      interests: ["music", "cooking", "board games"],
      quirk: "I have a collection of vintage records that I'm weirdly proud of",
    },
  ]

  const femaleBots = [
    {
      name: "Sofia",
      age: 25,
      avatar: "/friendly-young-woman-portrait-warm-smile.jpg",
      personality: "Warm and curious",
      occupation: "UX researcher",
      interests: ["yoga", "reading", "live music"],
      quirk: "I always have a book recommendation ready for literally any situation",
    },
    {
      name: "Maya",
      age: 27,
      avatar: "/confident-woman-portrait-casual-friendly.jpg",
      personality: "Playful and genuine",
      occupation: "Marketing manager",
      interests: ["travel", "cooking", "art galleries"],
      quirk: "I take way too many food photos but never post them",
    },
  ]

  if (interestedIn === "men") return maleBots[Math.floor(Math.random() * maleBots.length)]
  if (interestedIn === "women") return femaleBots[Math.floor(Math.random() * femaleBots.length)]
  // For "everyone", randomly pick
  const allBots = [...maleBots, ...femaleBots]
  return allBots[Math.floor(Math.random() * allBots.length)]
}

export default function AITrainingChat({ userProfile, onComplete }: AITrainingChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentBot] = useState(() => getBotForUser(userProfile.interestedIn || "everyone"))
  const [conversationStage, setConversationStage] = useState(0)
  const [learnedTraits, setLearnedTraits] = useState<string[]>([])
  const [userResponses, setUserResponses] = useState<string[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const laugh = "😄"
  const exclaim = "!"

  const getConversationFlow = useCallback(() => {
    return [
      {
        type: "opener",
        getMessage: () =>
          `Hey ${userProfile.name}! I'm ${currentBot.name}, ${currentBot.age}. ${currentBot.quirk} What about you - what's your thing?`,
      },
      {
        type: "deeper_work_question",
        getMessage: (prevResponse: string) => {
          const hasExcitement =
            prevResponse.includes("!") || prevResponse.includes("love") || prevResponse.includes("passion")
          const responseLength = prevResponse.split(" ").length

          if (responseLength < 8) {
            return `Interesting! What made you get into that specifically?`
          } else if (hasExcitement) {
            return `Okay I can tell you're genuinely into it! ${laugh} That's honestly refreshing. What do you love most about it?`
          } else {
            return `Got it. So how long have you been doing that? Do you enjoy it?`
          }
        },
      },
      {
        type: "share_weekend_story",
        getMessage: (prevResponse: string) => {
          const userSeemsChill =
            prevResponse.toLowerCase().includes("chill") || prevResponse.toLowerCase().includes("relax")
          const userSeemsPassionate =
            prevResponse.includes("!") ||
            prevResponse.toLowerCase().includes("really") ||
            prevResponse.toLowerCase().includes("love")

          if (currentBot.interests.includes("hiking")) {
            return `That's cool. So last weekend I went on this hike and literally got lost for like an hour ${laugh} but the views were insane so worth it. What about you - what's a perfect weekend look like for you?`
          } else if (currentBot.interests.includes("photography")) {
            return `Nice${exclaim} I spent my whole Sunday just walking around ${userProfile.location || "the city"} taking photos. Found this alley with incredible light. Do you have any weekend rituals or things you always do?`
          } else if (currentBot.interests.includes("cooking")) {
            return `I feel that. I usually spend Saturdays experimenting with new recipes. Last week I tried making ramen from scratch... took 6 hours but was actually fire ${laugh} What do your weekends usually look like?`
          } else if (currentBot.interests.includes("yoga") || currentBot.interests.includes("reading")) {
            return `I totally get that. My ideal weekend is honestly just yoga in the morning, brunch, then reading for hours. Super chill but it recharges me. What recharges you?`
          } else {
            return `That's dope. I'm usually ${currentBot.interests[0]} or discovering new ${currentBot.interests[1]} spots around town. What's your ideal weekend vibe?`
          }
        },
      },
      {
        type: "opinion_question",
        getMessage: (prevResponse: string) => {
          const lowerResponse = prevResponse.toLowerCase()
          const isActive =
            lowerResponse.includes("out") || lowerResponse.includes("explore") || lowerResponse.includes("go")
          const isChill =
            lowerResponse.includes("home") || lowerResponse.includes("relax") || lowerResponse.includes("chill")

          let reaction = ""
          if (isActive) {
            reaction = "Okay I love the adventurous energy!"
          } else if (isChill) {
            reaction = "Honestly same, staying in is underrated."
          } else {
            reaction = "Nice, good balance."
          }

          // Ask different opinion questions based on profile
          if (userProfile.interests.includes("Travel") || userProfile.interests.includes("Hiking")) {
            return `${reaction} Quick q - if you could teleport anywhere right now for a week, where would you go and why?`
          } else if (userProfile.interests.includes("Cooking") || userProfile.interests.includes("Coffee")) {
            return `${reaction} Random but important question - are you more of a cook-at-home person or love finding new restaurants? I'm always hunting for hidden gems.`
          } else if (userProfile.interests.includes("Music") || userProfile.interests.includes("Art")) {
            return `${reaction} Okay here's a random one - concerts or museums? Like if you had to pick one for the rest of your life?`
          } else {
            return `${reaction} Here's a random q - morning person or night owl? I feel like this says a lot about someone ${laugh}`
          }
        },
      },
      {
        type: "react_and_share",
        getMessage: (prevResponse: string) => {
          const responseLength = prevResponse.split(" ").length
          const hasReasoning = prevResponse.includes("because") || prevResponse.includes("since") || responseLength > 15

          if (hasReasoning) {
            return `Okay I actually love that answer. You really thought about it${exclaim} For me, ${currentBot.interests[0]} is non-negotiable - it's like my therapy ${laugh} What's something you're weirdly picky about?`
          } else {
            return `Fair${exclaim} I can respect that. Me, I'm probably too into ${currentBot.interests[0]} ${laugh} my friends roast me for it. What's something your friends would roast you about?`
          }
        },
      },
      {
        type: "values_question",
        getMessage: (prevResponse: string) => {
          if (userProfile.prompts[0]) {
            const prompt = userProfile.prompts[0]
            return `${laugh} okay that's funny though. So I saw on your profile you said "${prompt.answer.slice(0, 50)}${prompt.answer.length > 50 ? "..." : ""}" - I'm curious what's the story behind that?`
          } else {
            return `${laugh} honestly relatable. Real talk though - what matters most to you in the people you surround yourself with?`
          }
        },
      },
      {
        type: "deep_follow_up",
        getMessage: (prevResponse: string) => {
          const lowerResponse = prevResponse.toLowerCase()
          const valuesAuthenticity =
            lowerResponse.includes("real") || lowerResponse.includes("honest") || lowerResponse.includes("genuine")
          const valuesAdventure =
            lowerResponse.includes("fun") || lowerResponse.includes("adventure") || lowerResponse.includes("spontan")
          const valuesDepth =
            lowerResponse.includes("deep") || lowerResponse.includes("meaning") || lowerResponse.includes("connect")

          if (valuesAuthenticity) {
            return `Okay yes. Authenticity is everything honestly. I feel like so many people just play roles, you know? It's refreshing when someone's just... themselves. Do you think you're good at reading people?`
          } else if (valuesAdventure) {
            return `I'm the same way${exclaim} Life's too short to be boring honestly. What's the most spontaneous thing you've done recently?`
          } else if (valuesDepth) {
            return `Real connection is rare these days. I appreciate people who can actually go deep, not just surface level small talk. What's something you think about a lot that most people don't?`
          } else {
            return `I feel that. Those are important qualities. What's something about you that people usually don't get right away?`
          }
        },
      },
      {
        type: "compatibility_question",
        getMessage: (prevResponse: string) => {
          const thoughtfulResponse = prevResponse.split(" ").length > 15
          if (thoughtfulResponse) {
            return `Okay that's actually really interesting. I like how you think about stuff${exclaim} Quick q - what's like a green flag for you? Something that immediately makes you interested in someone?`
          } else {
            return `I can see that. So what's something that's like an instant green flag for you in someone?`
          }
        },
      },
      {
        type: "date_preferences",
        getMessage: (prevResponse: string) => {
          return `Oh interesting${exclaim} For me it's when someone actually listens and remembers small details you mentioned. Shows they actually care. Okay last q - dream first date, what does that look like for you?`
        },
      },
      {
        type: "closing",
        getMessage: (prevResponse: string) => {
          const mentionsFood =
            prevResponse.toLowerCase().includes("dinner") ||
            prevResponse.toLowerCase().includes("coffee") ||
            prevResponse.toLowerCase().includes("food")
          const mentionsActivity =
            prevResponse.toLowerCase().includes("walk") ||
            prevResponse.toLowerCase().includes("museum") ||
            prevResponse.toLowerCase().includes("explore")

          if (mentionsFood) {
            return `${laugh} okay that sounds perfect honestly. I'd be down. This has been really nice chatting with you${exclaim} I feel like I got a good sense of your vibe. Your AI is definitely learning from this. Want to keep training with more bots so it gets even better?`
          } else if (mentionsActivity) {
            return `Okay I love that energy. Way better than just drinks imo. This conversation's been great${exclaim} Your AI is picking up on how you communicate. Ready to train more with different personalities?`
          } else {
            return `That could be fun${exclaim} I've enjoyed getting to know you through this. Your AI is learning your style and what matters to you. Want to keep training so it represents you even better?`
          }
        },
      },
    ]
  }, [currentBot, userProfile, laugh, exclaim])

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
    setTimeout(
      () => {
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
      },
      1000 + Math.random() * 800,
    )
  }

  const analyzeResponse = (response: string, allResponses: string[]): string[] => {
    const traits: string[] = []
    const lowerResponse = response.toLowerCase()
    const wordCount = response.split(" ").length
    const responseCount = allResponses.length

    if (wordCount > 30) traits.push("Detailed communicator")
    else if (wordCount > 20) traits.push("Thoughtful responder")
    else if (wordCount < 10 && responseCount > 2) traits.push("Concise texter")

    if (response.includes("!!") || (response.match(/!/g) || []).length >= 2) traits.push("Very expressive")
    else if (response.includes("!")) traits.push("Enthusiastic")

    if (response.includes("?") && !lowerResponse.includes("what about you")) traits.push("Asks questions back")

    if (
      lowerResponse.includes("haha") ||
      lowerResponse.includes("lol") ||
      lowerResponse.includes("lmao") ||
      lowerResponse.includes("😂")
    ) {
      if (lowerResponse.includes("hahaha") || lowerResponse.includes("lolol") || lowerResponse.includes("lmaooo")) {
        traits.push("Laughs a lot in texts")
      } else {
        traits.push("Uses humor")
      }
    }

    if (lowerResponse.includes("love") || lowerResponse.includes("obsessed") || lowerResponse.includes("passion")) {
      traits.push("Passionate communicator")
    }

    if (
      lowerResponse.includes("honestly") ||
      lowerResponse.includes("i think") ||
      lowerResponse.includes("i feel") ||
      lowerResponse.includes("personally")
    ) {
      traits.push("Reflective & authentic")
    }

    if (
      lowerResponse.includes("interesting") ||
      lowerResponse.includes("curious") ||
      lowerResponse.includes("wonder")
    ) {
      traits.push("Intellectually curious")
    }

    if (
      wordCount > 25 &&
      (lowerResponse.includes("because") || lowerResponse.includes("since") || lowerResponse.includes("so"))
    ) {
      traits.push("Explains reasoning")
    }

    if (lowerResponse.includes("like") && (response.match(/like/gi) || []).length >= 3 && wordCount < 30) {
      traits.push("Casual speech style")
    }

    return traits
  }

  const analyzeTextPatterns = (response: string, allResponses: string[]) => {
    const patterns = { ...textPatterns }
    const lowerResponse = response.toLowerCase()

    // Analyze laugh style
    if (lowerResponse.includes("hahaha") || response.includes("HAHAHA")) {
      patterns.laughStyle = response.includes("HAHAHA") ? "HAHAHA" : "hahaha"
    } else if (lowerResponse.includes("haha")) {
      patterns.laughStyle = response.includes("HAHA") ? "HAHA" : "haha"
    } else if (lowerResponse.includes("lolol")) {
      patterns.laughStyle = response.includes("LOLOL") ? "LOLOL" : "lolol"
    } else if (lowerResponse.includes("lol")) {
      patterns.laughStyle = response.includes("LOL") ? "LOL" : "lol"
    } else if (lowerResponse.includes("lmao")) {
      patterns.laughStyle = response.includes("LMAO") ? "LMAO" : "lmao"
    }

    // Check for all caps usage
    const allCapsWords = response.match(/\b[A-Z]{2,}\b/g) || []
    if (allCapsWords.length > 0) {
      patterns.usesAllCaps = true
    }

    // Analyze punctuation style
    const exclamationCount = (response.match(/!/g) || []).length
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

    // Analyze message length
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

  const handleSend = () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()

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
    const newResponses = [...userResponses, userMessage]
    setUserResponses(newResponses)

    const newTraits = analyzeResponse(userMessage, userResponses)
    setLearnedTraits((prev) => [...new Set([...prev, ...newTraits])])

    const newPatterns = analyzeTextPatterns(userMessage, userResponses)
    setTextPatterns(newPatterns)

    const nextStage = conversationStage + 1
    setConversationStage(nextStage)

    const flow = getConversationFlow()
    if (nextStage < flow.length) {
      setTimeout(() => {
        const nextMessage = flow[nextStage].getMessage(userMessage)
        addAIMessage(nextMessage)
      }, 500)
    }
  }

  const isComplete = conversationStage >= 9 && messages.filter((m) => m.sender === "user").length >= 9

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <img
          src={currentBot.avatar || "/placeholder.svg"}
          alt={currentBot.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-card-foreground">
              {currentBot.name}, {currentBot.age}
            </p>
            <span className="px-2 py-0.5 rounded-full bg-ai-bubble text-ai-bubble-foreground text-xs font-medium flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Bot
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{currentBot.personality}</p>
        </div>
      </div>

      <div className="mx-4 mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Training Mode</p>
          <p className="text-xs text-muted-foreground">
            Chat naturally with {currentBot.name}! Your AI learns how you communicate - it will never make up info about
            you.
          </p>
        </div>
      </div>

      {learnedTraits.length > 0 && (
        <div className="mx-4 mt-3 flex flex-wrap gap-1">
          {learnedTraits.slice(0, 4).map((trait, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs">
              {trait}
            </span>
          ))}
        </div>
      )}

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

      <div className="px-4 py-4 border-t border-border bg-card">
        {isComplete ? (
          <Button
            onClick={() => onComplete(learnedTraits, textPatterns)}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Continue to My AI
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
