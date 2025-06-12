# Payment Setup Guide

## Razorpay Integration Setup

To fix the payment integration issue, you need to set up your Razorpay environment variables.

### 1. Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Generate your **Key ID** and **Key Secret**

### 2. Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="your_razorpay_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"

# Other existing variables...
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your_jwt_secret"
```

### 3. Test Mode vs Live Mode

- **Test Mode**: Use test credentials (starts with `rzp_test_`)
- **Live Mode**: Use live credentials (starts with `rzp_live_`)

### 4. Restart Development Server

After adding the environment variables:

```bash
npm run dev
```

### 5. Test Payment Flow

1. Click "Get Pro Access" or "Upgrade to Pro" button
2. Razorpay checkout should open
3. Use test payment details in test mode:
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits

### Common Issues

1. **JSON Parse Error**: Missing environment variables (fixed in latest code)
2. **Unauthorized Error**: Check authentication setup
3. **Payment Failed**: Verify Razorpay credentials

### Current Status

✅ **Fixed**: Added proper error handling for missing environment variables
✅ **Fixed**: API now returns JSON errors instead of HTML
✅ **Fixed**: Better error messages for debugging

The payment integration is now ready once you add your Razorpay credentials! 