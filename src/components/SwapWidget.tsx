import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, RefreshCw, ChevronDown } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Mock exchange rates (in practice, this would come from an API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  ETH: { DEXT: 2450.32, USDT: 2500, USDC: 2500 },
  DEXT: { ETH: 0.000408, USDT: 1.02, USDC: 1.02 },
  USDT: { ETH: 0.0004, DEXT: 0.98, USDC: 1.0 },
  USDC: { ETH: 0.0004, DEXT: 0.98, USDT: 1.0 },
};

const PROVIDERS = [
  { value: 'kyberswap', label: 'KyberSwap', icon: '🔄' },
  { value: 'uniswap', label: 'Uniswap', icon: '🦄' },
  { value: 'okx', label: 'OKX', icon: '🔷' },
  { value: '1inch', label: '1inch', icon: '🥃' },
  { value: 'matcha', label: 'Matcha', icon: '🍵' },
  { value: 'paraswap', label: 'ParaSwap', icon: '📊' },
  { value: 'openocean', label: 'OpenOcean', icon: '🌊' },
];

export const SwapWidget = () => {
  const [fromToken, setFromToken] = useState<Token>(MOCK_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(MOCK_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('0.0');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('kyberswap');
  const { toast } = useToast();
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Calculate exchange rate and update amounts
  const calculateToAmount = (from: string, fromSym: string, toSym: string) => {
    if (!from || from === '0' || fromSym === toSym) return '0.0';
    const rate = EXCHANGE_RATES[fromSym]?.[toSym] || 1;
    const result = (parseFloat(from) * rate).toFixed(6);
    return parseFloat(result).toString();
  };

  // Update toAmount when fromAmount or tokens change
  useEffect(() => {
    const newToAmount = calculateToAmount(fromAmount, fromToken.symbol, toToken.symbol);
    setToAmount(newToAmount);
  }, [fromAmount, fromToken.symbol, toToken.symbol]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleConnectWallet = () => {
    const connector = connectors.find(c => c.name === 'MetaMask') || connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    });
  };

  const handleSwap = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
      });
      return;
    }
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
              <span className="text-swap-text-muted">Price per {fromToken.symbol}</span>
              <span className="text-swap-text">
                {EXCHANGE_RATES[fromToken.symbol]?.[toToken.symbol]?.toLocaleString() || '1'} {toToken.symbol}
              </span>
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
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-32 h-8 bg-transparent border-none text-swap-text text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-swap-card border-swap-border">
                  {PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value} className="text-swap-text text-xs">
                      <div className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        <span>{provider.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-swap-text-muted">Connected:</span>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="text-swap-accent hover:underline"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </button>
                </div>
                <Button
                  variant="swap"
                  className="w-full"
                  onClick={handleSwap}
                >
                  Swap
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};