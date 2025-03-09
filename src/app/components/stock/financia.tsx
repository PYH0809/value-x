import { Suspense } from 'react';
import { StockMarket } from '@/types/stock';
import { fetchStockFinancialData, fetchStockTrade, FinancialItem } from '@/services/stockService';
import { formatNumber } from '@/utils/format';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FINANCIA_ITEM_CN_MAP: Record<FinancialItem, string> = {
  ROE: 'ROE',
  mainRevenue: '主营收入',
  netProfit: '净利润',
  CCE: '货币资金',
  debtRatio: '资产负债率',
  totalShares: '总股本',
  circulatingShares: '流通股本',
  goodwill: '商誉',
  accountsReceivable: '应收账款',
  pledgeRate: '质押率',
};

type StockFinancialProps = {
  stockCode: string;
  stockMarket: StockMarket;
};

const StockFinancial: React.FC<StockFinancialProps> = async (args: StockFinancialProps) => {
  const { stockCode, stockMarket } = args;
  const stockFinancialData = await fetchStockFinancialData(stockCode);
  const stockTrade = await fetchStockTrade({ stockCode, stockMarket });
  const stockPrice = stockTrade?.data[0]?.current;
  const totalMarketValue = stockPrice * stockFinancialData?.totalShares;
  const PE = totalMarketValue / stockFinancialData?.netProfit;

  const displayData = Object.entries(stockFinancialData).map(([key, value]) => ({
    id: key,
    value,
    title: FINANCIA_ITEM_CN_MAP[key as FinancialItem],
  }));
  displayData.push({ id: 'PE', value: PE, title: 'PE' });

  return (
    <div className="flex w-full flex-wrap gap-y-8px">
      {displayData.map((data) => (
        <div className="flex-cell box-border flex flex-wrap items-center gap-y-4px" key={data.id}>
          <span className="typography-muted lh mr-4px w-full text-center md:w-auto">{data.title}:</span>
          <span className="typography-small w-full text-center md:w-auto">{formatNumber(data.value)}</span>
        </div>
      ))}
    </div>
  );
};

const StockFinancialSkeleton = (
  <div className="flex w-full flex-wrap gap-x-24px gap-y-8px">
    {[...Array(8)].map((_, index) => (
      <div className="flex-cell box-border flex w-full flex-wrap items-center px-16px" key={index}>
        <Skeleton containerClassName="w-full" height={24} />
      </div>
    ))}
  </div>
);
// const StockFinancialSkeleton = (
//   <div className="w-ful tablel border-collapse">
//     {Array.from({ length: 2 }).map((_, index) => (
//       <div key={index} className="table-row">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <div key={index} className="table-cell px-4px">
//             <Skeleton height={20} />
//           </div>
//         ))}
//       </div>
//     ))}
//   </div>
// );

const StockFinancialWithSkeleton: React.FC<StockFinancialProps> = (props) => (
  <Suspense fallback={StockFinancialSkeleton}>
    <StockFinancial {...props} />
  </Suspense>
);

export default StockFinancialWithSkeleton;
