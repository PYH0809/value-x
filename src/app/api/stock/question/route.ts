import { NextResponse, NextRequest } from 'next/server';
import { fetchStockQuestionByEastmoney } from '@/services/stockService';

/**
 * @param {string} orgId -
 * @param {string} stockCode -
 * @param {number} pageNum -
 * @param {number} pageSize -
 * @desc fetch stock question by eastmoney
 */

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const stockCode = url.searchParams.get('stockCode');
  const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  if (!stockCode) {
    return NextResponse.json({ message: 'Please provide orgId and stockCode' }, { status: 400 });
  }
  const res = await fetchStockQuestionByEastmoney({ stockCode, pageNum, pageSize });
  return NextResponse.json(res);
}
