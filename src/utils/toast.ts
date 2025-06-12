import { toast as globalToast } from "@/components/ui/use-toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description: string;
  type?: ToastType;
}

// Debounce function to prevent multiple toasts in quick succession
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// Create debounced globalToast function
const debouncedGlobalToast = debounce(globalToast, 300);

const toast = {
  success: (options: Omit<ToastOptions, "type">) => {
    debouncedGlobalToast({
      title: options.title || "Success",
      description: options.description,
      variant: "default",
    });
  },

  error: (options: Omit<ToastOptions, "type">) => {
    debouncedGlobalToast({
      title: options.title || "Error",
      description: options.description,
      variant: "destructive",
    });
  },

  info: (options: Omit<ToastOptions, "type">) => {
    debouncedGlobalToast({
      title: options.title || "Info",
      description: options.description,
      variant: "default",
    });
  },

  warning: (options: Omit<ToastOptions, "type">) => {
    debouncedGlobalToast({
      title: options.title || "Warning",
      description: options.description,
      variant: "destructive",
    });
  },

  // Generic toast function that accepts type
  show: (options: ToastOptions) => {
    const variant = options.type === "error" || options.type === "warning" ? "destructive" : "default";
    const title = options.title || (options.type ? options.type.charAt(0).toUpperCase() + options.type.slice(1) : "Notification");
    debouncedGlobalToast({
      title,
      description: options.description,
      variant,
    });
  },
};

export { toast };