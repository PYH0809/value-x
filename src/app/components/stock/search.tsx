'use client';
import { Stock, StockMarket } from '@/types/stock';
import { SearchDialog } from '../serch-dialog';
import { useState, useEffect, useMemo, useRef } from 'react';
import { requestStockSearch } from '@/client-services/stock';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';

const Search: React.FC = () => {
  const isFirstRun = useRef(true);
  const [keyword, setKeyword] = useState<string>('');
  const [debouncedKeyword] = useDebounce(keyword, 300);

  const [searchResult, setSearchResult] = useState<Stock[]>([]);

  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dropDownItems = useMemo(() => {
    return searchResult.map((stock) => ({
      title: stock.name,
      desc: stock.code,
      value: stock.code,
      orgId: stock.orgId,
    }));
  }, [searchResult]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value);
  };

  const handleSearch = (item: { desc: string; title: string; value: string }) => {
    const target = searchResult.find((stock) => stock.code === item.value);
    if (!target) return;
    const { orgId } = target;
    const stockMarket: StockMarket = orgId.startsWith('gssh') ? 'SH' : 'SZ';
    const params = new URLSearchParams(searchParams);
    params.set('code', item.value);
    params.set('tab', 'qa');
    params.set('pageNum', '1');
    params.set('market', stockMarket as StockMarket);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClose = () => {
    setKeyword('');
    setSearchResult([]);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const fetchSearchResult = async () => {
      const result = await requestStockSearch(debouncedKeyword);
      if (!result?.length) {
        setSearchResult([]);
      } else {
        setSearchResult(result);
      }
    };
    fetchSearchResult();
  }, [debouncedKeyword]);

  return (
    <SearchDialog
      items={dropDownItems}
      onSearch={handleSearch}
      onInput={handleInput}
      shouldFilter={false}
      onClosed={handleClose}
      inputPlaceholder="Type a code or name to search..."
    />
  );
};

export default Search;
