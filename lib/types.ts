export interface UserProfile {
  id: string
  name: string
  age: number
  location: string
  gender: "man" | "woman" | "non-binary"
  interested_in: "men" | "women" | "everyone"
  bio: string
  occupation: string
  photos: string[]
  interests: string[]
  prompts: { question: string; answer: string }[]
  communication_traits: CommunicationTraits
  training_progress: number
  created_at?: string
  updated_at?: string
}

export interface CommunicationTraits {
  style?: string[]
  capitalization?: "lowercase" | "normal" | "uppercase" | "mixed"
  laughStyle?: string[]
  emojiUsage?: "none" | "minimal" | "moderate" | "frequent"
  responseLength?: "short" | "medium" | "detailed"
  questionStyle?: "direct" | "curious" | "rare"
  personality?: string[]
}

export interface AIMatchConversation {
  id: string
  user1_id: string
  user2_id?: string
  is_ai_match: boolean
  ai_profile_data?: Partial<UserProfile>
  conversation: ConversationMessage[]
  compatibility_score: number
  compatibility_reasons: string[]
  user1_decision: "liked" | "passed" | "pending"
  user2_decision: "liked" | "passed" | "pending"
  is_match: boolean
  other_profile?: UserProfile | Partial<UserProfile>
}

export interface ConversationMessage {
  id: string
  sender: "user1_ai" | "user2_ai"
  senderName: string
  text: string
  timestamp: string
}

export interface TrainingConversation {
  id: string
  user_id: string
  bot_name: string
  bot_personality: string
  messages: { text: string; sender: "ai" | "user"; timestamp: string }[]
  learned_traits: string[]
}
