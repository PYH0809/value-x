import { EventEmitter } from 'events';
import { Message, InboundMessage, ProviderConfig, TelegramMessage } from '../types';
import { BaseProvider } from './BaseProvider';
import { logger } from '@/logger/index';

export class TelegramProvider extends BaseProvider {
  protected isWebHookSet: boolean = false;

  constructor(config: ProviderConfig, eventEmitter: EventEmitter) {
    super('telegram', config, eventEmitter);
  }

  async sendMessage(message: Message): Promise<boolean> {
    // 处理内容可能是字符串的情况
    const messageContent = typeof message.content === 'string' ? { text: message.content } : message.content;

    const { recipient } = message;

    if (Array.isArray(recipient)) {
      // 如果有多个接收者，分别发送
      const results = await Promise.all(recipient.map((chatId) => this.sendSingleMessage(chatId, messageContent)));
      return results.every((result) => result);
    } else {
      return this.sendSingleMessage(recipient, messageContent);
    }
  }

  private async sendSingleMessage(chatId: string, content: any): Promise<boolean> {
    try {
      logger.debug(`Sending Telegram message to ${chatId}`);
      const response = await fetch(`${this.config.apiUrl}/bot${this.config.apiKey}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: content.text,
          parse_mode: content.html ? 'HTML' : 'Markdown',
        }),
      });
      const data = await response.json();
      logger.debug('Telegram API response:', data);
      if (response.ok) {
        this.emitEvent('message:sent', {
          recipient: chatId,
          content,
        });
        return true;
      }

      logger.error(`Telegram API error: ${JSON.stringify(data)}`);
      this.emitEvent('message:failed', {
        message: { recipient: chatId, content },
        error: 'Telegram API returned false',
      });
      return false;
    } catch (error) {
      logger.error(`Error sending Telegram message:`, error);
      this.emitEvent('message:failed', {
        message: { recipient: chatId, content },
        error,
      });
      return false;
    }
  }

  async handleWebhook(payload: any): Promise<InboundMessage | null> {
    logger.debug('Received Telegram webhook payload:', payload);
    // 确保这是一个有效的Telegram更新
    if (!payload || !payload.message) {
      logger.debug('Invalid Telegram webhook payload', payload);
      return null;
    }
    const message = payload.message as TelegramMessage;
    logger.debug(`Received Telegram message entities: ${message.entities}`);

    logger.debug(`Received Telegram webhook: ${JSON.stringify(message)}`);

    const inboundMessage: InboundMessage = {
      sender: message.chat.id.toString(),
      content: message.text || '',
      timestamp: new Date(message.date * 1000),
      raw: payload,
      provider: this.name,
    };

    // 格式化消息，提取命令和参数
    const formattedMessage = this.formatInboundMessage(inboundMessage);

    // 发出消息接收事件
    this.emitEvent('message:received', formattedMessage);

    return formattedMessage;
  }

  // 设置Webhook URL
  async setWebhook(url: string): Promise<boolean> {
    if (this.isWebHookSet) {
      logger.info('Webhook already set, skipping...');
      return true;
    }
    try {
      const response = await fetch(`${this.config.apiUrl}/bot${this.config.apiKey}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          allowed_updates: ['message', 'edited_message', 'channel_post', 'edited_channel_post'],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        logger.info(`Telegram webhook set to ${url}`);
        this.isWebHookSet = true;
        return true;
      }

      logger.error(`Failed to set Telegram webhook: ${JSON.stringify(data)}`);
      return false;
    } catch (error) {
      logger.error('Error setting Telegram webhook:', error);
      return false;
    }
  }
}
