import { useCallback, useEffect, useState } from 'react';
import { config } from '@/lib/config';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface RecaptchaResult {
  success: boolean;
  score?: number;
  isBot?: boolean;
  action?: string;
  timestamp?: string;
  error?: string;
}

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsLoaded(true);
      return;
    }

    // Wait for the script to load
    const checkRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true);
        });
      } else {
        setTimeout(checkRecaptcha, 100);
      }
    };

    checkRecaptcha();
  }, []);

  const executeRecaptcha = useCallback(async (action: string = 'homepage'): Promise<RecaptchaResult> => {
    if (!isLoaded || !window.grecaptcha) {
      return { success: false, error: 'reCAPTCHA not loaded' };
    }

    const siteKey = config.recaptcha.siteKey;
    if (!siteKey) {
      return { success: false, error: 'reCAPTCHA site key not configured' };
    }

    setIsLoading(true);

    try {
      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(siteKey, { action });

      // Verify the token with our backend
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const result = await response.json();
      setIsLoading(false);

      return result;
    } catch (error) {
      setIsLoading(false);
      console.error('reCAPTCHA execution error:', error);
      return { success: false, error: 'reCAPTCHA execution failed' };
    }
  }, [isLoaded]);

  const detectBot = useCallback(async (action?: string): Promise<boolean> => {
    const result = await executeRecaptcha(action);
    if (!result.success) {
      // If reCAPTCHA fails, assume it might be a bot for safety
      console.warn('reCAPTCHA failed, treating as potential bot:', result.error);
      return true;
    }
    return result.isBot || false;
  }, [executeRecaptcha]);

  return {
    isLoaded,
    isLoading,
    executeRecaptcha,
    detectBot,
  };
} 