import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const SwapSettings: React.FC = () => {
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('20');

  const slippagePresets = ['0.1', '0.5', '1.0'];

  return (
    <div className="mb-6 p-4 bg-swap-input rounded-lg border border-swap-border space-y-4">
      <div>
        <label className="block text-sm font-medium text-swap-text mb-2">
          Slippage Tolerance
        </label>
        <div className="flex gap-2 mb-2">
          {slippagePresets.map((preset) => (
            <Button
              key={preset}
              variant={slippage === preset ? "swap" : "swap-outline"}
              size="sm"
              onClick={() => setSlippage(preset)}
              className="h-8"
            >
              {preset}%
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="flex-1 px-3 py-2 bg-swap-card border border-swap-border rounded text-swap-text placeholder-swap-text-muted outline-none focus:ring-2 focus:ring-swap-accent"
            placeholder="0.50"
            step="0.1"
            min="0"
            max="50"
          />
          <span className="text-swap-text">%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-swap-text mb-2">
          Transaction Deadline
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 px-3 py-2 bg-swap-card border border-swap-border rounded text-swap-text placeholder-swap-text-muted outline-none focus:ring-2 focus:ring-swap-accent"
            placeholder="20"
            min="1"
          />
          <span className="text-swap-text">minutes</span>
        </div>
      </div>
    </div>
  );
};