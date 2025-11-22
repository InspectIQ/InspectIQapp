import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { propertiesAPI } from '../services/api'
import { Building2, Plus, MapPin } from 'lucide-react'
import PropertyForm from '../components/PropertyForm'

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await propertiesAPI.list()
      setProperties(response.data)
    } catch (error) {
      console.error('Failed to load properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyCreated = () => {
    setShowForm(false)
    loadProperties()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="mt-2 text-gray-600">Manage your properties and inspections</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <PropertyForm
            onSuccess={handlePropertyCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first property.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/properties/${property.id}`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="h-8 w-8 text-primary-600" />
                  <span className="text-xs text-gray-500">
                    {property.property_type || 'Property'}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {property.address_line1}
                </h3>
                <div className="flex items-start text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    {property.city}, {property.state} {property.postal_code}
                  </span>
                </div>
                {property.unit_number && (
                  <p className="mt-2 text-sm text-gray-600">
                    Unit: {property.unit_number}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
