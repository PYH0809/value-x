import { ProviderConfig } from '@/services/messaging/types';

const config: Record<string, ProviderConfig> = {
  telegram: {
    apiKey: process.env.TELEGRAM_BOT_TOKEN || '',
    webhook: {
      enabled: true,
      path: '/api/webhook/telegram',
      secret: process.env.TELEGRAM_WEBHOOK_SECRET,
    },
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY || '',
    apiSecret: process.env.EMAIL_API_SECRET || '',
    webhook: {
      enabled: false,
      path: '/api/webhook/email',
    },
  },
  wechat: {
    apiKey: process.env.WECHAT_API_KEY || '',
    apiSecret: process.env.WECHAT_API_SECRET || '',
    webhook: {
      enabled: true,
      path: '/api/webhook/wechat',
      secret: process.env.WECHAT_WEBHOOK_SECRET,
    },
  },
};

export default config;
