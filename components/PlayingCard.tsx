import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: string;
  hidden?: boolean;
}

export default function PlayingCard({ card, hidden = false }: PlayingCardProps) {
  if (hidden) {
    return (
      <div className="w-16 h-24 bg-gradient-to-br from-zinc-300 to-zinc-400 rounded-lg shadow-lg m-1 border border-zinc-200" />
    );
  }

  const isRed = card?.includes('♥') || card?.includes('♦');
  
  return (
    <div className={cn(
      "w-16 h-24 bg-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg m-1 border border-zinc-200",
      isRed ? "text-red-500" : "text-zinc-900"
    )}>
      {card}
    </div>
  );
}