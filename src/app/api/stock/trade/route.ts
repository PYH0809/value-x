import { NextResponse, NextRequest } from 'next/server';
import { StockTradeResponse, StockMarket } from '@/types/stock';

/**
 * @param {string} stockCode - stock code
 * @param {StockMarket} stockMarket - stock market
 * @desc get real time trade data
 * @return {StockTradeResponse}
 */

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;

  const stockCode = params.get('stockCode') || '';
  const stockMarket = (params.get('stockMarket') as StockMarket) || '';
  if (!stockCode) return NextResponse.json({ message: 'Please provide a stock code' }, { status: 400 });
  if (!stockMarket) return NextResponse.json({ message: 'Please provide a stock market' }, { status: 400 });

  const symbol = `${stockMarket}${stockCode}`;
  const searchParams = new URLSearchParams();
  searchParams.set('symbol', symbol);
  const url = new URL(`${process.env.XUEQIU_API_BASE_URL}/stock/realtime/quotec.json`);
  url.search = searchParams.toString();

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      UserAgent: process.env.USER_AGENT || '',
    },
  });

  const data: StockTradeResponse = await response.json();
  return NextResponse.json({ ...data });
}
