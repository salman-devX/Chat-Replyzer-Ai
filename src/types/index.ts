export type AssistantMode = 'personal' | 'business' | 'creator' | 'sales' | 'community';

export type PlatformId = 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';

export type LanguagePreference = 'en' | 'roman_urdu' | 'urdu' | 'mixed';

export type EmojiFrequency = 'none' | 'low' | 'moderate' | 'high';

export type ReplyLength = 'concise' | 'balanced' | 'detailed';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AssistantProfile {
  id?: string;
  name: string;
  mode: AssistantMode;
  platforms: PlatformId[];
  language: LanguagePreference;
  formality: number; // 0 (super casual) to 100 (formal)
  humor: number; // 0 to 100
  emojiFrequency: EmojiFrequency;
  replyLength: ReplyLength;
  warmth: number; // 0 to 100
  sampleGreeting: string;
  sampleSignoff: string;
  phrasesToUse: string[];
  phrasesToAvoid: string[];
  knowledgeSources?: {
    title: string;
    content: string;
    type: 'faq' | 'document' | 'url';
  }[];
  sensitiveTopicsPolicy: {
    pauseOnFinancial: boolean;
    pauseOnThreats: boolean;
    pauseOnLegal: boolean;
    pauseOnEscalation: boolean;
    pauseOnUrgent: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // e.g. "23:00"
    end: string;   // e.g. "08:00"
    timezone: string;
  };
  maxResponseFrequency: number; // Max replies per contact per hour
  humanTakeover: {
    enabled: boolean;
    notifyEmail: boolean;
    notifyInApp: boolean;
    disclosureNotice: boolean; // Disclose "Responded via Chat Replyzer AI"
  };
  isPaused: boolean;
}

export interface ConnectedIntegration {
  platform: PlatformId;
  name: string;
  status: 'connected' | 'disconnected' | 'pending_approval' | 'error' | 'not_configured';
  accountName?: string;
  accountId?: string;
  connectedAt?: string;
  lastWebhookAt?: string;
  permissions: string[];
  accountType: string;
  capabilities: string[];
  isPaused: boolean;
  notes?: string;
  requiresReview?: boolean;
}

export interface DailyUsageQuota {
  dailyLimit: number; // 150 free replies
  repliesUsedToday: number;
  remainingReplies: number;
  resetTimeUtc: string;
  tier: 'free' | 'starter' | 'growth' | 'scale';
  isExhausted: boolean;
}

export interface OnboardingState {
  currentStep: number;
  mode: AssistantMode;
  platforms: PlatformId[];
  language: LanguagePreference;
  assistantName: string;
  formality: number;
  humor: number;
  emojiFrequency: EmojiFrequency;
  replyLength: ReplyLength;
  sampleGreeting: string;
  phrasesToUse: string[];
  phrasesToAvoid: string[];
  quietHoursEnabled: boolean;
  pauseOnSensitive: boolean;
  disclosureNotice: boolean;
  simulationTested: boolean;
  active: boolean;
  isComplete: boolean;
}
