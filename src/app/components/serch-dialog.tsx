'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-64 justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12'
        )}
        onClick={() => setOpen(true)}
      >
        <span className="lg:inline-flex">{placeholder ?? 'Search...'} </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
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
