import React from 'react';

interface ProgressBarProps {
  percentage: number;
  isWarning: boolean;
}

export function ProgressBar({ percentage, isWarning }: ProgressBarProps) {
  const colorClass = percentage >= 100 ? 'bg-red-600' : 
                     percentage >= 80 ? 'bg-orange-500' : 
                     'bg-green-500';
  const width = `${Math.min(percentage, 100)}%`;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all ${colorClass}`}
        style={{ width }}
      />
    </div>
  );
}

