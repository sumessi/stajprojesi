'use client';

import * as React from 'react';
import { useId, useState } from 'react';
import { LayoutGridIcon, PlusIcon, SearchIcon } from 'lucide-react';
import InfoMenu from './InfoMenu';
import NotificationMenu from './NotificationMenu';
import SettingsMenu from './SettingsMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
//import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

// Types
export interface Navbar14Props extends React.HTMLAttributes<HTMLElement> {
  searchPlaceholder?: string;
  searchValue?: string;
  testMode?: boolean;
  showTestMode?: boolean;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    unread?: boolean;
  }>;
  onSearchChange?: (value: string) => void;
  onTestModeChange?: (enabled: boolean) => void;
  onLayoutClick?: () => void;
  onAddClick?: () => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationClick?: (notificationId: string) => void;
  onSettingsItemClick?: (item: string) => void;
}

export const Navbar14 = React.forwardRef<HTMLElement, Navbar14Props>(
  (
    {
      className,
      searchPlaceholder = 'Search...',
      searchValue,
      testMode: controlledTestMode,
      showTestMode = true,
      notifications,
      onSearchChange,
      onTestModeChange,
      onLayoutClick,
      onAddClick,
      onInfoItemClick,
      onNotificationClick,
      onSettingsItemClick,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [internalTestMode, setInternalTestMode] = useState<boolean>(true);
    
    // Use controlled or internal test mode state
    const testModeValue = controlledTestMode !== undefined ? controlledTestMode : internalTestMode;
    
    const handleTestModeChange = (checked: boolean) => {
      if (controlledTestMode === undefined) {
        setInternalTestMode(checked);
      }
      if (onTestModeChange) {
        onTestModeChange(checked);
      }
    };

    return (
      <header
        ref={ref}
        className={cn(
          'border-b px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...(props as any)}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="relative flex-1">
            <Input
              id={`input-${id}`}
              className="peer h-8 w-full max-w-xs ps-8 pe-2"
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Test mode */}
            {showTestMode && (
              <div className="inline-flex items-center gap-2 max-md:hidden">
                <label htmlFor={`switch-${id}`} className="text-sm font-medium">
                  Test mode
                </label>
                <Toggle
                  id={`toggle-${id}`}
                  checked={testModeValue}
                  onCheckedChange={handleTestModeChange}
                  aria-label="Toggle test mode"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Layout button */}
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground size-8 rounded-full shadow-none"
                aria-label="Open layout menu"
                onClick={(e) => {
                  e.preventDefault();
                  if (onLayoutClick) onLayoutClick();
                }}
              >
                <LayoutGridIcon size={16} aria-hidden="true" />
              </Button>
              {/* Info menu */}
              <InfoMenu onItemClick={onInfoItemClick} />
              {/* Notification */}
              <NotificationMenu 
                notifications={notifications}
                onNotificationClick={onNotificationClick}
              />
              {/* Settings */}
              <SettingsMenu onItemClick={onSettingsItemClick} />
            </div>
            {/* Add button */}
            <Button
              className="size-8 rounded-full"
              size="icon"
              aria-label="Add new item"
              onClick={(e) => {
                e.preventDefault();
                if (onAddClick) onAddClick();
              }}
            >
              <PlusIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>
    );
  }
);

Navbar14.displayName = 'Navbar14';

export { InfoMenu, NotificationMenu, SettingsMenu };