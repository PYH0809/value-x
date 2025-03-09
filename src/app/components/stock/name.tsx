import { Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchStock } from '@/services/stockService';
type StockNameProps = {
  stockCode: string;
};

const StockName: React.FC<StockNameProps> = async (args: StockNameProps) => {
  const { stockCode } = args;
  const stock = await fetchStock(stockCode);

  return <h2>{stock?.name}</h2>;
};

const StockNameWithSuspense: React.FC<StockNameProps> = (args: StockNameProps) => {
  return (
    <Suspense fallback={<Skeleton count={1} height={40} width={150} />}>
      <StockName stockCode={args.stockCode} />
    </Suspense>
  );
};

export default StockNameWithSuspense;
