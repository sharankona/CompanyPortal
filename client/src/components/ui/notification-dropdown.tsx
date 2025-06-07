
import React from "react";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Check, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { ScrollArea } from "./scroll-area";
import { Badge } from "./badge";
import { IconWrapper } from "./icon-wrapper";

export const NotificationType = {
  info: { icon: <Info className="h-4 w-4" />, color: "bg-blue-100 text-blue-600 dark:text-blue-400" },
  success: { icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-600 dark:text-green-400" },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-600 dark:text-yellow-400" },
  error: { icon: <XCircle className="h-4 w-4" />, color: "bg-red-100 text-red-600 dark:text-red-400" },
};

const NotificationItem = ({ notification, onRead }: { notification: Notification, onRead: () => void }) => {
  const { markAsRead, clearNotification } = useNotifications();
  const { type, title, message, timestamp, read, id, link } = notification;
  const { icon, color } = NotificationType[type];

  const handleClick = () => {
    if (!read) {
      markAsRead(id);
    }
    onRead();
  };

  const Content = () => (
    <div className={`flex p-3 ${read ? 'opacity-70' : ''}`}>
      <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${color}`}>
        <IconWrapper>
          {icon}
        </IconWrapper>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">{title}</h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearNotification(id);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link}>
        <a className="block hover:bg-accent rounded-md cursor-pointer" onClick={handleClick}>
          <Content />
        </a>
      </Link>
    );
  }

  return (
    <div className="hover:bg-accent rounded-md cursor-pointer" onClick={handleClick}>
      <Content />
    </div>
  );
};

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const [open, setOpen] = React.useState(false);

  const handleReadAll = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-slate-100 relative"
        >
          <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleReadAll} className="h-8 w-8 p-0" title="Mark all as read">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-8 w-8 p-0" title="Clear all">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} asChild>
                  <NotificationItem 
                    notification={notification} 
                    onRead={() => setOpen(false)}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Bell className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                When you get notifications, they'll show up here
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
