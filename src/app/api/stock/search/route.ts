import { NextResponse, NextRequest } from 'next/server';
import { fetchStockList } from '@/services/stockService';

/**
 * @param {string} keyword -
 * @desc search stock by stock code or name
 */

const MAX_SEARCH_RESULT = 10;
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');
  if (!keyword) {
    return NextResponse.json({ message: 'Please provide a keyword' }, { status: 400 });
  }
  const stockList = await fetchStockList();

  const filteredStock = stockList
    .filter((stock) => {
      return (
        stock.name.toLowerCase().includes(keyword.toLowerCase()) ||
        stock.code.toLowerCase().includes(keyword.toLowerCase()) ||
        stock.shortName.toLowerCase().includes(keyword.toLowerCase())
      );
    })
    .slice(0, MAX_SEARCH_RESULT);
  return NextResponse.json(filteredStock);
}
