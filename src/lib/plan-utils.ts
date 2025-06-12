interface User {
  plan: 'free' | 'pro';
  plan_expires_at?: string | null;
}

/**
 * Check if a user's plan is currently active
 */
export function isPlanActive(user: User): boolean {
  if (user.plan === 'free') {
    return true; // Free plans never expire
  }

  if (user.plan === 'pro') {
    if (!user.plan_expires_at) {
      // If no expiration date is set, assume it's still valid (legacy data)
      return true;
    }

    const expirationDate = new Date(user.plan_expires_at);
    const now = new Date();
    return expirationDate > now;
  }

  return false;
}

/**
 * Get the effective plan for a user (considering expiration)
 */
export function getEffectivePlan(user: User): 'free' | 'pro' {
  if (isPlanActive(user)) {
    return user.plan;
  }
  return 'free'; // Expired pro plans become free
}

/**
 * Check if a user has pro features access
 */
export function hasProAccess(user: User): boolean {
  return getEffectivePlan(user) === 'pro';
}

/**
 * Get days remaining until plan expires
 */
export function getDaysUntilExpiration(user: User): number | null {
  if (user.plan !== 'pro' || !user.plan_expires_at) {
    return null;
  }

  const expirationDate = new Date(user.plan_expires_at);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if plan is expiring soon (within 7 days)
 */
export function isPlanExpiringSoon(user: User): boolean {
  const daysUntilExpiration = getDaysUntilExpiration(user);
  return daysUntilExpiration !== null && daysUntilExpiration <= 7 && daysUntilExpiration > 0;
}

/**
 * Check if plan has already expired
 */
export function isPlanExpired(user: User): boolean {
  const daysUntilExpiration = getDaysUntilExpiration(user);
  return daysUntilExpiration !== null && daysUntilExpiration <= 0;
}

/**
 * Format expiration date for display
 */
export function formatExpirationDate(user: User): string | null {
  if (!user.plan_expires_at) {
    return null;
  }

  const date = new Date(user.plan_expires_at);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get the maximum number of pages allowed for a user's current effective plan
 */
export function getMaxPagesForUser(user: User): number {
  return hasProAccess(user) ? 50 : 1;
}

/**
 * Get the number of accessible pages for a user (considering their current plan)
 */
export function getAccessiblePagesCount(user: User, totalPages: number): number {
  const maxPages = getMaxPagesForUser(user);
  return Math.min(totalPages, maxPages);
}

/**
 * Check if a specific page is accessible to the user based on their plan and page creation order
 */
export function isPageAccessible(user: User, pageIndex: number): boolean {
  const maxPages = getMaxPagesForUser(user);
  return pageIndex < maxPages;
}

/**
 * Get the number of disabled/inaccessible pages for a user
 */
export function getDisabledPagesCount(user: User, totalPages: number): number {
  const maxPages = getMaxPagesForUser(user);
  return Math.max(0, totalPages - maxPages);
}

/**
 * Check if user has pages that are disabled due to plan downgrade
 */
export function hasDisabledPages(user: User, totalPages: number): boolean {
  return getDisabledPagesCount(user, totalPages) > 0;
}

/**
 * Get usage message based on user's plan status and page count
 */
export function getUsageMessage(user: User, totalPages: number): string {
  const maxPages = getMaxPagesForUser(user);
  const userHasProAccess = hasProAccess(user);
  const isExpired = isPlanExpired(user);
  const disabledCount = getDisabledPagesCount(user, totalPages);

  if (isExpired && disabledCount > 0) {
    return `Your Pro plan has expired. ${disabledCount} page${disabledCount > 1 ? 's are' : ' is'} now disabled. Upgrade to Pro to regain access.`;
  } else if (!userHasProAccess && totalPages > maxPages) {
    return `You have ${totalPages} pages but can only access ${maxPages} on the free plan. Upgrade to Pro to access all your pages.`;
  } else {
    return `You have used ${totalPages} of your ${maxPages} page limit`;
  }
} 