/**
 * Centralized route definitions to prevent navigation issues
 * All authenticated app routes are prefixed with /app
 */

// Authenticated app routes (require login)
export const APP_ROUTES = {
  dashboard: '/app',
  properties: '/app/properties',
  propertyDetail: (id: number | string) => `/app/properties/${id}`,
  inspections: '/app/inspections',
  inspectionDetail: (id: number | string) => `/app/inspections/${id}`,
  newInspection: '/app/inspections/new',
  newInspectionWithProperty: (propertyId: number | string) => `/app/inspections/new?property=${propertyId}`,
  
  // Admin routes
  admin: '/app/admin',
  adminUsers: '/app/admin/users',
  adminAnalytics: '/app/admin/analytics',
  adminSystem: '/app/admin/system',
} as const

// Public marketing routes (no login required)
export const PUBLIC_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
  demo: '/demo',
  demoReport: '/demo-report',
  blog: '/blog',
  faq: '/faq',
  
  // Feature pages
  forHomeowners: '/for-homeowners',
  forInspectors: '/for-inspectors',
  forPropertyManagers: '/for-property-managers',
  howAIWorks: '/how-ai-works',
  caseStudies: '/case-studies',
  comparison: '/comparison',
} as const

// Helper to check if a route is an app route
export const isAppRoute = (path: string): boolean => {
  return path.startsWith('/app')
}

// Helper to check if a route is public
export const isPublicRoute = (path: string): boolean => {
  return !isAppRoute(path)
}
