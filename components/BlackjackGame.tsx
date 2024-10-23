'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, RefreshCcw } from 'lucide-react';
import GameTable from './GameTable';
import PlayingCard from './PlayingCard';

interface GameState {
  playerHand: string[];
  dealerHand: string[];
  playerScore: number;
  dealerScore: number;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'finished';
  chips: number;
  currentBet: number;
  message: string;
}

const initialState: GameState = {
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
  gameStatus: 'betting',
  chips: 1000,
  currentBet: 0,
  message: 'Place your bet to start',
};

const BETTING_OPTIONS = [
  { amount: 10, label: '10' },
  { amount: 25, label: '25' },
  { amount: 50, label: '50' },
  { amount: 100, label: '100' },
];

export default function BlackjackGame() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [deck, setDeck] = useState<string[]>([]);

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = suits.flatMap(suit => values.map(value => value + suit));
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: string[]) => {
    return [...deck].sort(() => Math.random() - 0.5);
  };

  const calculateScore = (hand: string[]) => {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
      const value = card.slice(0, -1);
      if (value === 'A') {
        aces += 1;
        score += 11;
      } else if (['K', 'Q', 'J'].includes(value)) {
        score += 10;
      } else {
        score += parseInt(value);
      }
    });

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  const dealInitialCards = () => {
    const newDeck = [...deck];
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setGameState(prev => ({
      ...prev,
      playerHand: playerCards,
      dealerHand: dealerCards,
      playerScore: calculateScore(playerCards),
      dealerScore: calculateScore([dealerCards[0]]),
      gameStatus: 'playing',
    }));
  };

  const placeBet = (amount: number) => {
    if (gameState.chips >= amount) {
      setGameState(prev => ({
        ...prev,
        chips: prev.chips - amount,
        currentBet: amount,
        gameStatus: 'playing',
        message: 'Game in progress',
      }));
      dealInitialCards();
    }
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...gameState.playerHand, newCard];
    const newScore = calculateScore(newHand);

    setDeck(newDeck);
    setGameState(prev => ({
      ...prev,
      playerHand: newHand,
      playerScore: newScore,
      ...(newScore > 21 && {
        gameStatus: 'finished',
        message: 'Bust! You lose!',
      }),
    }));
  };

  const dealerPlay = () => {
    let currentDealerHand = [...gameState.dealerHand];
    let currentDeck = [...deck];
    let dealerScore = calculateScore(currentDealerHand);

    while (dealerScore < 17) {
      const newCard = currentDeck.pop()!;
      currentDealerHand.push(newCard);
      dealerScore = calculateScore(currentDealerHand);
    }

    const playerScore = calculateScore(gameState.playerHand);
    let message = '';
    let winnings = 0;

    if (dealerScore > 21) {
      message = 'Dealer busts! You win!';
      winnings = gameState.currentBet * 2;
    } else if (dealerScore > playerScore) {
      message = 'Dealer wins!';
    } else if (dealerScore < playerScore) {
      message = 'You win!';
      winnings = gameState.currentBet * 2;
    } else {
      message = 'Push!';
      winnings = gameState.currentBet;
    }

    setDeck(currentDeck);
    setGameState(prev => ({
      ...prev,
      dealerHand: currentDealerHand,
      dealerScore: dealerScore,
      gameStatus: 'finished',
      message,
      chips: prev.chips + winnings,
    }));
  };

  const stand = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'dealerTurn',
    }));
  };

  const resetGame = () => {
    if (gameState.chips <= 0) {
      setGameState(initialState);
    } else {
      setGameState(prev => ({
        ...initialState,
        chips: prev.chips,
      }));
    }
    setDeck(createDeck());
  };

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  useEffect(() => {
    if (gameState.gameStatus === 'dealerTurn') {
      dealerPlay();
    }
  }, [gameState.gameStatus]);

  return (
    <GameTable>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-3 rounded-lg">
          <Coins className="text-yellow-400 h-6 w-6" />
          <span className="text-xl font-bold text-zinc-100">{gameState.chips}</span>
        </div>
        <Badge variant="secondary" className="text-lg bg-zinc-900/50 text-zinc-100">
          Current Bet: {gameState.currentBet}
        </Badge>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-zinc-200">Dealer's Hand</h2>
          <div className="flex flex-wrap gap-2">
            {gameState.dealerHand.map((card, index) => (
              <PlayingCard
                key={index}
                card={gameState.gameStatus === 'playing' && index === 1 ? undefined : card}
                hidden={gameState.gameStatus === 'playing' && index === 1}
              />
            ))}
          </div>
          <p className="mt-2 text-zinc-300">Score: {gameState.gameStatus === 'playing' ? '?' : gameState.dealerScore}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-zinc-200">Your Hand</h2>
          <div className="flex flex-wrap gap-2">
            {gameState.playerHand.map((card, index) => (
              <PlayingCard key={index} card={card} />
            ))}
          </div>
          <p className="mt-2 text-zinc-300">Score: {gameState.playerScore}</p>
        </div>

        <div className="text-center text-xl font-bold text-zinc-100">
          {gameState.message}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {gameState.gameStatus === 'betting' && (
            <>
              {BETTING_OPTIONS.map(({ amount, label }) => (
                <Button
                  key={amount}
                  onClick={() => placeBet(amount)}
                  disabled={gameState.chips < amount}
                  variant="secondary"
                  className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
                >
                  Bet {label}
                </Button>
              ))}
            </>
          )}

          {gameState.gameStatus === 'playing' && (
            <>
              <Button
                onClick={hit}
                variant="secondary"
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
              >
                Hit
              </Button>
              <Button
                onClick={stand}
                variant="secondary"
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
              >
                Stand
              </Button>
            </>
          )}

          {gameState.gameStatus === 'finished' && (
            <Button
              onClick={resetGame}
              variant="secondary"
              className="flex items-center gap-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
            >
              <RefreshCcw className="w-4 h-4" />
              Play Again
            </Button>
          )}
        </div>
      </div>
    </GameTable>
  );
}