import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { propertiesAPI, inspectionsAPI } from '../services/api'
import { Building2, FileText, Plus, TrendingUp } from 'lucide-react'
import { APP_ROUTES } from '../utils/routes'

export default function Dashboard() {
  const [properties, setProperties] = useState<any[]>([])
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [propsRes, inspsRes] = await Promise.all([
        propertiesAPI.list(),
        inspectionsAPI.list()
      ])
      setProperties(propsRes.data)
      setInspections(inspsRes.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentInspections = inspections.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your property overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Properties
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {properties.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Inspections
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {inspections.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed This Month
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {inspections.filter(i => i.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to={APP_ROUTES.properties}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </Link>
          <Link
            to={APP_ROUTES.newInspection}
            className="flex items-center justify-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Inspection
          </Link>
        </div>
      </div>

      {/* Recent Inspections */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Inspections</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentInspections.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No inspections yet. Start your first inspection!
            </div>
          ) : (
            recentInspections.map((inspection) => (
              <Link
                key={inspection.id}
                to={APP_ROUTES.inspectionDetail(inspection.id)}
                className="block px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Inspection #{inspection.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {inspection.inspection_type.replace('_', ' ')} • Property #{inspection.property_id}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inspection.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : inspection.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {inspection.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        {recentInspections.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to={APP_ROUTES.inspections}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all inspections →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
