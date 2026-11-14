'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

/** Starts PostHog once the visitor has accepted analytics. Renders nothing. See lib/analytics.ts. */
export function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
