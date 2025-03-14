import type { Metadata } from 'next';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  StockEvent,
  StockIntroduction,
  StockQuestion,
  StockTabNavigation,
  StockSearch,
  StockName,
  StockFinancial,
  StockPriceRealTime,
  StockWeekLineChart,
  StockAnnouncement,
} from '@/components/stock';
import { Separator } from '@/components/ui/separator';
import { StockMarket } from '@/types/stock';
import './page.css';
import { fetchStock } from '@/services/stockService';

type TabId = 'qa' | 'announcement' | 'info' | 'document';

type Props = {
  searchParams: Promise<{ tab: TabId; pageNum: string; code: string; market: StockMarket }>;
};

export default async function Stock({ searchParams }: Props) {
  const { pageNum, code: stockCode, market, tab } = await searchParams;

  const currentPage = parseInt(pageNum) || 1;

  const tabItems = TAB_NAVIGATION.map((item) => ({
    ...item,
    href: `/stock?code=${stockCode}&market=${market}&tab=${item.id}`,
  }));

  return (
    <div className="flex flex-col pt-24px">
      <div className="mb-24px flex items-center justify-between">
        <StockName stockCode={stockCode}></StockName>
        <StockSearch />
      </div>

      <div className="flex xl:gap-36px">
        <div className="left-bar flex-1">
          <Card className="flex h-[300px] flex-col md:h-[600px]">
            <CardHeader>
              <StockPriceRealTime stockCode={stockCode} stockMarket={market}></StockPriceRealTime>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-y-16px">
              <StockFinancial stockCode={stockCode} stockMarket={market}></StockFinancial>
              <StockWeekLineChart
                className="hidden md:block"
                stockCode={stockCode}
                stockMarket={market}
              ></StockWeekLineChart>
            </CardContent>
          </Card>
          <StockTabNavigation className="mt-24px" items={tabItems}></StockTabNavigation>
          <Separator className="mb-16px mt-4px" />
          <div className="flex flex-col gap-y-24px">
            {tab === 'qa' && <StockQuestion stockCode={stockCode} pageNum={currentPage} pageSize={10}></StockQuestion>}
            {tab === 'announcement' && (
              <StockAnnouncement stockCode={stockCode} stockMarket={market} pageNum={currentPage}></StockAnnouncement>
            )}
          </div>
        </div>
        <div className="right-bar hidden flex-1 flex-col gap-y-32px xl:flex" style={{ maxWidth: '495px' }}>
          <StockIntroduction stockCode={stockCode}></StockIntroduction>
          <StockEvent stockCode={stockCode}></StockEvent>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { code, tab } = await searchParams;
  const stock = await fetchStock(code);
  const stockName = stock?.name || '';
  const tabTitle = TAB_NAVIGATION.find((item) => item.id === tab)?.title || '';
  return {
    title: `${stockName} - ${tabTitle}`,
    description: `${stockName} - ${tabTitle}`,
  };
}

const TAB_NAVIGATION = [
  { id: 'qa', title: '公司问答' },
  {
    id: 'announcement',
    title: '公司公告',
  },
  {
    id: 'info',
    title: '公司信息',
  },
  {
    id: 'document',
    title: '公司文档',
  },
];
