import React, { useState } from 'react';
import { ArrowUpDown, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TokenSelector } from './TokenSelector';
import { SwapInput } from './SwapInput';
import { SwapSettings } from './SwapSettings';
import { useToast } from '@/hooks/use-toast';

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
}

const MOCK_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', balance: '2.5432' },
  { symbol: 'DEXT', name: 'DexTools', icon: '🔧', balance: '1,250.00' },
  { symbol: 'USDT', name: 'Tether USD', icon: '₮', balance: '500.25' },
  { symbol: 'USDC', name: 'USD Coin', icon: '⊙', balance: '750.80' },
];

export const SwapWidget = () => {
  const [fromToken, setFromToken] = useState<Token>(MOCK_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(MOCK_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('0.0');
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleConnectWallet = () => {
    setIsConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Successfully connected your wallet",
    });
  };

  const handleSwap = () => {
    toast({
      title: "Swap Initiated",
      description: `Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
    });
  };

  return (
    <div className="min-h-screen bg-swap-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-swap-card border-swap-border">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-swap-accent" />
              <h1 className="text-lg font-semibold text-swap-text">DEXTswap</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-swap-text-muted hover:text-swap-text"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && <SwapSettings />}

          {/* From Token */}
          <div className="space-y-4">
            <SwapInput
              label="From"
              token={fromToken}
              amount={fromAmount}
              onAmountChange={setFromAmount}
              onTokenSelect={setFromToken}
              tokens={MOCK_TOKENS}
              showBalance
            />

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapTokens}
                className="rounded-full bg-swap-input border border-swap-border text-swap-text hover:bg-swap-border/50"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Token */}
            <SwapInput
              label="To"
              token={toToken}
              amount={toAmount}
              onAmountChange={setToAmount}
              onTokenSelect={setToToken}
              tokens={MOCK_TOKENS}
              readOnly
            />
          </div>

          {/* Price Info */}
          <div className="mt-6 p-4 bg-swap-input rounded-lg border border-swap-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-swap-text-muted">Price per ETH</span>
              <span className="text-swap-text">2,450.32 DEXT</span>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-swap-text-muted">Slippage</span>
              <span className="text-swap-accent">Auto ⚙</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-swap-text-muted">Provider</span>
              <div className="flex items-center gap-2">
                <span className="text-swap-text">◦ ◦ ◦</span>
                <span className="text-swap-text">▼</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-swap-text-muted">By OKX</span>
              <div className="flex items-center gap-2">
                <span className="text-swap-text-muted">Or try</span>
                <span className="text-swap-accent">🦄 Uniswap V2</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-swap-text-muted">By BitBase</span>
              <Button variant="outline" size="sm" className="h-8 px-3 bg-orange-500 border-orange-500 text-white hover:bg-orange-600">
                💳 Buy Crypto
              </Button>
            </div>
          </div>

          {/* Connect/Swap Button */}
          <div className="mt-6">
            {!isConnected ? (
              <Button
                variant="swap"
                className="w-full"
                onClick={handleConnectWallet}
              >
                Connect wallet
              </Button>
            ) : (
              <Button
                variant="swap"
                className="w-full"
                onClick={handleSwap}
              >
                Swap
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};