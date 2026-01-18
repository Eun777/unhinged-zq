"use client"

import { Heart, MessageCircle, Sparkles } from "lucide-react"
import type { LikedMatch } from "@/app/page"

interface ChatsScreenProps {
  likedMatches: LikedMatch[]
  onSelectChat: (match: LikedMatch) => void
  onBackToMatches: () => void
}

export default function ChatsScreen({ likedMatches, onSelectChat, onBackToMatches }: ChatsScreenProps) {
  if (likedMatches.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-background pb-20">
        {/* Header */}
        <div className="px-6 py-4 bg-card border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No chats yet</h2>
            <p className="text-muted-foreground mb-6">Like someone on the Dates tab to start chatting!</p>
            <button
              onClick={onBackToMatches}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
            >
              <Heart className="w-5 h-5" />
              Find Matches
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
          <span className="text-sm text-muted-foreground">{likedMatches.length} matches</span>
        </div>
      </div>

      {/* Matches Banner */}
      <div className="px-4 py-3 bg-card/50 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Your matches are waiting to chat!</span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {likedMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectChat(match)}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors border-b border-border"
          >
            {/* Avatar */}
            {match.photo ? (
              <img
                src={match.photo || "/placeholder.svg"}
                alt={match.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xl font-semibold text-foreground">{match.name.charAt(0).toUpperCase()}</span>
              </div>
            )}

            {/* Chat Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground truncate">{match.name}</h3>
                {match.timestamp && (
                  <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(match.timestamp)}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {match.lastMessage || "Start the conversation..."}
              </p>
            </div>

            {/* New indicator */}
            <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
