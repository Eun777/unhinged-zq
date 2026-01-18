"use client"

import { Button } from "@/components/ui/button"
import { Camera, Edit2, MapPin, Briefcase, Settings, LogOut, ChevronRight } from "lucide-react"
import type { UserProfile } from "@/app/page"

interface UserProfileScreenProps {
  profile: UserProfile
  onEditProfile: () => void
}

export default function UserProfileScreen({ profile, onEditProfile }: UserProfileScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header with Photo */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-primary/30 to-accent/30" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-muted overflow-hidden">
              {profile.photos[0] ? (
                <img
                  src={profile.photos[0] || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {profile.name.charAt(0) || "?"}
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {profile.name || "Your Name"}, {profile.age || "??"}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2 text-muted-foreground">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
          {profile.occupation && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">{profile.occupation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="px-6 mt-6">
        <Button
          onClick={onEditProfile}
          variant="outline"
          className="w-full h-12 rounded-xl bg-transparent border-primary text-primary font-semibold"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Preview */}
      <div className="px-6 mt-6 space-y-4">
        {/* Bio */}
        {profile.bio && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {/* Prompts */}
        {profile.prompts.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border space-y-4">
            <h3 className="font-semibold text-card-foreground">Prompts</h3>
            {profile.prompts.map((prompt, index) => (
              <div key={index}>
                <p className="text-xs text-muted-foreground mb-1">{prompt.question}</p>
                <p className="text-sm text-foreground">{prompt.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {profile.photos.filter((p) => p).length > 1 && (
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-card-foreground mb-3">Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos
                .filter((p) => p)
                .map((photo, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-card-foreground">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="h-px bg-border" />
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-destructive" />
              <span className="font-medium text-destructive">Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
