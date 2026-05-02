import { Heart, Waves, Eye, Shield, type LucideIcon } from "lucide-react";

export type Pattern = {
  key: string;
  title: string;
  description: string;
  signal: string;
  icon: LucideIcon;
};

export const VIDEOS = {
  hero: "https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/ROSES%20FAUNA%20CLOSE%20UP.mp4",
  pattern: "https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/GEMS%20ISLAND%20MOTION.mp4",
  diagnosis: "https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/HEART.mp4",
  toolkit: "https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/GEM%20SPARKLE.mp4",
  experience: "https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/ROSES%20FAUNA%20CLOSE%20UP.mp4",
};

export const patterns: Pattern[] = [
  {
    key: "over_investor",
    title: "The Over-Investor",
    description: "You give more, faster — hoping it creates security.",
    signal: "You initiate, soften, explain, and carry the connection.",
    icon: Heart,
  },
  {
    key: "unavailable_chaser",
    title: "The Unavailable Chaser",
    description: "You feel most attracted when someone becomes unclear.",
    signal: "You feel most drawn in when someone becomes hard to read.",
    icon: Waves,
  },
  {
    key: "validator_seeker",
    title: "The Validator Seeker",
    description: "You feel calm when they give attention — and anxious when they don't.",
    signal: "Silence, slow replies, or vague plans feel personal.",
    icon: Eye,
  },
  {
    key: "boundary_softener",
    title: "The Boundary Softener",
    description: "You know your standards… until you like them.",
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
