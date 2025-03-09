import { StockTradeResponse, Stock, StockMarket, StockWeekTradeResponse } from '@/types/stock';

export const requestStockSearch = async (keyword: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set('keyword', keyword);
  const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL + '/stock/search');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  if (response.status !== 200) return null;
  const rsp = await response.json();
  return rsp as Stock[];
};

export const requestStockQuestion = async ({
  stockCode,
  pageNum,
  pageSize,
}: {
  stockCode: string;
  pageNum: number;
  pageSize: number;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set('stockCode', stockCode);
  searchParams.set('pageNum', pageNum.toString());
  searchParams.set('pageSize', pageSize.toString());
  const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL + '/stock/question');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  if (response.status !== 200) return null;
  const rsp = await response.json();
  return rsp;
};

export const requestStockTrade = async ({
  stockCode,
  stockMarket,
}: {
  stockCode: string;
  stockMarket: StockMarket;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set('stockCode', stockCode);
  searchParams.set('stockMarket', stockMarket);
  const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL + '/stock/trade');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  const rsp = await response.json();
  return rsp as StockTradeResponse;
};

export const requestStockHistoryTrade = async ({
  stockCode,
  stockMarket,
}: {
  stockCode: string;
  stockMarket: StockMarket;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set('stockCode', stockCode);
  searchParams.set('stockMarket', stockMarket);
  const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL + '/stock/weekTrade');
  url.search = searchParams.toString();
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  const rsp = await response.json();
  return rsp as StockWeekTradeResponse;
};
