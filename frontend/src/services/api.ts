import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/v1/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login/json', data),
  
  getCurrentUser: () =>
    api.get('/api/v1/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/api/v1/auth/forgot-password', { email }),
  
  resetPassword: (token: string, new_password: string) =>
    api.post('/api/v1/auth/reset-password', { token, new_password }),
}

// Properties API
export const propertiesAPI = {
  list: () =>
    api.get('/api/v1/properties'),
  
  get: (id: number) =>
    api.get(`/api/v1/properties/${id}`),
  
  create: (data: any) =>
    api.post('/api/v1/properties', data),
  
  update: (id: number, data: any) =>
    api.put(`/api/v1/properties/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/api/v1/properties/${id}`),
  
  lookupAddress: (address: string) =>
    api.post('/api/v1/properties/lookup-address', { address }),
  
  quickCreate: (data: { address: string; property_type?: string; create_inspection?: boolean; inspection_type?: string }) =>
    api.post('/api/v1/properties/quick-create', data),
  
  getTemplates: () =>
    api.get('/api/v1/properties/templates'),
}

// Inspections API
export const inspectionsAPI = {
  list: (propertyId?: number) =>
    api.get('/api/v1/inspections', { params: { property_id: propertyId } }),
  
  get: (id: number) =>
    api.get(`/api/v1/inspections/${id}`),
  
  create: (data: any) =>
    api.post('/api/v1/inspections', data),
  
  addRoom: (inspectionId: number, data: any) =>
    api.post(`/api/v1/inspections/${inspectionId}/rooms`, data),
  
  addPhoto: (inspectionId: number, roomId: number, photoUrl: string) =>
    api.post(`/api/v1/inspections/${inspectionId}/rooms/${roomId}/photos`, null, {
      params: { photo_url: photoUrl }
    }),
  
  analyze: (id: number) =>
    api.post(`/api/v1/inspections/${id}/analyze`),
  
  downloadPDF: (id: number) =>
    api.get(`/api/v1/inspections/${id}/pdf`, { responseType: 'blob' }),
  
  delete: (id: number) =>
    api.delete(`/api/v1/inspections/${id}`),
  
  // New streamlining methods
  quickCreate: (data: { property_id: number; inspection_type?: string; auto_create_rooms?: boolean }) =>
    api.post('/api/v1/inspections/quick-create', data),
  
  bulkPhotoUpload: (files: File[], inspectionId: number, autoAssignRooms: boolean = true) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post('/api/v1/inspections/bulk-photo-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { inspection_id: inspectionId, auto_assign_rooms: autoAssignRooms }
    })
  },
  
  getTemplates: () =>
    api.get('/api/v1/inspections/templates'),
  
  autoAnalyze: (id: number) =>
    api.post(`/api/v1/inspections/${id}/auto-analyze`),
}

// Files API
export const filesAPI = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  uploadMultiple: (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post('/api/v1/files/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// Enhanced Inspections API
export const enhancedInspectionsAPI = {
  // Checklists
  getChecklists: (propertyType?: string, yearBuilt?: number, climateZone?: string) =>
    api.get('/api/v1/enhanced-inspections/checklists', { 
      params: { property_type: propertyType, year_built: yearBuilt, climate_zone: climateZone } 
    }),
  
  getChecklistDetails: (checklistId: string) =>
    api.get(`/api/v1/enhanced-inspections/checklists/${checklistId}`),
  
  getChecklistTests: (checklistId: string, category?: string) =>
    api.get(`/api/v1/enhanced-inspections/checklists/${checklistId}/tests`, { 
      params: { category } 
    }),
  
  // Test Results
  saveTestResult: (inspectionId: number, testData: any) =>
    api.post(`/api/v1/enhanced-inspections/inspections/${inspectionId}/tests`, testData),
  
  getInspectionResults: (inspectionId: number) =>
    api.get(`/api/v1/enhanced-inspections/inspections/${inspectionId}/results`),
  
  analyzeInspectionSystems: (inspectionId: number) =>
    api.post(`/api/v1/enhanced-inspections/inspections/${inspectionId}/analyze`),
  
  // Templates
  getInspectionTemplates: (propertyType?: string, purpose?: string) =>
    api.get('/api/v1/enhanced-inspections/templates', { 
      params: { property_type: propertyType, purpose } 
    }),
  
  // Measurements
  saveMeasurementReading: (inspectionId: number, measurementData: any) =>
    api.post(`/api/v1/enhanced-inspections/inspections/${inspectionId}/measurements`, measurementData),
  
  // Professional Tools
  getAvailableTools: () =>
    api.get('/api/v1/enhanced-inspections/tools/available'),
  
  connectTool: (toolId: string) =>
    api.post(`/api/v1/enhanced-inspections/tools/${toolId}/connect`),
  
  inputToolReading: (toolId: string, readingData: any) =>
    api.post(`/api/v1/enhanced-inspections/tools/${toolId}/reading`, readingData),
  
  getToolRecommendations: (testType: string, measurementType: string) =>
    api.get('/api/v1/enhanced-inspections/tools/recommendations', { 
      params: { test_type: testType, measurement_type: measurementType } 
    }),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () =>
    api.get('/api/v1/admin/dashboard'),
  
  getUsers: (search?: string, role?: string) =>
    api.get('/api/v1/admin/users', { params: { search, role } }),
  
  getUserDetail: (userId: number) =>
    api.get(`/api/v1/admin/users/${userId}`),
  
  updateUserRole: (userId: number, role: string) =>
    api.put(`/api/v1/admin/users/${userId}/role`, null, { params: { role } }),
  
  updateUserStatus: (userId: number, isActive: boolean) =>
    api.put(`/api/v1/admin/users/${userId}/status`, null, { params: { is_active: isActive } }),
  
  deleteUser: (userId: number) =>
    api.delete(`/api/v1/admin/users/${userId}`),
  
  getInspectionAnalytics: (days: number = 30) =>
    api.get('/api/v1/admin/analytics/inspections', { params: { days } }),
  
  getPropertyAnalytics: () =>
    api.get('/api/v1/admin/analytics/properties'),
  
  getSystemMetrics: () =>
    api.get('/api/v1/admin/system/metrics'),
}
