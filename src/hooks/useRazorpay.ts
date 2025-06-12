import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/utils/toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  userName: string;
  userEmail: string;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const { makeAuthenticatedRequest, user, refreshUser } = useAuth();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initializePayment = async (): Promise<PaymentData | null> => {
    try {
      const response = await makeAuthenticatedRequest('/api/payment/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Payment service is not properly configured. Please contact support.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initialize payment');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      const errorMessage = error.message?.includes('JSON') 
        ? 'Payment service configuration error. Please contact support.'
        : error.message || 'Failed to initialize payment';
      
      toast.error({
        description: errorMessage
      });
      return null;
    }
  };

  const verifyPayment = async (paymentData: any): Promise<boolean> => {
    try {
      const response = await makeAuthenticatedRequest('/api/payment/razorpay', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_signature: paymentData.razorpay_signature,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Payment verification service error. Please contact support.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment verification failed');
      }

      await refreshUser(); // Refresh user data to get updated plan
      return true;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      const errorMessage = error.message?.includes('JSON') 
        ? 'Payment verification service error. Please contact support.'
        : error.message || 'Payment verification failed';
        
      toast.error({
        description: errorMessage
      });
      return false;
    }
  };

  const processPayment = async (onSuccess?: () => void) => {
    if (!user) {
      toast.error({
        description: 'Please sign in to upgrade to Pro'
      });
      return;
    }

    if (user.plan === 'pro') {
      toast.error({
        description: 'You are already on the Pro plan'
      });
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Initialize payment
      const paymentData = await initializePayment();
      if (!paymentData) {
        setLoading(false);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.orderId,
        name: '404 Monetizer',
        description: 'Upgrade to Pro Plan',
        image: '/favicon.ico',
        prefill: {
          name: paymentData.userName,
          email: paymentData.userEmail,
        },
        theme: {
          color: '#000000',
        },
        handler: async (response: any) => {
          const success = await verifyPayment(response);
          if (success) {
            toast.success({
              description: 'You have successfully upgraded to Pro!'
            });
            onSuccess?.();
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error({
        description: error.message || 'Failed to process payment'
      });
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
  };
}; 