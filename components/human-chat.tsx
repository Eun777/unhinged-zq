"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Phone, Video, MoreVertical, Sparkles, Info } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "me" | "them"
  timestamp: Date
}

interface HumanChatProps {
  match: {
    name: string
    photo: string
  } | null
  onBack?: () => void
}

export default function HumanChat({ match, onBack }: HumanChatProps) {
  const matchName = match?.name || "Match"
  const matchInitial = matchName.charAt(0).toUpperCase()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hey! So excited we matched! Our AIs really hit it off haha`,
      sender: "them",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      text: "I know right! I read the conversation and we seem to have a lot in common",
      sender: "me",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      text: "We should definitely hang out sometime! What are you up to this weekend?",
      sender: "them",
      timestamp: new Date(Date.now() - 180000),
    },
  ])
  const [input, setInput] = useState("")
  const [showTip, setShowTip] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input,
        sender: "me",
        timestamp: new Date(),
      },
    ])
    setInput("")
    setShowTip(false)
  }

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          {match?.photo ? (
            <img
              src={match.photo || "/placeholder.svg"}
              alt={matchName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">{matchInitial}</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-card-foreground">{matchName}</p>
            <p className="text-xs text-success">Online now</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <Video className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Human Chat Banner */}
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-success/10 border border-success/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-success" />
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Human-to-human chat</span> — No AI involved. Be yourself!
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Tip */}
      {showTip && (
        <div className="mx-4 mb-2 p-3 rounded-2xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Conversation tip:</span> Ask about their interests you read
              in the AI conversation!
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
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
      </div>
    </div>
  )
}
