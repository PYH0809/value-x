'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Search as SearchIcon } from 'lucide-react';

type SearchItem = {
  value: string;
  title: string;
  desc: string;
};

type SearchDialogProps = {
  items: SearchItem[];
  placeholder?: string;
  shouldFilter?: boolean;
  inputPlaceholder?: string;
  onSearch: (item: SearchItem) => void;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  onClosed?: () => void;
  onOpen?: () => void;
};

export function SearchDialog({ ...props }: SearchDialogProps) {
  const { onInput, onSearch, onClosed, onOpen, items, placeholder, inputPlaceholder, shouldFilter } = props;
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClosed) {
      onClosed();
    }
    if (isOpen && onOpen) {
      onOpen();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-fit justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none'
        )}
        onClick={() => setOpen(true)}
      >
        <span className="mr-8px hidden md:block lg:inline-flex">{placeholder ?? '搜索公司...'} </span>
        <SearchIcon size={16} />
      </Button>
      <CommandDialog shouldFilter={shouldFilter} open={open} onOpenChange={handleOpenChange}>
        <DialogTitle className="hidden" />
        <CommandInput onInput={onInput} placeholder={inputPlaceholder ?? 'Type to search...'} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                className="flex justify-between"
                key={item.value}
                onSelect={() => {
                  setOpen(false);
                  onSearch(item);
                }}
              >
                <span>{item.title}</span>
                <span>{item.desc}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
