import { NextResponse } from 'next/server';
import { fetchStockAnnouncement } from '@/services/stockService';
import { extractPDFTextFromUrl } from '@/services/docService';
import { chat, generateSummaryPrompt } from '@/services/aiService';
import { StockMarket } from '@/types/stock';
import { MessageService } from '@/services/messaging/MessageService';
import { prisma } from '@/lib/prisma';
import { logger } from '@/logger/index';

let messageService: MessageService | null = null;

export async function GET() {
  // 初始化消息服务
  if (!messageService) {
    messageService = new MessageService();
    await messageService.initialize();
  }

  const announcements = await fetchNewAnnouncements({
    stockCode: '000858',
    stockMarket: 'SZ',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
  });
  if (!announcements) return;

  for (const announcement of announcements) {
    if (announcement.adjunctUrl) {
      const text = await extractPDFTextFromUrl(announcement.adjunctUrl);
      if (!text) continue;
      const prompt = generateSummaryPrompt(text);
      const summary = await chat({ content: prompt });
      if (!summary) continue;

      const subscribers = await getSubscribers(announcement.secCode);
      if (!subscribers || subscribers.length === 0) continue;

      logger.info(`发送公告 "${announcement.announcementTitle}" 到 ${subscribers.length} 个订阅者`);

      for (const subscriber of subscribers) {
        try {
          await messageService.sendMessage({
            content: {
              text: `📊 ${announcement.announcementTitle}\n\n${summary}\n\n📎 查看原文: ${announcement.adjunctUrl}`,
              html: `<b>📊 ${announcement.announcementTitle}</b><br><br>${summary}<br><br>📎 <a href="${announcement.adjunctUrl}">查看原文</a>`,
            },
            recipient: subscriber.channelUserId,
            options: {
              provider: subscriber.channel,
            },
          });

          console.log(`成功发送消息到 ${subscriber.channel}:${subscriber.channelUserId}`);
        } catch (error) {
          console.error(`发送消息失败: ${error}`);
        }
      }
    }
  }

  return NextResponse.json({ message: 'ok' }, { status: 200 });
}

async function fetchNewAnnouncements({
  stockCode,
  stockMarket,
  timestamp,
}: {
  stockCode: string;
  stockMarket: StockMarket;
  timestamp: number;
}) {
  const rsp = await fetchStockAnnouncement({
    stockMarket,
    stockCode,
    start: timestamp,
    end: timestamp,
    pageNum: 1,
    pageSize: 50,
  });
  if (!rsp?.announcements.length) return null;
  return rsp.announcements;
}

/**
 * 获取特定股票的订阅者
 */
async function getSubscribers(stockCode: string) {
  try {
    // 从数据库查询订阅者
    const subscriptions = await prisma.subscription.findMany({
      where: {
        stockCode,
        active: true, // 假设有一个 active 字段表示订阅是否激活
      },
      select: {
        channelUserId: true,
        channel: true,
      },
    });

    return subscriptions;
  } catch (error) {
    console.error(`获取订阅者失败: ${error}`);
    return [];
  }
}
