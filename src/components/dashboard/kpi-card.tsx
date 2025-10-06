'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}: KPICardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 text-xs">
            <Badge
              variant={change.type === 'increase' ? 'default' : 'secondary'}
              className={cn(
                'px-2 py-0.5',
                change.type === 'increase' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                change.type === 'decrease' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              )}
            >
              <span className="mr-1">{getChangeIcon(change.type)}</span>
              {Math.abs(change.value)}%
            </Badge>
            <span className={getChangeColor(change.type)}>
              from last month
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

