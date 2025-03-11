import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type InfoCardProps = {
  title: string;
  description?: string;
  sorce?: string;
  time?: string;
  name?: string;
  attachmentName?: string;
  attachmentLink?: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, sorce, time, name, attachmentLink }) => {
  const hasDeteails = sorce || time || name;
  const details = [sorce, time, name].filter(Boolean).join(' • ');
  const hasAttachment = !!attachmentLink;

  return (
    <div>
      <div className="group relative mb-8px flex flex-col gap-y-12px">
        <div className={cn('typography-large', hasAttachment ? 'cursor-pointer group-hover:underline' : '')}>
          {title}
        </div>
        {description && <div className="typography-small">{description}</div>}
        {hasDeteails && <div className="typography-muted">{details}</div>}
        {hasAttachment && (
          <Link href={attachmentLink} target="_blank" rel="noreferrer" className="absolute inset-0"></Link>
        )}
      </div>
      <Separator />
    </div>
  );
};

InfoCard.displayName = 'InfoCard';

export default InfoCard;
