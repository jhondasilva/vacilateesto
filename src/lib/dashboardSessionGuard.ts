/** Invalidate in-flight dashboard work before an identity change can render it. */
export function createDashboardSessionGuard() {
  let revision = 0;
  return {
    next: () => ++revision,
    current: (ticket: number) => ticket === revision,
    cancel: () => { revision += 1; },
  };
}
