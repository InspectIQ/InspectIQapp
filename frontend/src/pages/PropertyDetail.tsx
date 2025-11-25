import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { propertiesAPI, inspectionsAPI } from '../services/api'
import { Building2, MapPin, Plus, FileText, ArrowLeft } from 'lucide-react'
import { APP_ROUTES } from '../utils/routes'

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<any>(null)
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    try {
      const [propRes, inspsRes] = await Promise.all([
        propertiesAPI.get(parseInt(id!)),
        inspectionsAPI.list(parseInt(id!))
      ])
      setProperty(propRes.data)
      setInspections(inspsRes.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found</p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <button
          onClick={() => navigate(APP_ROUTES.properties)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Properties
        </button>
      </div>

      {/* Property Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Building2 className="h-10 w-10 text-primary-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {property.address_line1}
              </h1>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.city}, {property.state} {property.postal_code}
                </span>
              </div>
            </div>
          </div>
          <Link
            to={`/inspections/new?property=${property.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Inspection
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {property.property_type && (
            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {property.property_type}
              </p>
            </div>
          )}
          {property.unit_number && (
            <div>
              <p className="text-sm text-gray-500">Unit Number</p>
              <p className="text-sm font-medium text-gray-900">
                {property.unit_number}
              </p>
            </div>
          )}
          {property.num_rooms && (
            <div>
              <p className="text-sm text-gray-500">Number of Rooms</p>
              <p className="text-sm font-medium text-gray-900">
                {property.num_rooms}
              </p>
            </div>
          )}
          {property.square_feet && (
            <div>
              <p className="text-sm text-gray-500">Square Feet</p>
              <p className="text-sm font-medium text-gray-900">
                {property.square_feet.toLocaleString()} sq ft
              </p>
            </div>
          )}
          {property.year_built && (
            <div>
              <p className="text-sm text-gray-500">Year Built</p>
              <p className="text-sm font-medium text-gray-900">
                {property.year_built}
              </p>
            </div>
          )}
        </div>

        {property.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Notes</p>
            <p className="text-sm text-gray-900">{property.notes}</p>
          </div>
        )}
      </div>

      {/* Inspections */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Inspections</h2>
          <span className="text-sm text-gray-500">
            {inspections.length} total
          </span>
        </div>
        <div className="divide-y divide-gray-200">
          {inspections.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No inspections
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new inspection.
              </p>
              <div className="mt-6">
                <Link
                  to={`/inspections/new?property=${property.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Inspection
                </Link>
              </div>
            </div>
          ) : (
            inspections.map((inspection) => (
              <Link
                key={inspection.id}
                to={`/inspections/${inspection.id}`}
                className="block px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {inspection.inspection_type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(inspection.inspection_date).toLocaleDateString()}
                    </p>
                  </div>
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
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
