import { NextRequest, NextResponse } from 'next/server';

export type MessageContent = {
  subject?: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
};

export type MessageOptions = {
  provider?: string; // 具体的提供商名称，如 'telegram', 'email', 'wechat'
  priority?: 'high' | 'normal' | 'low';
  retry?: {
    attempts: number;
    delay: number;
  };
};

export type Message = {
  content: MessageContent | string; // 支持简单字符串或完整内容对象
  recipient: string | string[]; // 可以是电子邮件、聊天ID等
  options?: MessageOptions;
};

export type InboundMessage = {
  sender: string;
  content: string;
  timestamp: Date;
  provider: string;
  raw: TelegramMessage; // 原始消息数据
  command?: string; // 可能的命令，如 '/start', '/subscribe'
  args?: string[]; // 命令参数
};

// 新增事件类型定义
export type MessageEventType = 'message:received' | 'message:sent' | 'message:failed';

export type MessageEvent = {
  type: MessageEventType;
  payload: InboundMessage | Message;
  timestamp: Date;
  provider: string;
};

export type WebhookConfig = {
  enabled: boolean;
  path: string; // API路径
  secret?: string; // 可选的安全密钥
};

export type ProviderConfig = {
  apiKey?: string;
  apiSecret?: string;
  webhook?: WebhookConfig;
};

export type WebhookHandler = {
  handleRequest(req: NextRequest): Promise<NextResponse>;
};

export type TelegramMessage = {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    type: string;
  };
  date: number;
  text: string;
  entities: [];
};

export type TelegramWebhookPayload = {
  update_id: number;
  message: TelegramMessage;
};
