export const ROUTES = {
  public: {
    home: "/",
    request: "/request",
    track: "/track",
  },
  worker: {
    login: "/worker/login",
    dashboard: "/worker/dashboard",
    profile: "/worker/profile",
    offers: (dispatchId: string) => `/worker/offers/${dispatchId}`,
    job: (jobId: string) => `/worker/jobs/${jobId}`,
  },
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
    workers: "/admin/workers",
    jobs: "/admin/jobs",
    job: (jobId: string) => `/admin/jobs/${jobId}`,
    dispatch: "/admin/dispatch",
    payments: "/admin/payments",
    complaints: "/admin/complaints",
    settings: "/admin/settings",
    activityLogs: "/admin/activity-logs",
  },
  api: {
    health: "/api/health",
    publicBootstrap: "/api/public/bootstrap",
  },
} as const;
