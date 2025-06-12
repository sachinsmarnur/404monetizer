import { cn } from "@/lib/utils";

interface TextAvatarProps {
  name: string;
  className?: string;
}

export function TextAvatar({ name, className }: TextAvatarProps) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium",
        className
      )}
    >
      {firstLetter}
    </div>
  );
} 