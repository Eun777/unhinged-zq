"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "ai" | "user"
  timestamp: Date
}

const aiQuestions = [
  "Hey! 👋 I'm here to help create your perfect dating AI. First, what's your name?",
  "Nice to meet you! So tell me, what are you looking for in a relationship right now?",
  "That's great clarity! What are some things you absolutely love doing in your free time?",
  "Sounds fun! Now, what are some values that are really important to you in a partner?",
  "I love that. Last one - any dealbreakers I should know about?",
  "Perfect! I have everything I need to create your Personal Dating AI. They'll represent you authentically while finding your ideal match. Ready to meet them? ✨",
]

interface OnboardingChatProps {
  onComplete: () => void
}

export default function OnboardingChat({ onComplete }: OnboardingChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial AI message
    setTimeout(() => {
      addAIMessage(aiQuestions[0])
    }, 500)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addAIMessage = (text: string) => {
    setIsTyping(true)
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
    }, 1000)
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input,
        sender: "user",
        timestamp: new Date(),
      },
    ])
    setInput("")

    // Next AI response
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < aiQuestions.length) {
      setCurrentQuestion(nextQuestion)
      setTimeout(() => addAIMessage(aiQuestions[nextQuestion]), 500)
    }
  }

  const isComplete =
    currentQuestion === aiQuestions.length - 1 && messages.filter((m) => m.sender === "user").length >= 5

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-card">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-ai-bubble flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-ai-bubble-foreground" />
        </div>
        <div>
          <p className="font-semibold text-card-foreground">AI Interviewer</p>
          <p className="text-xs text-muted-foreground">Getting to know you</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-user-bubble text-user-bubble-foreground rounded-br-md"
                  : "bg-ai-bubble text-ai-bubble-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-ai-bubble text-ai-bubble-foreground px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-ai-bubble-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-ai-bubble-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-ai-bubble-foreground/50 rounded-full animate-bounce"
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
            onClick={onComplete}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Meet Your Dating AI ✨
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your answer..."
              className="flex-1 h-12 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
