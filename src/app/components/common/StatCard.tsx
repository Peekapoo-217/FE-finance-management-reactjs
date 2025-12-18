import React from 'react';
import { Card } from '../ui/layout/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconColor,
  valueColor = 'text-gray-900'
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className={`text-2xl mt-2 ${valueColor}`}>
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className={iconColor} size={24} />
        </div>
      </div>
    </Card>
  );
}

