import React from 'react';
import { TokenSelector } from './TokenSelector';
import type { Token } from './SwapWidget';

interface SwapInputProps {
  label: string;
  token: Token;
  amount: string;
  onAmountChange: (amount: string) => void;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
  readOnly?: boolean;
  showBalance?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  tokens,
  readOnly = false,
  showBalance = false,
}) => {
  const handleMaxClick = () => {
    if (token.balance && !readOnly) {
      onAmountChange(token.balance.replace(',', ''));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-swap-text-muted">{label}</span>
        {showBalance && token.balance && (
          <button
            onClick={handleMaxClick}
            className="text-sm text-swap-text-muted hover:text-swap-accent transition-colors"
          >
            Balance: {token.balance}
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-swap-input rounded-lg border border-swap-border">
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className="w-full bg-transparent text-2xl font-semibold text-swap-text placeholder-swap-text-muted outline-none"
          />
        </div>
        
        <TokenSelector
          selectedToken={token}
          onTokenSelect={onTokenSelect}
          tokens={tokens}
        />
      </div>
    </div>
  );
};