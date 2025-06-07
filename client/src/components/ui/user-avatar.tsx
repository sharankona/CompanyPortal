import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@shared/schema";

type SafeUser = Omit<User, "password"> | null;

interface UserAvatarProps {
  user: SafeUser;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  if (!user) return null;
  
  // Get initials for the avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const initials = getInitials(user?.fullName);
  
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm"
  };
  
  return (
    <Avatar className={`bg-primary text-primary-foreground ${sizeClasses[size]}`}>
      <AvatarFallback className="font-medium">{initials}</AvatarFallback>
    </Avatar>
  );
}
