import { Suspense } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchStockEvent } from '@/services/stockService';
import { formatDate } from '@/utils/format';

type StockEventTimeLineProps = {
  stockCode: string;
};

const StockEventTimeLine: React.FC<StockEventTimeLineProps> = async ({ stockCode }) => {
  const stockEvent = await fetchStockEvent(stockCode);
  const now = Date.now();
  const stockEventList = stockEvent.slice(0, 7).map((event) => ({
    title: event.eventReason,
    description: event.eventTerm,
    date: formatDate(event.eventDate),
    isOver: event.eventDate < now,
  })) as { title: string; description: string; date: string; isOver: boolean }[];

  return (
    <Card>
      <CardHeader>
        <h3>重大事项</h3>
      </CardHeader>
      <CardContent>
        <Timeline>
          {stockEventList.map(({ isOver, title, description, date }, index) => (
            <TimelineItem key={index} status={isOver ? 'done' : 'default'}>
              <TimelineHeading>
                <span className="mr-8px">{date}</span>
                <span>{title}</span>
              </TimelineHeading>

              <TimelineDot status={isOver ? 'current' : 'default'} />
              {index !== stockEventList.length - 1 && <TimelineLine done={isOver} />}
              <TimelineContent>{description}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

const StockEvent: React.FC<StockEventTimeLineProps> = ({ stockCode }) => (
  <Suspense fallback={<Skeleton count={8} height={32} className="mb-12px" />}>
    <StockEventTimeLine stockCode={stockCode} />
  </Suspense>
);

export default StockEvent;
