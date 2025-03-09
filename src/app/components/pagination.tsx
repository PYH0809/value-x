'use client';

import {
  Pagination as PaginationUI,
  PaginationLink,
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type PaginationProps = {
  total: number;
  current: number;
  showCount?: number;
  className?: string;
};

const DEFAULT_SHOW_COUNT = 3;

const Pagination: React.FC<PaginationProps> = ({ total, current, showCount, className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const maxShowCount = showCount || DEFAULT_SHOW_COUNT;
  const isOverShowCount = total > maxShowCount;

  const paginationElements: React.JSX.Element[] = [];

  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('pageNum', page.toString());
    const newPath = `${pathname}?${params.toString()}`;
    router.replace(newPath);
  };

  if (isOverShowCount) {
    const halfShowCount = Math.floor(maxShowCount / 2);
    const start = Math.max(1, current - halfShowCount);
    const end = Math.min(total, current + halfShowCount);

    if (current - halfShowCount > 1) {
      paginationElements.push(
        <PaginationItem key="first">
          <PaginationLink onClick={(e) => handlePageChange(1, e)} href="#">
            1
          </PaginationLink>
        </PaginationItem>
      );
      paginationElements.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
      paginationElements.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={(e) => handlePageChange(i, e)} isActive={i === current}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (current + halfShowCount < total) {
      paginationElements.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
      paginationElements.push(
        <PaginationItem key="last">
          <PaginationLink onClick={(e) => handlePageChange(total, e)}>{total}</PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    for (let i = 1; i <= total; i++) {
      paginationElements.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" isActive={i === current}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }

  return (
    <PaginationUI className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {paginationElements}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </PaginationUI>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;
