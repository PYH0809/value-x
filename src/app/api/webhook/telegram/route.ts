import { NextRequest, NextResponse } from 'next/server';
import { MessageService } from '@/services/messaging/MessageService';
import { logger } from '@/logger/index';

// 单例消息服务实例
let messageService: MessageService | null = null;

const getMessageService = async () => {
  if (!messageService) {
    messageService = new MessageService();
    await messageService.initialize();

    // 注册事件处理器
    messageService.onMessageEvent('message:received', async (event) => {
      const message = event.payload as any;

      // 如果是命令消息，进行处理
      if (message.command) {
        await handleCommand(message);
      }
    });
  }
  return messageService;
};

/**
 * 处理命令消息
 */
async function handleCommand(message: any) {
  const service = await getMessageService();
  logger.info(`Handling command: ${message.command}`, { message });
  switch (message.command) {
    case '/start':
      await service.sendMessage({
        content: '欢迎使用股票公告订阅服务！\n\n使用 /subscribe 股票代码 来订阅公告，例如：\n/subscribe 000858',
        recipient: message.sender,
        options: { provider: message.provider },
      });
      break;

    case '/subscribe':
      if (message.args && message.args.length > 0) {
        const stockCode = message.args[0];
        // TODO: 实现订阅逻辑
        await service.sendMessage({
          content: `✅ 成功订阅股票 ${stockCode} 的公告更新！`,
          recipient: message.sender,
          options: { provider: message.provider },
        });
      } else {
        await service.sendMessage({
          content: '请提供股票代码，例如：/subscribe 000858',
          recipient: message.sender,
          options: { provider: message.provider },
        });
      }
      break;

    default:
      await service.sendMessage({
        content: `未知命令: ${message.command}。使用 /start 查看可用命令。`,
        recipient: message.sender,
        options: { provider: message.provider },
      });
  }
}

export async function POST(request: NextRequest, { params }: { params: { provider: string } }) {
  const { provider } = params;

  try {
    logger.info(`Received webhook request for ${provider}`);
    const payload = await request.json();
    const service = await getMessageService();

    // 处理webhook请求
    const message = await service.handleWebhook(provider, payload);

    if (!message) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    return NextResponse.json({ status: 'processed' }, { status: 200 });
  } catch (error) {
    logger.error(`Error processing ${provider} webhook:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
