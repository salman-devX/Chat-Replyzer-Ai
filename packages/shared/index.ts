import { z } from 'zod';

export type AssistantMode = 'personal' | 'business' | 'creator' | 'sales' | 'community';
export type PlatformId = 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
export type LanguagePreference = 'en' | 'roman_urdu' | 'urdu' | 'mixed';
export type EmojiFrequency = 'none' | 'low' | 'moderate' | 'high';
export type ReplyLength = 'concise' | 'balanced' | 'detailed';

export const ASSISTANT_MODES = [
  {
    id: 'personal',
    name: 'Friends & Personal',
    tagline: 'Casual chats, banter & close connections',
    description: 'Natural conversational replies with Roman Urdu, Urdu, English & slang support, humorous banter, and sensitive-topic human takeover.',
    badge: 'Social & Fun'
  },
  {
    id: 'business',
    name: 'Business & Customer Support',
    tagline: 'Professional 24/7 client communication',
    description: 'Automate FAQs, operating hours, service catalogs, and smooth escalation for complaints or billing inquiries.',
    badge: 'Enterprise'
  },
  {
    id: 'creator',
    name: 'Creator & Influencer',
    tagline: 'Audience engagement & brand partnerships',
    description: 'Authentic creator voice, collaboration inquiry screening, media kit dissemination, and sponsorship triage.',
    badge: 'High Engagement'
  },
  {
    id: 'sales',
    name: 'Sales & Lead Assistant',
    tagline: 'Instant inbound response & qualification',
    description: 'Qualify buyer intent, answer product specifications, categorize warm leads, and suggest follow-up schedules.',
    badge: 'Growth'
  },
  {
    id: 'community',
    name: 'Community & Study Groups',
    tagline: 'Rules, events & collaborative sync',
    description: 'Automate community FAQ responses, event announcements, study resources, and conflict escalation.',
    badge: 'Collaboration'
  }
] as const;

export const SUPPORTED_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    tagline: 'WhatsApp Cloud API',
    accountRequirement: 'Meta Business Manager + WhatsApp Business Phone Number',
    permissions: ['whatsapp_business_messaging', 'whatsapp_business_management'],
    capabilities: ['Two-way auto-reply', 'Coexistence guidance', 'Template messaging', 'Webhooks'],
    status: 'connected',
    officialUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api'
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    tagline: 'Instagram Messaging API',
    accountRequirement: 'Instagram Professional / Creator Account linked to Facebook Page',
    permissions: ['instagram_basic', 'instagram_manage_messages', 'pages_manage_metadata'],
    capabilities: ['Direct Message replies', 'Story mention notifications', 'Media caption replies'],
    status: 'connected',
    officialUrl: 'https://developers.facebook.com/docs/messenger-platform/instagram'
  },
  {
    id: 'messenger',
    name: 'Facebook Messenger',
    tagline: 'Meta Graph Pages API',
    accountRequirement: 'Verified Facebook Page with Admin / Task access',
    permissions: ['pages_messaging', 'pages_read_engagement', 'pages_show_list'],
    capabilities: ['Page inbox replies', 'Persistent menu', 'Handoff protocol'],
    status: 'connected',
    officialUrl: 'https://developers.facebook.com/docs/messenger-platform'
  },
  {
    id: 'tiktok',
    name: 'TikTok Business',
    tagline: 'TikTok Direct Message API',
    accountRequirement: 'Registered TikTok Business Account + App Review approval',
    permissions: ['business.message.read', 'business.message.write'],
    capabilities: ['Direct Message replies (Business accounts only)', 'Webhook events'],
    status: 'pending_approval',
    requiresApproval: true,
    officialUrl: 'https://business-api.tiktok.com/portal/docs'
  }
] as const;

export const DAILY_FREE_REPLY_LIMIT = 150;

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  category: z.enum(['general', 'sales', 'support', 'enterprise', 'security']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
