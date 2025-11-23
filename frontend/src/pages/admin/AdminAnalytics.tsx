import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { BarChart3, Home, FileText } from 'lucide-react'

interface InspectionAnalytics {
  total_inspections: number
  inspections_by_day: Array<{ date: string; count: number }>
  status_breakdown: Record<string, number>
  avg_completion_time_minutes: number
}

interface PropertyAnalytics {
  total_properties: number
  properties_by_type: Record<string, number>
  properties_by_location: Record<string, number>
  avg_property_age_years: number
}

export default function AdminAnalytics() {
  const [inspectionData, setInspectionData] = useState<InspectionAnalytics | null>(null)
  const [propertyData, setPropertyData] = useState<PropertyAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const [inspections, properties] = await Promise.all([
        adminAPI.getInspectionAnalytics(timeRange),
        adminAPI.getPropertyAnalytics()
      ])
      setInspectionData(inspections.data)
      setPropertyData(properties.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Detailed insights into your platform performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Inspection Analytics */}
      {inspectionData && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Inspection Analytics</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Inspections</p>
              <p className="text-2xl font-bold text-gray-900">{inspectionData.total_inspections}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Avg Completion Time</p>
              <p className="text-2xl font-bold text-gray-900">{inspectionData.avg_completion_time_minutes} min</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {inspectionData.total_inspections > 0
                  ? Math.round((inspectionData.status_breakdown.completed || 0) / inspectionData.total_inspections * 100)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(inspectionData.status_breakdown).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600 capitalize">{status}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-primary-600 h-4 rounded-full"
                      style={{
                        width: `${(count / inspectionData.total_inspections) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Chart (Simple Bar Chart) */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Inspections Over Time</h3>
            <div className="flex items-end space-x-2 h-48">
              {inspectionData.inspections_by_day.slice(-14).map((day, index) => {
                const maxCount = Math.max(...inspectionData.inspections_by_day.map(d => d.count))
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary-600 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${day.date}: ${day.count} inspections`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Property Analytics */}
      {propertyData && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Home className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Property Analytics</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{propertyData.total_properties}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Avg Property Age</p>
              <p className="text-2xl font-bold text-gray-900">{propertyData.avg_property_age_years} years</p>
            </div>
          </div>

          {/* Property Types */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Properties by Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(propertyData.properties_by_type).map(([type, count]) => (
                <div key={type} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{type}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top Locations</h3>
            <div className="space-y-2">
              {Object.entries(propertyData.properties_by_location).slice(0, 10).map(([location, count]) => (
                <div key={location} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">{location}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{
                        width: `${(count / propertyData.total_properties) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
