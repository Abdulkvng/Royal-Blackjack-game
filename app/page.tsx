import BlackjackGame from '@/components/BlackjackGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-zinc-800 mb-8 tracking-wide">ROYAL BLACKJACK</h1>
      <BlackjackGame />
    </main>
  );
}