import { Heart, Waves, Eye, Shield, type LucideIcon } from "lucide-react";

export type Pattern = {
  key: string;
  title: string;
  description: string;
  signal: string;
  icon: LucideIcon;
};

export const patterns: Pattern[] = [
  {
    key: "over_investor",
    title: "The Over-Investor",
    description: "You create emotional momentum faster than the relationship has earned.",
    signal: "You initiate, soften, explain, and carry the connection.",
    icon: Heart,
  },
  {
    key: "unavailable_chaser",
    title: "The Unavailable Chaser",
    description: "Distance feels magnetic because uncertainty activates old worth beliefs.",
    signal: "You feel most drawn in when someone becomes hard to read.",
    icon: Waves,
  },
  {
    key: "validator_seeker",
    title: "The Validator Seeker",
    description: "Attention starts to feel like proof that you are lovable or safe.",
    signal: "Silence, slow replies, or vague plans feel personal.",
    icon: Eye,
  },
  {
    key: "boundary_softener",
    title: "The Boundary Softener",
    description: "Your standards become negotiable when chemistry or attention appears.",
    signal: "You know your line, then question it when they come closer.",
    icon: Shield,
  },
];

export const toolkit = [
  "Relationship Pattern Tracker",
  "Self-Worth Reset Worksheets",
  "Boundary Scripts Swipe File",
  "Chemistry vs Compatibility Tool",
  "Secure Self-Soothing SOP",
  "Weekend Attachment Trigger Tracker",
];

export const quizQuestions = [
  {
    id: "silence",
    question: "When attention drops or a reply is slow, what usually happens inside you?",
    options: [
      { label: "I feel anxious and want to restore connection quickly.", pattern: "validator_seeker" },
      { label: "I become more interested and start analyzing them.", pattern: "unavailable_chaser" },
      { label: "I start making excuses for why they are inconsistent.", pattern: "boundary_softener" },
      { label: "I take more action to keep the connection alive.", pattern: "over_investor" },
    ],
  },
  {
    id: "chemistry",
    question: "What feels most like chemistry to you?",
    options: [
      { label: "Intensity, uncertainty, and emotional highs.", pattern: "unavailable_chaser" },
      { label: "Being wanted after I feared I was losing them.", pattern: "validator_seeker" },
      { label: "Feeling needed or important to someone.", pattern: "over_investor" },
      { label: "Attention that makes me rethink my standards.", pattern: "boundary_softener" },
    ],
  },
  {
    id: "boundary",
    question: "What do you most often abandon when you like someone?",
    options: [
      { label: "My pace and emotional timing.", pattern: "boundary_softener" },
      { label: "My need for reciprocity.", pattern: "over_investor" },
      { label: "My peace while waiting for clarity.", pattern: "validator_seeker" },
      { label: "My attraction to steady, available people.", pattern: "unavailable_chaser" },
    ],
  },
  {
    id: "next",
    question: "What next step feels hardest but most self-respecting?",
    options: [
      { label: "Stop initiating and let the pattern reveal itself.", pattern: "over_investor" },
      { label: "Choose steadiness even when it feels less exciting.", pattern: "unavailable_chaser" },
      { label: "Self-soothe before seeking reassurance.", pattern: "validator_seeker" },
      { label: "Hold the boundary even when attention returns.", pattern: "boundary_softener" },
    ],
  },
];

export const VIDEO_URL_HERO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4";
export const VIDEO_URL_DARK = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";
export const HERO_IMAGE = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2200&auto=format&fit=crop";
export const CRYSTAL_IMAGE = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2200&auto=format&fit=crop";
export const AVATAR_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop";
