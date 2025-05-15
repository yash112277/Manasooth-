
import type { SupportedLanguage } from '@/contexts/LanguageContext';
import { Home, ClipboardList, BarChart3, Bot, Video, LifeBuoy, Target, Smile } from 'lucide-react';

export interface NavItemConfig {
  href: string;
  labelKey: string; 
  icon: React.ElementType;
  requiresAuth: boolean;
  translations: Record<SupportedLanguage, string>;
}

export const navItemsConfig: NavItemConfig[] = [
  { href: '/', labelKey: 'home', icon: Home, requiresAuth: false, translations: { en: 'Home', hi: 'होम' } },
  { href: '/assessment', labelKey: 'assessments', icon: ClipboardList, requiresAuth: false, translations: { en: 'Assessments', hi: 'मूल्यांकन' } },
  { href: '/progress', labelKey: 'progress', icon: BarChart3, requiresAuth: false, translations: { en: 'Progress', hi: 'प्रगति' } },
  { href: '/goals', labelKey: 'goals', icon: Target, requiresAuth: false, translations: { en: 'Goals', hi: 'लक्ष्य' } },
  { href: '/mood-tracker', labelKey: 'moodTracker', icon: Smile, requiresAuth: false, translations: { en: 'Mood Tracker', hi: 'मूड ट्रैकर' } },
  { href: '/chatbot', labelKey: 'chatbot', icon: Bot, requiresAuth: false, translations: { en: 'AI Chatbot', hi: 'एआई चैटबॉट' } },
  { href: '/consultation', labelKey: 'consultation', icon: Video, requiresAuth: false, translations: { en: 'Consultation', hi: 'परामर्श' } },
  { href: '/local-support', labelKey: 'support', icon: LifeBuoy, requiresAuth: false, translations: { en: 'Local Support', hi: 'स्थानीय सहायता' } },
];
