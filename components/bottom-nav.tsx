"use client"

import { Sparkles, Heart, MessageCircle, User } from "lucide-react"

interface BottomNavProps {
  currentScreen: string
  onNavigate: (screen: "my-ai" | "matches" | "chats" | "chat" | "user-profile") => void
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: "matches", icon: Heart, label: "Dates" },
    { id: "chats", icon: MessageCircle, label: "Chats" },
    { id: "my-ai", icon: Sparkles, label: "My AI" },
    { id: "user-profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || (item.id === "chats" && currentScreen === "chat")
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as "my-ai" | "matches" | "chats" | "chat" | "user-profile")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
