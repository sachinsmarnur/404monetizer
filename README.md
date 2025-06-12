This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 404 Monetizer

Turn your 404 pages into revenue-generating opportunities.

## Features

### Subscription Management with Downgrade Protection

The application now includes sophisticated subscription management that handles plan downgrades gracefully:

#### Pro Plan Expiration & Downgrade Handling

When a user's Pro subscription expires, the following behavior is implemented:

1. **Page Access Control**: Pages created during Pro subscription that exceed free plan limits (beyond the first page) become disabled and inaccessible.

2. **Visual Indicators**: Disabled pages are shown with:
   - Dimmed/muted appearance
   - "Disabled" badge 
   - Lock icons
   - Dashed borders

3. **Functionality Restrictions**: For disabled pages:
   - View/Edit/Duplicate/Archive/Delete actions are disabled
   - Analytics show "---" instead of actual metrics
   - All page actions show "Locked" state

4. **Dynamic Usage Messages**: 
   - Free plan: "You have used X of your 1 page limit"
   - Expired Pro: "Your Pro plan has expired. X pages are now disabled. Upgrade to Pro to regain access."
   - Active Pro: "You have used X of your 50 page limit"

5. **Upgrade Prompts**: Disabled pages section includes prominent "Upgrade to Pro" button to restore access.

#### Implementation Details

- **Plan Utils**: New utility functions in `src/lib/plan-utils.ts`:
  - `getMaxPagesForUser()` - Returns page limit based on effective plan
  - `getUsageMessage()` - Dynamic usage text based on plan status  
  - `isPageAccessible()` - Determines if specific page is accessible
  - `hasDisabledPages()` - Checks if user has inaccessible pages
  - `getDisabledPagesCount()` - Count of disabled pages

- **Page Sorting**: Pages are sorted by creation date (oldest first) to ensure the earliest created pages remain accessible when plan downgrades.

- **UI Components**: Enhanced `src/app/dashboard/pages/page.tsx` with:
  - Disabled page styling and indicators
  - Dynamic usage warnings
  - Upgrade prompts for plan renewal
  - Proper access control for all page actions

#### User Experience Flow

1. **Active Pro User**: Creates 39 pages, all accessible with full functionality
2. **Plan Expires**: After 30 days, subscription automatically expires
3. **Downgrade**: User is limited to free plan (1 page maximum)
4. **Access Control**: 
   - First page (oldest): Remains fully accessible
   - Remaining 38 pages: Become disabled and locked
5. **Visual Feedback**: Dashboard clearly shows disabled status and upgrade options
6. **Restoration**: Upon upgrading back to Pro, all pages become accessible again

This ensures users understand the value of their Pro subscription while providing a clear path to restore access to their content.

## Original Features

- Create custom 404 pages
- Multiple monetization options
- Analytics tracking
- Theme customization
- Responsive design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
