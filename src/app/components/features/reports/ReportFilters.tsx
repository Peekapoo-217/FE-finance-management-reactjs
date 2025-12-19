import React from 'react';
import { Card } from '../../ui/layout/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/form/select';

interface Category {
  id: string | number;
  name: string;
  type: 'income' | 'expense';
}

interface ReportFiltersProps {
  category: string;
  categories: Category[];
  onCategoryChange: (category: string) => void;
}

export function ReportFilters({ 
  category,
  categories,
  onCategoryChange 
}: ReportFiltersProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600 whitespace-nowrap">Danh mục</label>
        <div className="flex-1">
          <Select value={category || "all"} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

