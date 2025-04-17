import { NextRequest, NextResponse } from 'next/server';
import { MessageService } from '@/services/messaging/MessageService';
import config from '@/config/messaging';
import { siteConfig } from '@/config/site';
import { TelegramProvider } from '@/services/messaging/providers/TelegramProvider';

// 简单的认证检查
const validateAdminRequest = (req: NextRequest) => {
  const authToken = req.headers.get('x-admin-token');
  return authToken === process.env.ADMIN_SECRET_KEY;
};

export async function POST(req: NextRequest) {
  // 验证请求
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 初始化消息服务
    const messageService = new MessageService();
    await messageService.initialize(config);

    // 获取 Telegram 提供商
    const telegramProvider = messageService.getProvider('telegram') as TelegramProvider;

    if (!telegramProvider || typeof (telegramProvider as any).setWebhook !== 'function') {
      return NextResponse.json(
        { error: 'Telegram provider not available or does not support webhooks' },
        { status: 500 }
      );
    }

    // 设置 webhook
    const webhookPath = config.telegram.webhook?.path || '/api/webhook/telegram';
    const webhookUrl = `${siteConfig.url}${webhookPath}`;

    const success = await telegramProvider.setWebhook(webhookUrl);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Webhook set to ${webhookUrl}`,
      });
    } else {
      return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error setting up webhooks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
