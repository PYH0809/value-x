'use client';

import { StockMarket, StockWeekTradeResponse } from '@/types/stock';
import { requestStockHistoryTrade } from '@/client-services';
import { useEffect, useState, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/format';
import {
  init as kLineInit,
  // Styles as KlineStyles,
  dispose as kLineDispose,
  KLineData,
  CandleType,
  NeighborData,
  TooltipShowRule,
} from 'klinecharts';

type StockWeekLineChartProps = {
  stockCode: string;
  stockMarket: StockMarket;
  className?: string;
};

const StockWeekLineChart: React.FC<StockWeekLineChartProps> = (args: StockWeekLineChartProps) => {
  const { stockCode, stockMarket, className } = args;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stockHistoryTrade, setStockHistoryTrade] = useState<StockWeekTradeResponse['data']>([]);

  const kLineData = useMemo(() => {
    return stockHistoryTrade.map((trade) => {
      const [dateStr, priceStr] = trade;
      const timesStamp = new Date(dateStr).getTime();
      const price = parseFloat(priceStr);
      const data: KLineData = {
        timestamp: timesStamp,
        open: price,
        close: price,
        high: price,
        low: price,
      };
      return data;
    });
  }, [stockHistoryTrade]);

  useEffect(() => {
    setIsLoading(true);
    requestStockHistoryTrade({ stockCode, stockMarket }).then((res) => {
      setStockHistoryTrade(res?.data);
      setIsLoading(false);
    });
  }, [stockCode, stockMarket]);

  useEffect(() => {
    if (!kLineData.length) return;
    const kLineChart = kLineInit('kline', { styles: klineStyles });
    if (!kLineChart) return;
    kLineChart.applyNewData(kLineData);
    kLineChart.setOffsetRightDistance(0);
    kLineChart.setMaxOffsetRightDistance(0);
    kLineChart.setMaxOffsetLeftDistance(0);
    const handleResize = () => {
      kLineChart.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      kLineDispose('kline');
    };
  });

  return isLoading ? (
    <Skeleton className={cn(className, 'w-full flex-1')}></Skeleton>
  ) : (
    <div id="kline" className={cn(className, 'w-full flex-1')}></div>
  );
};

export default StockWeekLineChart;

const klineStyles = {
  grid: {
    show: false,
  },
  candle: {
    type: CandleType.Area,
    tooltip: {
      showRule: TooltipShowRule.FollowCross,
      custom: (data: NeighborData<KLineData>) => {
        return [
          { title: '日期：', value: formatDate(data.current?.timestamp || 0) },
          { title: '价格：', value: data.current?.close.toString() || '' },
        ];
      },
    },
  },
};
