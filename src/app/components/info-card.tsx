import { Separator } from '@/components/ui/separator';

type InfoCardProps = {
  title: string;
  description?: string;
  sorce?: string;
  time?: string;
  name?: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, sorce, time, name }) => {
  const hasDeteails = sorce || time || name;
  const details = [sorce, time, name].filter(Boolean).join(' • ');
  return (
    <div>
      <div className="mb-8px flex flex-col gap-y-12px">
        <div className="typography-large">{title}</div>
        {description && <div className="typography-small">{description}</div>}
        {hasDeteails && <div className="typography-muted">{details}</div>}
      </div>
      <Separator />
    </div>
  );
};

InfoCard.displayName = 'InfoCard';

export default InfoCard;
