import { EventEmitter } from 'events';
import { Message, InboundMessage, MessageEvent, ProviderConfig, MessageEventType } from '../types';
import { logger } from '@/logger/index';

export abstract class BaseProvider {
  protected name: string;
  protected config: ProviderConfig;
  protected eventEmitter: EventEmitter;

  constructor(name: string, config: ProviderConfig, eventEmitter: EventEmitter) {
    this.name = name;
    this.config = config;
    this.eventEmitter = eventEmitter;

    logger.info(`Initialized provider: ${name}`);
  }

  /**
   * 发送消息的抽象方法
   * @param message 要发送的消息
   * @returns 发送是否成功
   */
  abstract sendMessage(message: Message): Promise<boolean>;

  /**
   * 处理webhook请求的抽象方法
   * @param payload webhook传入的负载
   * @returns 解析后的入站消息，如果无法处理则返回null
   */
  abstract handleWebhook(payload: any): Promise<InboundMessage | null>;

  /**
   * 发射事件的通用方法
   * @param type 事件类型
   * @param payload 事件负载
   */
  protected emitEvent(type: string, payload: any): void {
    const event: MessageEvent = {
      type: type as MessageEventType,
      payload,
      timestamp: new Date(),
      provider: this.name,
    };

    this.eventEmitter.emit(type, event);
    logger.debug(`Emitted event: ${type}`, { provider: this.name });
  }

  /**
   * 格式化入站消息，提取命令和参数
   * @param message 入站消息
   * @returns 处理后的入站消息
   */
  protected formatInboundMessage(message: InboundMessage): InboundMessage {
    const content = message.content.trim();

    if (content.startsWith('/')) {
      const parts = content.split(' ');
      const command = parts[0];
      const args = parts.slice(1).filter((arg) => arg.length > 0);

      return {
        ...message,
        command,
        args,
      };
    }

    return message;
  }
}
