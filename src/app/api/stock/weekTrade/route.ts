import { NextResponse, NextRequest } from 'next/server';
import { StockWeekTradeResponse, StockMarket } from '@/types/stock';
import { fetchStock } from '@/services/stockService';

/**
 * @param {string} stockCode - stock code
 * @param {StockMarket} stockMarket - stock market
 * @desc get week line trade data
 * @return {WeekTradeResponse}
 */

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const stockCode = params.get('stockCode') || '';
  const stockMarket = (params.get('stockMarket') as StockMarket) || '';
  if (!stockCode) return NextResponse.json({ message: 'Please provide a stock code' }, { status: 400 });

  const stock = await fetchStock(stockCode);
  if (!stock) return NextResponse.json({ message: 'Stock not found' }, { status: 404 });
  const symbol = `${stockMarket.toLocaleLowerCase()}${stockCode}`;
  const searchParams = new URLSearchParams();
  searchParams.set('code', symbol);
  searchParams.set('type', 'raw');
  const url = new URL(process.env.TENCENT_GU_API_BASE_URL + '/other/klineweb/klineWeb/weekTrends');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data: StockWeekTradeResponse = await response.json();
  return NextResponse.json(data);
}
