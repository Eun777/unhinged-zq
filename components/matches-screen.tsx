"use client"

import { useState, useEffect } from "react"
import { Heart, X, ChevronDown, ChevronUp, Sparkles, Bot, MessageCircle, Edit3, Check, XIcon } from "lucide-react"
import type { UserProfile } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface MatchesScreenProps {
  userProfile: UserProfile
  onStartChat: (matchName: string, matchPhoto: string, matchId?: string) => void
}

interface AIMessage {
  sender: "user_ai" | "match_ai"
  text: string
  timestamp: string
  isAIGuess?: boolean // Flag for when AI makes up information
  originalText?: string // Store original AI guess
  correctedText?: string // Store user's correction
}

interface AIConversation {
  id: string
  messages: AIMessage[]
  compatibility: number
  vibeReasons: string[]
  potentialChallenges: string[]
}

interface PotentialMatch {
  id: string
  name: string
  age: number
  location: string
  photo: string
  bio: string
  occupation: string
  interests: string[]
  isAI: boolean
  conversations: AIConversation[]
}

const getInterestPhrase = (interest: string, context: "like" | "doing" | "about" | "into"): string => {
  const lowerInterest = interest?.toLowerCase() || ""

  const interestPhrases: Record<string, Record<string, string>> = {
    travel: {
      like: "exploring new places",
      doing: "planning trips and discovering hidden spots",
      about: "different cultures and adventures",
      into: "traveling and seeing the world",
    },
    cooking: {
      like: "experimenting in the kitchen",
      doing: "trying out new recipes",
      about: "food and different cuisines",
      into: "cooking and food",
    },
    baking: {
      like: "baking stuff from scratch",
      doing: "making pastries and breads",
      about: "the patience it takes to bake well",
      into: "baking",
    },
    music: {
      like: "discovering new artists",
      doing: "listening to music or going to shows",
      about: "how music can change your whole mood",
      into: "music",
    },
    photography: {
      like: "capturing moments",
      doing: "taking photos wherever i go",
      about: "visual storytelling",
      into: "photography",
    },
    fitness: {
      like: "staying active",
      doing: "working out or trying new fitness stuff",
      about: "taking care of my body",
      into: "fitness",
    },
    yoga: {
      like: "the mind-body connection",
      doing: "yoga or meditation",
      about: "finding inner balance",
      into: "yoga and wellness",
    },
    reading: {
      like: "getting lost in a good book",
      doing: "reading whenever i get the chance",
      about: "stories that make you think",
      into: "reading",
    },
    gaming: {
      like: "immersive games",
      doing: "gaming when i need to unwind",
      about: "game design and storytelling",
      into: "gaming",
    },
    art: {
      like: "visual expression",
      doing: "creating or looking at art",
      about: "different artistic styles",
      into: "art",
    },
    hiking: {
      like: "being out in nature",
      doing: "hitting trails on weekends",
      about: "finding cool spots outdoors",
      into: "hiking and the outdoors",
    },
    tech: {
      like: "how technology shapes things",
      doing: "tinkering with tech stuff",
      about: "new innovations",
      into: "tech",
    },
    movies: {
      like: "great cinematography and storytelling",
      doing: "watching films",
      about: "movie recommendations",
      into: "movies and film",
    },
    sports: {
      like: "the competitive energy",
      doing: "playing or watching sports",
      about: "athletic achievements",
      into: "sports",
    },
    dancing: {
      like: "moving to good music",
      doing: "dancing whenever i can",
      about: "different dance styles",
      into: "dancing",
    },
    writing: {
      like: "putting thoughts into words",
      doing: "writing in my free time",
      about: "storytelling and expression",
      into: "writing",
    },
  }

  // Check if we have a predefined phrase
  if (interestPhrases[lowerInterest]?.[context]) {
    return interestPhrases[lowerInterest][context]
  }

  // Fallback: make it sound natural even if we don't have a specific mapping
  switch (context) {
    case "like":
      return `everything about ${interest.toLowerCase()}`
    case "doing":
      return `${interest.toLowerCase()} stuff`
    case "about":
      return interest.toLowerCase()
    case "into":
      return interest.toLowerCase()
    default:
      return interest.toLowerCase()
  }
}

const getOccupationPhrase = (occupation: string, context: "work" | "describe" | "casual"): string => {
  const lowerOcc = occupation?.toLowerCase() || ""

  // Handle common occupation patterns
  if (lowerOcc.includes("engineer") || lowerOcc.includes("developer") || lowerOcc.includes("programmer")) {
    switch (context) {
      case "work":
        return "building software"
      case "describe":
        return "i write code for a living"
      case "casual":
        return "tech stuff"
    }
  }
  if (lowerOcc.includes("design")) {
    switch (context) {
      case "work":
        return "designing things"
      case "describe":
        return "i work in design"
      case "casual":
        return "creative work"
    }
  }
  if (lowerOcc.includes("market")) {
    switch (context) {
      case "work":
        return "marketing"
      case "describe":
        return "i work in marketing"
      case "casual":
        return "helping brands tell their story"
    }
  }
  if (lowerOcc.includes("teach") || lowerOcc.includes("professor") || lowerOcc.includes("educator")) {
    switch (context) {
      case "work":
        return "teaching"
      case "describe":
        return "i'm an educator"
      case "casual":
        return "working with students"
    }
  }
  if (
    lowerOcc.includes("nurse") ||
    lowerOcc.includes("doctor") ||
    lowerOcc.includes("medical") ||
    lowerOcc.includes("health")
  ) {
    switch (context) {
      case "work":
        return "healthcare"
      case "describe":
        return "i work in healthcare"
      case "casual":
        return "helping people stay healthy"
    }
  }
  if (lowerOcc.includes("finance") || lowerOcc.includes("account") || lowerOcc.includes("bank")) {
    switch (context) {
      case "work":
        return "finance"
      case "describe":
        return "i work with numbers"
      case "casual":
        return "finance stuff"
    }
  }
  if (lowerOcc.includes("consult")) {
    switch (context) {
      case "work":
        return "consulting"
      case "describe":
        return "i'm a consultant"
      case "casual":
        return "helping companies figure things out"
    }
  }
  if (lowerOcc.includes("write") || lowerOcc.includes("journal") || lowerOcc.includes("content")) {
    switch (context) {
      case "work":
        return "writing"
      case "describe":
        return "i write for a living"
      case "casual":
        return "putting words together"
    }
  }
  if (lowerOcc.includes("student")) {
    switch (context) {
      case "work":
        return "studying"
      case "describe":
        return "i'm a student"
      case "casual":
        return "school stuff"
    }
  }

  // Generic fallback
  switch (context) {
    case "work":
      return occupation.toLowerCase()
    case "describe":
      return `i work in ${occupation.toLowerCase()}`
    case "casual":
      return occupation.toLowerCase()
    default:
      return occupation.toLowerCase()
  }
}

const generateAIConversation = (userProfile: UserProfile, matchProfile: Partial<PotentialMatch>): AIConversation => {
  const userStyle = userProfile.textPatterns || {
    laughStyle: "haha",
    punctuationStyle: "normal",
    usesAllCaps: false,
    emojiFrequency: "low",
    averageMessageLength: "medium",
  }

  const laugh = userStyle.laughStyle || "haha"
  const exclaim = userStyle.punctuationStyle === "expressive" ? "!!" : "!"
  const useEmoji = userStyle.emojiFrequency !== "none"

  const matchPersonality = matchProfile.id || "default"

  const userInterest1 = userProfile.interests?.[0] || "music"
  const userInterest2 = userProfile.interests?.[1] || "travel"
  const userOccupation = userProfile.occupation || ""
  const userLocation = userProfile.location || "the city"
  const userName = userProfile.name || "there"

  // Pre-compute natural phrases for user's interests and occupation
  const interest1Like = getInterestPhrase(userInterest1, "like")
  const interest1Doing = getInterestPhrase(userInterest1, "doing")
  const interest1Into = getInterestPhrase(userInterest1, "into")
  const interest2Doing = getInterestPhrase(userInterest2, "doing")
  const occupationWork = userOccupation ? getOccupationPhrase(userOccupation, "work") : ""
  const occupationDescribe = userOccupation ? getOccupationPhrase(userOccupation, "describe") : ""
  const occupationCasual = userOccupation ? getOccupationPhrase(userOccupation, "casual") : ""

  const userBioClean = userProfile.bio?.trim() || ""
  const hasSubstantialBio = userBioClean.length > 20

  const promptAnswer1 = userProfile.prompts?.[0]?.answer?.trim() || ""
  const promptAnswer2 = userProfile.prompts?.[1]?.answer?.trim() || ""

  let messages: AIMessage[] = []
  let compatibility = 80
  let vibeReasons: string[] = []
  let potentialChallenges: string[] = []

  // Marcus - Enthusiastic foodie and dog lover, warm and friendly
  if (matchPersonality.includes("ai-1") || matchProfile.name === "Marcus") {
    messages = [
      {
        sender: "match_ai",
        text: `hey! your profile caught my eye - seems like you're really into ${interest1Into} 😊`,
        timestamp: "10:34 AM",
      },
      {
        sender: "user_ai",
        text: `hey${exclaim} yeah i really enjoy ${interest1Like} ${laugh}`,
        timestamp: "10:35 AM",
      },
      {
        sender: "match_ai",
        text: `nice! what got you into it?`,
        timestamp: "10:35 AM",
      },
      {
        sender: "user_ai",
        text: userOccupation
          ? `it actually started as a hobby but now it kind of ties into my work - ${occupationDescribe}`
          : `honestly just stumbled into it a few years ago and haven't looked back`,
        timestamp: "10:36 AM",
        isAIGuess: !userOccupation,
      },
      {
        sender: "match_ai",
        text: "oh that's cool when your interests and life align like that",
        timestamp: "10:37 AM",
      },
      {
        sender: "match_ai",
        text: "for me it's food - i started making pasta for myself during college and now i'm that person who spends entire weekends trying new recipes 😂",
        timestamp: "10:38 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} that's actually impressive. what's your signature dish?`,
        timestamp: "10:38 AM",
      },
      {
        sender: "match_ai",
        text: "okay don't judge but i make a pretty solid mushroom risotto - takes forever but so worth it",
        timestamp: "10:39 AM",
      },
      {
        sender: "match_ai",
        text: "my dog sits by the kitchen the entire time hoping something falls lol",
        timestamp: "10:39 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} wait you have a dog? what kind?`,
        timestamp: "10:40 AM",
      },
      {
        sender: "match_ai",
        text: "golden retriever named Biscuit. honestly he's my best friend",
        timestamp: "10:41 AM",
      },
      {
        sender: "match_ai",
        text: "are you a pet person?",
        timestamp: "10:41 AM",
      },
      {
        sender: "user_ai",
        text:
          promptAnswer1 && promptAnswer1.toLowerCase().includes("pet")
            ? `yeah! ${promptAnswer1.split(".")[0]}`
            : `no pets at the moment but i love dogs${exclaim}`,
        timestamp: "10:42 AM",
        isAIGuess: !promptAnswer1?.toLowerCase().includes("pet"),
      },
      {
        sender: "match_ai",
        text: "biscuit would try to be your best friend immediately haha he has no concept of personal space",
        timestamp: "10:43 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} sounds like my kind of energy${useEmoji ? " 🐕" : ""}`,
        timestamp: "10:43 AM",
      },
      {
        sender: "match_ai",
        text: `so what does a typical weekend look like for you?`,
        timestamp: "10:44 AM",
      },
      {
        sender: "user_ai",
        text: userInterest2
          ? `honestly a mix of things - sometimes ${interest1Doing}, sometimes ${interest2Doing}. depends on my mood ${laugh}`
          : `pretty chill usually. catch up on stuff, grab food somewhere good`,
        timestamp: "10:45 AM",
        isAIGuess: true,
      },
      {
        sender: "match_ai",
        text: "sounds like a good balance! mine is usually cooking or taking biscuit to the park",
        timestamp: "10:46 AM",
      },
      {
        sender: "match_ai",
        text: "we should grab food sometime! i promise i'm better company than my risotto stories make me sound 😂",
        timestamp: "10:46 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} i'd be down for that${exclaim}`,
        timestamp: "10:47 AM",
      },
    ]
    compatibility = 87
    vibeReasons = [
      "Both share genuine warmth and humor",
      "Natural back-and-forth with good energy",
      "Marcus's humor landed well",
      "Easy conversation about everyday life",
    ]
    potentialChallenges = ["Marcus can be a bit eager - might need to match his energy"]
  }

  // Ethan - Cool, confident music producer, minimal texting style
  else if (matchPersonality.includes("ai-2") || matchProfile.name === "Ethan") {
    messages = [
      { sender: "match_ai", text: "yo", timestamp: "2:15 PM" },
      {
        sender: "match_ai",
        text: `saw you're into ${interest1Into}. respect`,
        timestamp: "2:15 PM",
      },
      {
        sender: "user_ai",
        text: `hey${exclaim} yeah for sure. you?`,
        timestamp: "2:16 PM",
      },
      {
        sender: "match_ai",
        text: "music mostly. produce beats. up late most nights in the studio",
        timestamp: "2:17 PM",
      },
      {
        sender: "user_ai",
        text: `oh nice. what kind of stuff?`,
        timestamp: "2:18 PM",
      },
      { sender: "match_ai", text: "electronic. some lo-fi", timestamp: "2:18 PM" },
      { sender: "match_ai", text: "been experimenting with live instruments lately tho", timestamp: "2:19 PM" },
      {
        sender: "user_ai",
        text: `that's cool. always down for good music recs`,
        timestamp: "2:20 PM",
      },
      { sender: "match_ai", text: "got plenty of those. what else you into", timestamp: "2:21 PM" },
      {
        sender: "user_ai",
        text: userOccupation
          ? `${occupationCasual} keeps me busy during the week`
          : `${interest1Doing} takes up a lot of my time honestly`,
        timestamp: "2:22 PM",
        isAIGuess: !userOccupation,
      },
      { sender: "match_ai", text: "nice", timestamp: "2:22 PM" },
      {
        sender: "match_ai",
        text: `you go out much?`,
        timestamp: "2:23 PM",
      },
      {
        sender: "user_ai",
        text: `sometimes. depends on my energy ${laugh}`,
        timestamp: "2:24 PM",
      },
      { sender: "match_ai", text: "felt that", timestamp: "2:24 PM" },
      { sender: "match_ai", text: "also do standup btw", timestamp: "2:25 PM" },
      {
        sender: "user_ai",
        text: `wait seriously? ${laugh} like comedy?`,
        timestamp: "2:25 PM",
      },
      { sender: "match_ai", text: "yeah. bomb sometimes but whatever. keeps things interesting", timestamp: "2:26 PM" },
      {
        sender: "user_ai",
        text: `that takes guts. respect ${laugh}`,
        timestamp: "2:27 PM",
      },
      { sender: "match_ai", text: "you'd be surprised what you can do", timestamp: "2:27 PM" },
      { sender: "match_ai", text: "we should link sometime. grab a drink or something", timestamp: "2:28 PM" },
      {
        sender: "user_ai",
        text: `yeah for sure${exclaim}`,
        timestamp: "2:28 PM",
      },
      { sender: "match_ai", text: "bet", timestamp: "2:29 PM" },
    ]
    compatibility = 82
    vibeReasons = [
      "Ethan's chill energy is refreshing",
      "Low-pressure conversation style",
      "Multi-talented and interesting",
      "Comfortable with laid-back exchanges",
    ]
    potentialChallenges = ["Ethan's minimal texting takes getting used to", "Hard to read emotionally"]
  }

  // Noah - Thoughtful writer, uses proper grammar, asks deeper questions
  else if (matchPersonality.includes("ai-3") || matchProfile.name === "Noah") {
    messages = [
      {
        sender: "match_ai",
        text: `Hi! I'm Noah. Your profile stood out to me.`,
        timestamp: "11:00 AM",
      },
      {
        sender: "user_ai",
        text: `hey noah${exclaim} thanks ${laugh} what caught your attention?`,
        timestamp: "11:01 AM",
      },
      {
        sender: "match_ai",
        text: `Honestly, you seem genuinely passionate about ${interest1Into}. That kind of enthusiasm is rare.`,
        timestamp: "11:02 AM",
      },
      {
        sender: "user_ai",
        text: `aw thanks${exclaim} yeah it's something i really care about`,
        timestamp: "11:03 AM",
      },
      {
        sender: "match_ai",
        text: "What draws you to it? I'm always curious about what sparks people's passions.",
        timestamp: "11:04 AM",
      },
      {
        sender: "user_ai",
        text: hasSubstantialBio
          ? `hard to put into words exactly. it just resonates with who i am i guess`
          : `honestly some things just click. can't always explain why ${laugh}`,
        timestamp: "11:05 AM",
        isAIGuess: true,
      },
      {
        sender: "match_ai",
        text: "I love that. The best things often defy easy explanation.",
        timestamp: "11:06 AM",
      },
      {
        sender: "match_ai",
        text: "I'm a writer, so I spend a lot of time trying to capture those kinds of feelings in words.",
        timestamp: "11:06 AM",
      },
      {
        sender: "user_ai",
        text: `oh that's really cool${exclaim} what do you write?`,
        timestamp: "11:07 AM",
      },
      {
        sender: "match_ai",
        text: "Essays mostly, some short fiction. I'm drawn to human connection - those quiet moments between people that somehow mean everything.",
        timestamp: "11:08 AM",
      },
      {
        sender: "user_ai",
        text: `that's beautiful honestly${exclaim}`,
        timestamp: "11:09 AM",
      },
      {
        sender: "match_ai",
        text: `Ha, thanks. I promise I'm not always this philosophical. Sometimes I just want to talk about good coffee.`,
        timestamp: "11:09 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} coffee is essential though`,
        timestamp: "11:10 AM",
      },
      {
        sender: "match_ai",
        text: "Absolutely. There's this place in Queens with the best pour-over I've found in the city.",
        timestamp: "11:11 AM",
      },
      {
        sender: "user_ai",
        text: `ooh i'm always looking for good coffee spots${exclaim}`,
        timestamp: "11:12 AM",
      },
      {
        sender: "match_ai",
        text: "One of the best things about living here - always something new to discover.",
        timestamp: "11:12 AM",
      },
      {
        sender: "user_ai",
        text: `exactly${exclaim} that's what keeps it exciting`,
        timestamp: "11:13 AM",
      },
      {
        sender: "match_ai",
        text: "I'd love to continue this conversation over that coffee I mentioned. What do you think?",
        timestamp: "11:14 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} that sounds really nice actually`,
        timestamp: "11:15 AM",
      },
      {
        sender: "match_ai",
        text: "Perfect. Looking forward to it.",
        timestamp: "11:16 AM",
      },
    ]
    compatibility = 91
    vibeReasons = [
      "Strong intellectual connection",
      "Noah balances depth with warmth",
      "Both value meaningful conversation",
      "Good emotional attunement",
    ]
    potentialChallenges = ["Might need to balance deep talks with lighthearted moments"]
  }

  // Sofia - Warm yoga instructor, enthusiastic, uses exclamation points
  else if (matchPersonality.includes("ai-4") || matchProfile.name === "Sofia") {
    messages = [
      { sender: "match_ai", text: `Hey! I'm Sofia 😊`, timestamp: "9:00 AM" },
      {
        sender: "match_ai",
        text: `Your vibe seems really cool! I'd love to know more about you!`,
        timestamp: "9:01 AM",
      },
      {
        sender: "user_ai",
        text: `hey sofia${exclaim} thanks ${laugh}`,
        timestamp: "9:02 AM",
      },
      {
        sender: "match_ai",
        text: "Of course! So tell me - what's something you're really passionate about?",
        timestamp: "9:03 AM",
      },
      {
        sender: "user_ai",
        text: `hmm i'd say ${interest1Like} - it's something i really enjoy`,
        timestamp: "9:04 AM",
      },
      {
        sender: "match_ai",
        text: "I love that! It's so nice meeting people who are genuinely into things!",
        timestamp: "9:05 AM",
      },
      {
        sender: "match_ai",
        text: "For me it's yoga - I actually teach it! Helping people find their balance is kind of my favorite thing 🙏",
        timestamp: "9:05 AM",
      },
      {
        sender: "user_ai",
        text: `oh wow that sounds really fulfilling${exclaim}`,
        timestamp: "9:06 AM",
      },
      {
        sender: "match_ai",
        text: "It really is! Every class is different and I honestly learn from my students as much as they learn from me!",
        timestamp: "9:07 AM",
      },
      {
        sender: "user_ai",
        text: `that's such a great perspective to have ${laugh}`,
        timestamp: "9:08 AM",
      },
      {
        sender: "match_ai",
        text: "So what keeps you busy day to day?",
        timestamp: "9:08 AM",
      },
      {
        sender: "user_ai",
        text: userOccupation
          ? `${occupationDescribe}${exclaim} keeps me on my toes`
          : `a mix of things honestly - ${interest1Doing} when i get the chance`,
        timestamp: "9:09 AM",
        isAIGuess: !userOccupation,
      },
      { sender: "match_ai", text: `That's awesome! 😊`, timestamp: "9:10 AM" },
      {
        sender: "match_ai",
        text: `Okay fun question - what's something that never fails to put you in a good mood?`,
        timestamp: "9:10 AM",
      },
      {
        sender: "user_ai",
        text: `ooh ${laugh} probably good food and good company. simple but true`,
        timestamp: "9:11 AM",
      },
      {
        sender: "match_ai",
        text: "YES! Completely agree! I've been really into cooking lately!",
        timestamp: "9:12 AM",
      },
      {
        sender: "match_ai",
        text: `Made this amazing curry last night - took forever but SO worth it! 🍛`,
        timestamp: "9:12 AM",
      },
      {
        sender: "user_ai",
        text: `that sounds incredible${exclaim} i love a good curry`,
        timestamp: "9:13 AM",
      },
      {
        sender: "match_ai",
        text: `We should cook together sometime! Cooking with someone else is basically therapy but tastier 😂`,
        timestamp: "9:14 AM",
      },
      {
        sender: "user_ai",
        text: `${laugh} i love that idea${exclaim}`,
        timestamp: "9:15 AM",
      },
      {
        sender: "match_ai",
        text: `Yay! This chat has been so fun! 💕`,
        timestamp: "9:16 AM",
      },
      {
        sender: "user_ai",
        text: `agreed${exclaim}${useEmoji ? " 😊" : ""}`,
        timestamp: "9:16 AM",
      },
    ]
    compatibility = 89
    vibeReasons = [
      "Sofia's warmth is contagious",
      "Shared appreciation for simple joys",
      "Very encouraging energy",
      "Natural chemistry in the conversation",
    ]
    potentialChallenges = ["Sofia's high energy might feel like a lot sometimes"]
  }

  // Maya - Artistic, lowercase aesthetic, thoughtful but cool
  else if (matchPersonality.includes("ai-5") || matchProfile.name === "Maya") {
    messages = [
      { sender: "match_ai", text: "hey", timestamp: "3:00 PM" },
      {
        sender: "match_ai",
        text: `your profile has interesting energy`,
        timestamp: "3:01 PM",
      },
      {
        sender: "user_ai",
        text: `hey${exclaim} thanks. what stood out?`,
        timestamp: "3:02 PM",
      },
      {
        sender: "match_ai",
        text: `idk just seems like you actually have depth. rare on here`,
        timestamp: "3:03 PM",
      },
      {
        sender: "user_ai",
        text: `${laugh} appreciate that. what about you?`,
        timestamp: "3:04 PM",
      },
      {
        sender: "match_ai",
        text: "art director. aesthetics are kind of my whole world",
        timestamp: "3:05 PM",
      },
      {
        sender: "match_ai",
        text: "working on a vintage 70s editorial thing rn. warm tones, film grain. obsessed with it",
        timestamp: "3:05 PM",
      },
      {
        sender: "user_ai",
        text: `that sounds really beautiful${exclaim}`,
        timestamp: "3:06 PM",
      },
      { sender: "match_ai", text: "thanks. it's consuming my brain in a good way", timestamp: "3:07 PM" },
      { sender: "match_ai", text: "do you have a creative outlet?", timestamp: "3:07 PM" },
      {
        sender: "user_ai",
        text: userOccupation
          ? `sort of. ${occupationCasual} can be creative in its own way`
          : `i think ${interest1Doing} is how i express that side of myself`,
        timestamp: "3:08 PM",
        isAIGuess: !userOccupation,
      },
      { sender: "match_ai", text: "that counts. creativity shows up in unexpected places", timestamp: "3:09 PM" },
      {
        sender: "match_ai",
        text: `what inspires you?`,
        timestamp: "3:09 PM",
      },
      {
        sender: "user_ai",
        text: `hmm random things honestly. people watching, wandering around, noticing small details ${laugh}`,
        timestamp: "3:10 PM",
        isAIGuess: true,
      },
      { sender: "match_ai", text: "yes. observation is underrated", timestamp: "3:11 PM" },
      {
        sender: "match_ai",
        text: "i spend too much time in vintage stores and on rooftops just taking things in",
        timestamp: "3:11 PM",
      },
      {
        sender: "user_ai",
        text: `${laugh} that sounds really peaceful actually`,
        timestamp: "3:12 PM",
      },
      { sender: "match_ai", text: "it is. very grounding", timestamp: "3:12 PM" },
      { sender: "match_ai", text: "we should explore some spots together sometime", timestamp: "3:13 PM" },
      {
        sender: "user_ai",
        text: `i'd be into that${exclaim}`,
        timestamp: "3:13 PM",
      },
      { sender: "match_ai", text: "cool. looking forward to it", timestamp: "3:14 PM" },
    ]
    compatibility = 85
    vibeReasons = [
      "Maya's artistic eye is intriguing",
      "Both appreciate observation and detail",
      "Chill energy that doesn't feel forced",
      "Authentic connection",
    ]
    potentialChallenges = ["Maya can be hard to read", "Low-key style requires patience"]
  }

  // Chloe - Adventurous, upbeat, loves outdoor activities
  else {
    messages = [
      { sender: "match_ai", text: `Hii! 👋`, timestamp: "4:00 PM" },
      { sender: "match_ai", text: `I'm Chloe! Your profile looks fun!`, timestamp: "4:00 PM" },
      {
        sender: "user_ai",
        text: `hey chloe${exclaim} thanks ${laugh}`,
        timestamp: "4:01 PM",
      },
      {
        sender: "match_ai",
        text: `So tell me something interesting about yourself!`,
        timestamp: "4:02 PM",
      },
      {
        sender: "user_ai",
        text: `hmm i'm really into ${interest1Like}. that's probably my main thing`,
        timestamp: "4:03 PM",
      },
      {
        sender: "match_ai",
        text: `Oh that's cool! I love people who are passionate about stuff!`,
        timestamp: "4:04 PM",
      },
      {
        sender: "match_ai",
        text: `For me it's anything outdoors - hiking, rock climbing, kayaking. If it involves nature I'm there 🏔️`,
        timestamp: "4:04 PM",
      },
      {
        sender: "user_ai",
        text: `wow that's awesome${exclaim} sounds like you stay pretty active`,
        timestamp: "4:05 PM",
      },
      {
        sender: "match_ai",
        text: `Haha yeah I can't sit still! Did a sunrise hike last weekend and it was SO worth waking up at 5am`,
        timestamp: "4:06 PM",
      },
      {
        sender: "user_ai",
        text: `5am? ${laugh} that's dedication`,
        timestamp: "4:07 PM",
      },
      {
        sender: "match_ai",
        text: `The views make it worth it! Plus there's something magical about being up before the rest of the world`,
        timestamp: "4:07 PM",
      },
      {
        sender: "user_ai",
        text: `okay that does sound pretty amazing ${laugh}`,
        timestamp: "4:08 PM",
      },
      {
        sender: "match_ai",
        text: `You should come sometime! I promise the coffee after makes it all worth it ☕`,
        timestamp: "4:09 PM",
      },
      {
        sender: "user_ai",
        text: userInterest2
          ? `${laugh} i might need some convincing but i'm open to it${exclaim}`
          : `${laugh} that's tempting honestly`,
        timestamp: "4:10 PM",
        isAIGuess: true,
      },
      {
        sender: "match_ai",
        text: `Challenge accepted! What else do you like doing for fun?`,
        timestamp: "4:11 PM",
      },
      {
        sender: "user_ai",
        text: userOccupation
          ? `when i'm not doing ${occupationCasual}, usually ${interest1Doing}`
          : `${interest1Doing} mostly. keeps me happy ${laugh}`,
        timestamp: "4:12 PM",
        isAIGuess: !userOccupation,
      },
      {
        sender: "match_ai",
        text: `Nice! I feel like we'd balance each other out well - you can introduce me to your world and I'll drag you on adventures 😂`,
        timestamp: "4:13 PM",
      },
      {
        sender: "user_ai",
        text: `${laugh} that actually sounds like a good trade${exclaim}`,
        timestamp: "4:14 PM",
      },
      {
        sender: "match_ai",
        text: `It's a deal then! Can't wait to hang!`,
        timestamp: "4:15 PM",
      },
      {
        sender: "user_ai",
        text: `same${exclaim}${useEmoji ? " 😊" : ""}`,
        timestamp: "4:15 PM",
      },
    ]
    compatibility = 84
    vibeReasons = [
      "Chloe's enthusiasm is energizing",
      "Good balance of different interests",
      "Playful dynamic forming",
      "Both seem open to trying new things",
    ]
    potentialChallenges = ["Chloe's energy level might be intense", "Different activity preferences"]
  }

  // Default fallback is removed as the Chloe case now handles it.

  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    messages,
    compatibility,
    vibeReasons,
    potentialChallenges,
  }
}

const generateAIMatches = (userProfile: UserProfile): PotentialMatch[] => {
  const isMale = userProfile.interestedIn === "men"
  const isFemale = userProfile.interestedIn === "women"

  const maleMatches = [
    {
      id: "ai-1",
      name: "Marcus",
      age: 27,
      location: "Brooklyn, NY",
      photo: "/friendly-young-man-portrait-warm-smile.jpg",
      bio: "Coffee enthusiast, amateur chef, and full-time dog dad. Looking for someone to explore the city with.",
      occupation: "Product Designer",
      interests: ["cooking", "hiking", "photography"],
      isAI: true,
    },
    {
      id: "ai-2",
      name: "Ethan",
      age: 29,
      location: "Manhattan, NY",
      photo: "/confident-man-portrait-casual-friendly.jpg",
      bio: "Music producer by day, aspiring comedian by night. I make great playlists and terrible puns.",
      occupation: "Music Producer",
      interests: ["music", "comedy", "travel"],
      isAI: true,
    },
    {
      id: "ai-3",
      name: "Noah",
      age: 26,
      location: "Queens, NY",
      photo: "/casual-friendly-young-man-smiling.jpg",
      bio: "Book lover and brunch connoisseur. Currently reading way too many books at once.",
      occupation: "Writer",
      interests: ["reading", "writing", "art"],
      isAI: true,
    },
  ]

  const femaleMatches = [
    {
      id: "ai-4",
      name: "Sofia",
      age: 26,
      location: "Brooklyn, NY",
      photo: "/friendly-young-woman-portrait-warm-smile.jpg",
      bio: "Yoga instructor who believes life is better with good food and better company.",
      occupation: "Yoga Instructor",
      interests: ["yoga", "cooking", "travel"],
      isAI: true,
    },
    {
      id: "ai-5",
      name: "Maya",
      age: 28,
      location: "Manhattan, NY",
      photo: "/confident-woman-portrait-casual-friendly.jpg",
      bio: "Art director with a passion for vintage finds and rooftop sunsets.",
      occupation: "Art Director",
      interests: ["art", "fashion", "photography"],
      isAI: true,
    },
    {
      id: "ai-6",
      name: "Chloe",
      age: 25,
      location: "Williamsburg, NY",
      photo: "/casual-friendly-young-woman-smiling.jpg",
      bio: "Environmental scientist who loves hiking and good coffee. Always up for an adventure.",
      occupation: "Environmental Scientist",
      interests: ["hiking", "coffee", "sustainability"],
      isAI: true,
    },
  ]

  let matches: PotentialMatch[] = []

  if (isMale) {
    matches = maleMatches
  } else if (isFemale) {
    matches = femaleMatches
  } else {
    matches = [...maleMatches.slice(0, 2), ...femaleMatches.slice(0, 2)]
  }

  return matches.map((match) => ({
    ...match,
    conversations: [generateAIConversation(userProfile, match)],
  }))
}

export default function MatchesScreen({ userProfile, onStartChat }: MatchesScreenProps) {
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [messageCorrections, setMessageCorrections] = useState<Record<string, { original: string; corrected: string }>>(
    {},
  )

  useEffect(() => {
    const loadMatches = async () => {
      // Simulate fetching matches
      const aiMatches = generateAIMatches(userProfile)
      setPotentialMatches(aiMatches)
    }

    loadMatches()
  }, [userProfile])

  const handleSaveCorrection = (matchId: string, messageIndex: number) => {
    if (!editText.trim()) return

    setPotentialMatches((matches) =>
      matches.map((match) => {
        if (match.id === matchId) {
          const updatedMessages = [...match.conversations[0].messages]
          const message = updatedMessages[messageIndex]

          // Save the original text if not already saved
          if (!message.originalText) {
            message.originalText = message.text
          }

          message.correctedText = editText.trim()
          message.text = editText.trim() // Update display text

          // Store correction for AI learning
          const correctionKey = `${matchId}-${messageIndex}`
          setMessageCorrections((prev) => ({
            ...prev,
            [correctionKey]: {
              original: message.originalText || message.text,
              corrected: editText.trim(),
            },
          }))

          return {
            ...match,
            conversations: [
              {
                ...match.conversations[0],
                messages: updatedMessages,
              },
            ],
          }
        }
        return match
      }),
    )

    setEditingMessageId(null)
    setEditText("")
  }

  const handleStartEdit = (matchId: string, messageIndex: number, currentText: string) => {
    setEditingMessageId(`${matchId}-${messageIndex}`)
    setEditText(currentText)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditText("")
  }

  const handlePass = () => {
    setCurrentMatchIndex((prevIndex) => prevIndex + 1)
    setExpandedConversation(null) // Collapse conversation when passing
  }

  const handleLike = () => {
    if (potentialMatches.length > 0 && currentMatchIndex < potentialMatches.length) {
      const currentMatch = potentialMatches[currentMatchIndex]
      onStartChat(currentMatch.name, currentMatch.photo, currentMatch.id)
    }
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background pb-20">
        <div className="text-center px-6">
          <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Finding Matches</h2>
          <p className="text-muted-foreground">Loading potential matches for you...</p>
        </div>
      </div>
    )
  }

  const currentMatch = potentialMatches[currentMatchIndex]
  const conversation = currentMatch.conversations[0]

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Matches</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {currentMatchIndex + 1} / {potentialMatches.length}
            </span>
          </div>
        </div>
      </div>

      {/* Match Card */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm mb-6">
          {/* Profile Section */}
          <div className="relative">
            <img
              src={currentMatch.photo || "/placeholder.svg"}
              alt={currentMatch.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">
                      {currentMatch.name}, {currentMatch.age}
                    </h2>
                    {currentMatch.isAI && (
                      <span className="px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs font-medium flex items-center gap-1">
                        <Bot className="w-3 h-3" /> AI Profile
                      </span>
                    )}
                  </div>
                  <p className="text-white/90 text-sm">{currentMatch.occupation}</p>
                  <p className="text-white/80 text-sm">{currentMatch.location}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-2xl font-bold text-white">{conversation.compatibility}%</span>
                  </div>
                  <p className="text-xs text-white/80">Match</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Interests */}
          <div className="p-6 space-y-4">
            <p className="text-card-foreground">{currentMatch.bio}</p>
            <div className="flex flex-wrap gap-2">
              {currentMatch.interests.map((interest, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Conversation Preview */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-card-foreground">AI Conversation Preview</h3>
              </div>
              <button
                onClick={() =>
                  setExpandedConversation(expandedConversation === currentMatch.id ? null : currentMatch.id)
                }
                className="text-primary text-sm font-medium flex items-center gap-1"
              >
                {expandedConversation === currentMatch.id ? (
                  <>
                    Collapse <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read Full Chat <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">See how your AI chatted with {currentMatch.name}'s AI</p>
          </div>

          <div
            className={`space-y-2 p-4 ${expandedConversation === currentMatch.id ? "max-h-[600px]" : "max-h-[300px]"} overflow-y-auto`}
          >
            {conversation.messages
              .slice(0, expandedConversation === currentMatch.id ? undefined : 8)
              .map((msg, idx) => {
                const isUserAI = msg.sender === "user_ai"
                const messageId = `${currentMatch.id}-${idx}`
                const isEditing = editingMessageId === messageId
                const hasCorrection = msg.correctedText && msg.originalText

                return (
                  <div key={idx} className={`flex ${isUserAI ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${isUserAI ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {isEditing ? (
                        // Edit mode
                        <div className="w-full space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full min-h-[80px]"
                            placeholder="Enter a better response..."
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <XIcon className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleSaveCorrection(currentMatch.id, idx)}>
                              <Check className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              isUserAI ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            {msg.timestamp && (
                              <p
                                className={`text-xs mt-1 ${isUserAI ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}
                              >
                                {msg.timestamp}
                              </p>
                            )}
                          </div>

                          {/* AI Guess indicator and edit button */}
                          {msg.isAIGuess && isUserAI && (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI Guessed
                              </span>
                              <button
                                onClick={() => handleStartEdit(currentMatch.id, idx, msg.text)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit response
                              </button>
                            </div>
                          )}

                          {/* Show both original and corrected versions */}
                          {hasCorrection && isUserAI && (
                            <div className="mt-2 space-y-1 w-full">
                              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded-lg">
                                <p className="font-medium mb-1">Original (AI guess):</p>
                                <p className="italic">{msg.originalText}</p>
                              </div>
                              <div className="text-xs text-green-700 dark:text-green-400 p-2 bg-green-500/10 rounded-lg">
                                <p className="font-medium mb-1">Your correction:</p>
                                <p>{msg.correctedText}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}

            {expandedConversation !== currentMatch.id && conversation.messages.length > 8 && (
              <div className="text-center py-2">
                <button
                  onClick={() => setExpandedConversation(currentMatch.id)}
                  className="text-sm text-primary hover:underline"
                >
                  Read {conversation.messages.length - 8} more messages
                </button>
              </div>
            )}
          </div>

          {/* Compatibility Analysis */}
          <div className="p-6 border-t border-border space-y-4">
            <div>
              <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Why You Might Vibe
              </h4>
              <ul className="space-y-1">
                {conversation.vibeReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {conversation.potentialChallenges.length > 0 && (
              <div>
                <h4 className="font-semibold text-card-foreground mb-2">Potential Challenges</h4>
                <ul className="space-y-1">
                  {conversation.potentialChallenges.map((challenge, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Info Card about AI learning */}
        <div className="bg-muted/50 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Your AI is Learning</p>
            <p className="text-xs text-muted-foreground mt-1">
              When you edit a guessed response, your AI learns your preferred way of answering. Both versions are shown
              so you can see how it's improving!
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-center gap-6">
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-muted hover:bg-destructive/20 transition-colors flex items-center justify-center group"
        >
          <X className="w-8 h-8 text-muted-foreground group-hover:text-destructive transition-colors" />
        </button>
        <button
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg"
        >
          <Heart className="w-8 h-8 text-primary-foreground fill-current" />
        </button>
      </div>
    </div>
  )
}
