import { fetchStockIntroduction } from '@/services/stockService';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card';

type StockIntroductionCardProps = {
  stockCode: string;
  className?: string;
};

const StockIntroduction: React.FC<StockIntroductionCardProps> = async ({ stockCode, className }) => {
  const introduction = await fetchStockIntroduction(stockCode);

  return (
    <Card className={className}>
      <CardHeader>
        <h3>{introduction.fullNmae}</h3>
        <CardDescription>{stockCode}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{introduction.companyProfile} </p>
      </CardContent>
      {/* <CardFooter>
        <a className="font-medium underline underline-offset-4">View More</a>
      </CardFooter> */}
    </Card>
  );
};

export default StockIntroduction;
