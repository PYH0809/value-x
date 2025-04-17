import { EventEmitter } from 'events';
import { Message, InboundMessage, MessageEvent, ProviderConfig } from './types';
import { BaseProvider } from './providers/BaseProvider';
import { TelegramProvider } from './providers/TelegramProvider';
import { logger } from '@/logger/index';
import config from '@/config/messaging';
import { siteConfig } from '@/config/site';

export class MessageService {
  private providers: Map<string, BaseProvider> = new Map();
  private defaultProvider: string;
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.defaultProvider = 'telegram'; // 默认提供商
  }

  /**
   * 初始化消息服务和所有提供商
   */
  async initialize(configs?: Record<string, ProviderConfig>): Promise<void> {
    logger.info('Initializing MessageService');

    // 从配置文件或参数获取配置
    const providerConfigs = configs || config;

    // 初始化所有配置的提供商
    if (providerConfigs.telegram) {
      const telegramProvider = new TelegramProvider(providerConfigs.telegram, this.eventEmitter);
      this.providers.set('telegram', telegramProvider);

      // 设置Telegram Webhook (如果启用)
      if (providerConfigs.telegram.webhook?.enabled) {
        const baseUrl = siteConfig.url || '';
        const webhookUrl = `${baseUrl}${providerConfigs.telegram.webhook.path}`;
        await telegramProvider.setWebhook(webhookUrl);
      }
    }

    logger.info(`MessageService initialized with providers: ${Array.from(this.providers.keys()).join(', ')}`);
  }

  /**
   * 发送消息
   * @param message 要发送的消息
   * @returns 发送结果
   */
  async sendMessage(message: Message): Promise<boolean> {
    // 处理字符串内容
    if (typeof message.content === 'string') {
      message = {
        ...message,
        content: { text: message.content },
      };
    }

    const providerName = message.options?.provider || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      logger.error(`Provider ${providerName} not found or not initialized`);
      throw new Error(`Provider ${providerName} not found or not initialized`);
    }

    logger.info(`Sending message via ${providerName} provider`);
    return provider.sendMessage(message);
  }

  /**
   * 处理来自webhook的请求
   * @param providerName 提供商名称
   * @param payload webhook负载
   * @returns 处理后的入站消息
   */
  async handleWebhook(providerName: string, payload: any): Promise<InboundMessage | null> {
    const provider = this.providers.get(providerName);

    if (!provider) {
      logger.error(`Provider ${providerName} not found or not initialized`);
      throw new Error(`Provider ${providerName} not found or not initialized`);
    }

    logger.info(`Handling webhook for ${providerName} provider`);
    return provider.handleWebhook(payload);
  }

  /**
   * 订阅消息事件
   * @param type 事件类型
   * @param handler 事件处理函数
   */
  onMessageEvent(type: string, handler: (event: MessageEvent) => void): void {
    this.eventEmitter.on(type, handler);
    logger.debug(`Event listener registered for ${type}`);
  }

  /**
   * 设置默认提供商
   * @param providerName 提供商名称
   */
  setDefaultProvider(providerName: string): void {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider ${providerName} not found or not initialized`);
    }
    this.defaultProvider = providerName;
    logger.info(`Default provider set to ${providerName}`);
  }

  /**
   * 获取所有已注册的提供商名称
   */
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * 获取指定名称的提供商实例
   * @param providerName 提供商名称
   */
  getProvider(providerName: string): BaseProvider | undefined {
    return this.providers.get(providerName);
  }
}
