import { StockMarket } from '@/types/stock';
import { Suspense } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchStockAnnouncement } from '@/services/stockService';
import Pagination from '@/components/pagination';
import InfoCard from '@/components/info-card';
import { formatDate } from '@/utils/format';

type Props = {
  stockCode: string;
  stockMarket: StockMarket;
  pageNum: number;
};

const StockAnnouncement: React.FC<Props> = async ({ stockCode, stockMarket, pageNum }) => {
  const rsp = await fetchStockAnnouncement({ stockCode, stockMarket, pageNum });
  if (!rsp) return null;
  const { announcements, totalpages, pageNum: repPageNum } = rsp;
  if (!announcements?.length) return null;
  return (
    <>
      {announcements.map((announcement) => (
        <InfoCard
          key={announcement.announcementId}
          title={announcement.announcementTitle}
          attachmentLink={announcement.adjunctUrl}
          time={formatDate(announcement.announcementTime)}
        />
      ))}
      <Pagination total={totalpages} current={repPageNum} />
    </>
  );
};

const StockAnnouncementWithSuspense: React.FC<Props> = (args: Props) => {
  return (
    <Suspense fallback={<Skeleton count={8} height={32} className="mb-12px" />}>
      <StockAnnouncement {...args} />
    </Suspense>
  );
};

export default StockAnnouncementWithSuspense;
