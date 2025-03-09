'use client';

import { StockQuestionResponse } from '@/types/stock';
import { requestStockQuestion } from '@/client-services';
import InfoCard from '@/components/info-card';
import { formatDate } from '@/utils/format';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import { useMemo, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { useInfiniteQuery } from '@tanstack/react-query';

type StockQuestionProps = {
  stockCode: string;
  pageNum: number;
  pageSize: number;
  initQuestionList?: StockQuestionResponse[];
};

const StockQuestionList: React.FC<StockQuestionProps> = (args: StockQuestionProps) => {
  const { pageSize, stockCode, pageNum, initQuestionList } = args;
  const [ref, inView] = useInView();
  const hasInitData = !!initQuestionList?.length;
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['stockQuestion', pageNum, pageSize, stockCode],
    queryFn: ({ pageParam = hasInitData ? 2 : 1 }) => requestStockQuestion({ pageNum: pageParam, pageSize, stockCode }),
    initialData: { pages: hasInitData ? [initQuestionList] : [], pageParams: hasInitData ? [pageNum] : [] },
    initialPageParam: pageNum,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length < pageSize) return undefined;
      return pages.length + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const displayList = useMemo(() => {
    if (!data.pages.length) return [];
    return data.pages.flat().map((question) => ({
      indexId: question?.indexId,
      mainContent: question?.mainContent,
      attachedContent: question?.attachedContent,
      pubDate: formatDate(question?.pubDate),
      authorName: question?.authorName,
    }));
  }, [data]);

  return (
    <>
      <div className="flex flex-col gap-y-24px">
        {displayList.map((question) => (
          <InfoCard
            key={question.indexId}
            title={question.mainContent}
            description={question.attachedContent}
            time={question.pubDate}
            name={question.authorName}
          />
        ))}
      </div>
      <div ref={ref} />
      {isFetching && <Skeleton count={2} height={32} className="mb-24px" />}
    </>
  );
};

export default StockQuestionList;
