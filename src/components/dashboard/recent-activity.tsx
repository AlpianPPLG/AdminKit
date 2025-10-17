/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import {
  UserPlus,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  AlertCircle,
} from 'lucide-react';
import React from 'react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  type: 'user' | 'product' | 'order' | 'file' | 'system' | 'alert';
}

// fetched from /api/dashboard/activity
const mockActivities: ActivityItem[] = [];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user':
      return UserPlus;
    case 'product':
      return Package;
    case 'order':
      return ShoppingCart;
    case 'file':
      return FileText;
    case 'system':
      return Settings;
    case 'alert':
      return AlertCircle;
    default:
      return FileText;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user':
      return 'text-blue-600 dark:text-blue-400';
    case 'product':
      return 'text-green-600 dark:text-green-400';
    case 'order':
      return 'text-purple-600 dark:text-purple-400';
    case 'file':
      return 'text-orange-600 dark:text-orange-400';
    case 'system':
      return 'text-gray-600 dark:text-gray-400';
    case 'alert':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export function RecentActivity() {
  const [activities, setActivities] = React.useState<ActivityItem[]>(mockActivities);
  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/dashboard/activity');
        const json = await res.json();
        if (json?.success) {
          const mapped: ActivityItem[] = (json.data as any[]).map((a) => ({
            id: String(a.id),
            user: { name: a.user?.name || 'User', avatar: a.user?.avatar_url },
            action: a.action,
            target: a.details || '',
            timestamp: new Date(a.created_at),
            type: inferTypeFromAction(a.action),
          }));
          setActivities(mapped);
        }
      } catch (e) {
        // ignore, keep defaults
      }
    };
    fetchActivities();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.user.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.user.name}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                      {activity.action.replace(/_/g, ' ')}
                    </Badge>
                    {activity.target && (
                      <span className="text-sm text-muted-foreground truncate max-w-[220px]">
                        {activity.target}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon className={`h-3 w-3 ${colorClass}`} />
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function inferTypeFromAction(action: string): ActivityItem['type'] {
  const a = (action || '').toUpperCase();
  if (a.includes('ORDER')) return 'order';
  if (a.includes('PRODUCT')) return 'product';
  if (a.includes('LOGIN') || a.includes('USER') || a.includes('REGISTER')) return 'user';
  if (a.includes('FILE') || a.includes('UPLOAD')) return 'file';
  return 'system';
}
