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

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
    action: 'created a new',
    target: 'product',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    type: 'product',
  },
  {
    id: '2',
    user: { name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    action: 'placed an',
    target: 'order #1234',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: 'order',
  },
  {
    id: '3',
    user: { name: 'Admin', avatar: '/avatars/admin.jpg' },
    action: 'uploaded a new',
    target: 'file',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'file',
  },
  {
    id: '4',
    user: { name: 'System', avatar: undefined },
    action: 'detected low stock for',
    target: 'Laptop Pro 14 inch',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    type: 'alert',
  },
  {
    id: '5',
    user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    action: 'registered as a new',
    target: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: 'user',
  },
  {
    id: '6',
    user: { name: 'Admin', avatar: '/avatars/admin.jpg' },
    action: 'updated system',
    target: 'settings',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    type: 'system',
  },
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
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
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground">
                      {activity.user.name}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {activity.action}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.target}
                    </Badge>
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

