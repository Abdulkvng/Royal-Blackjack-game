import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameTable({ children, className }: GameTableProps) {
  return (
    <Card className={cn(
      "w-full max-w-3xl bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-600",
      className
    )}>
      {children}
    </Card>
  );
}