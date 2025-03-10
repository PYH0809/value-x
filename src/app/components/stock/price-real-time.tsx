'use client';

import { useState, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { requestStockTrade } from '@/client-services';
import { StockMarket } from '@/types/stock';
import { formatNumber } from '@/utils/format';

type StockPriceRealTimeProps = {
  stockCode: string;
  stockMarket: StockMarket;
};

type PriceData = {
  price: number;
  percent: number;
  chg: number;
  symbol: string;
};

const UPDATE_INTERVAL = 1000 * 10;

const SrockPriceRealTime: React.FC<StockPriceRealTimeProps> = (args: StockPriceRealTimeProps) => {
  const { stockCode, stockMarket } = args;

  const [priceData, setPriceData] = useState<PriceData>({ price: 0, percent: 0, chg: 0, symbol: '' });
  const isInited = useMemo(() => priceData.symbol.includes(stockCode), [priceData.symbol, stockCode]);

  useEffect(() => {
    const fetchPrice = async () => {
      const stockTrade = await requestStockTrade({ stockCode, stockMarket });
      const currentTrade = stockTrade?.data[0];
      if (currentTrade) {
        const { current: newPrice, percent, chg, symbol } = currentTrade;
        setPriceData({ price: newPrice, percent, chg, symbol });
      }
    };

    fetchPrice();

    const timeId = setInterval(() => {
      fetchPrice();
    }, UPDATE_INTERVAL);

    return () => {
      clearInterval(timeId);
    };
  }, [stockCode, stockMarket]);

  const formatPercent = useMemo(() => {
    const formatPercent = formatNumber(priceData.percent);
    return priceData.percent > 0 ? `+${formatPercent}%` : `${formatPercent}%`;
  }, [priceData.percent]);

  const formatChg = useMemo(() => {
    const formatChg = formatNumber(priceData.chg);
    return priceData.chg > 0 ? `+${formatChg}` : `${formatChg}`;
  }, [priceData.chg]);

  const Price = (
    <div className="flex items-center gap-16px">
      <h1>{priceData.price}</h1>
      <div className="flex flex-col gap-4px">
        <div className="typography-muted">{formatPercent}</div>
        <div className="typography-muted">{formatChg}</div>
      </div>
    </div>
  );
  return isInited ? Price : <Skeleton count={1} height={40} width={150} />;
};

export default SrockPriceRealTime;
