import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Token } from './SwapWidget';

interface TokenSelectorProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  tokens,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="swap-outline"
          className="h-12 gap-2 justify-between min-w-[120px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedToken.icon}</span>
            <span className="font-medium">{selectedToken.symbol}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-swap-text-muted" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-swap-card border-swap-border"
      >
        {tokens.map((token) => (
          <DropdownMenuItem
            key={token.symbol}
            onClick={() => onTokenSelect(token)}
            className="flex items-center gap-3 p-3 cursor-pointer text-swap-text hover:bg-swap-input"
          >
            <span className="text-xl">{token.icon}</span>
            <div className="flex-1">
              <div className="font-medium">{token.symbol}</div>
              <div className="text-sm text-swap-text-muted">{token.name}</div>
            </div>
            {token.balance && (
              <div className="text-sm text-swap-text-muted">
                {token.balance}
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};