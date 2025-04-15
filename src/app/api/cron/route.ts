import { fetchStockAnnouncement } from '@/services/stockService';
import { extractPDFTextFromUrl } from '@/services/docService';
import { chat, generateSummaryPrompt } from '@/services/aiService';
import { StockMarket } from '@/types/stock';

export async function GET() {
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
    }
  }
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
