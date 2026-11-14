'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/** Starts PostHog once per page load. Renders nothing. See lib/analytics.ts. */
export function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
